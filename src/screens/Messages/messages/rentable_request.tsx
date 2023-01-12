import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import { AuthContext } from "~/provider/AuthProvider";
import { supabase } from "~/supabase";
import { Message, Profile, Rentable } from "~/types";

export function RentableRequestMessage({
  message,
  chatPartner,
}: {
  message: Message;
  chatPartner: Profile;
}) {
  const { user } = useContext(AuthContext);

  const [rentable, setRentable] = useState<Rentable>();
  const messageContext = message.context as {
    rentable: string;
    granted?: boolean;
  };
  const rentableId = messageContext?.rentable;

  useEffect(() => {
    (async () => {
      const response = await supabase
        .from("rentables")
        .select("*")
        .eq("id", rentableId)
        .single();

      if (response.data) {
        setRentable(response.data);
      }
    })();
  }, []);

  async function grantAccess() {
    // TODO: add chat partner to trusted party

    let res = await supabase
      .from("messages")
      .update({
        ...message,
        context: {
          ...messageContext,
          granted: true,
        },
      })
      .eq("id", message.id);

    if (res.error) {
      Toast.show({ type: "error", text1: res.error.message });
      return;
    }

    res = await supabase.from("messages").insert({
      message: `Du hast jetzt Zugriff auf "${rentable?.model}".`,
      type: "rentable_request_response",
      context: {
        rentable: rentable?.id!,
        granted: true,
      },
      author: user?.id!,
      target: chatPartner?.id!,
    });

    if (res.error) {
      Toast.show({ type: "error", text1: res.error.message });
      return;
    }

    Toast.show({ type: "success", text1: "Zugriff gewährt" });
  }

  async function denyAccess() {
    let res = await supabase
      .from("messages")
      .update({
        ...message,
        context: {
          ...messageContext,
          granted: false,
        },
      })
      .eq("id", message.id);

    if (res.error) {
      Toast.show({ type: "error", text1: res.error.message });
      return;
    }

    res = await supabase.from("messages").insert({
      message: `Der Zugriff auf "${rentable?.model}" wurde dir verweigert.`,
      type: "rentable_request_response",
      context: {
        rentable: rentable?.id!,
        granted: false,
      },
      author: user?.id!,
      target: chatPartner?.id!,
    });

    if (res.error) {
      Toast.show({ type: "error", text1: res.error.message });
      return;
    }

    Toast.show({ type: "success", text1: "Zugriff verweigert" });
  }

  return message?.author === user?.id ? (
    <View
      style={{
        backgroundColor: "white",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        maxWidth: "70%",
        alignSelf: "flex-end",
      }}
    >
      <Text>Du hast Zugriff auf "{rentable?.model}" angefragt.</Text>
      <Text style={{ marginLeft: "auto", fontSize: 10 }}>
        {dayjs(message.created_at).format("HH:mm")}
      </Text>
    </View>
  ) : (
    <View style={{ flex: 1, alignSelf: "flex-start", maxWidth: "70%" }}>
      <View
        style={{
          backgroundColor: "white",
          borderColor: "#e0e0e0",
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text>
          {chatPartner.full_name} möchte Zugriff auf "{rentable?.model}"
          erhalten!
        </Text>
        <Text style={{ marginLeft: "auto", fontSize: 10 }}>
          {dayjs(message.created_at).format("HH:mm")}
        </Text>
      </View>
      {messageContext.granted === undefined && (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Button style={{ marginRight: 5 }} onPress={grantAccess}>
            Ok
          </Button>
          <Button onPress={denyAccess}>Nope!</Button>
        </View>
      )}
    </View>
  );
}
