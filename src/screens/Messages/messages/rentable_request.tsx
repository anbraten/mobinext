import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { ErrorToast, SuccessToast } from "react-native-toast-message";
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
  const rentableId = (message.context as { rentable: string })?.rentable;

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
    // TODO: set property of this message to hide action buttons

    const res = await supabase.from("messages").insert({
      message: `Du hast jetzt Zugriff auf "${rentable?.model}".`,
      type: "rentable_request_granted",
      context: {
        rentable: rentable?.id!,
      },
      author: user?.id!,
      target: chatPartner?.id!,
    });

    if (res.error) {
      ErrorToast({ text1: res.error.message });
      return;
    }

    SuccessToast({ text1: "Zugriff gewährt" });
  }

  async function denyAccess() {
    SuccessToast({ text1: "TODO" });
  }

  return message?.author === user?.id ? (
    <View
      style={{
        backgroundColor: "red",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        maxWidth: "70%",
        alignSelf: "flex-end",
      }}
    >
      <Text>Du hast Zugriff auf "{rentable?.model}" angefragt.</Text>
    </View>
  ) : (
    <View style={{ flex: 1, alignSelf: "flex-start", maxWidth: "70%" }}>
      <View
        style={{
          backgroundColor: "lime",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text>
          {chatPartner.full_name} möchte Zugriff auf "{rentable?.model}"
          erhalten!
        </Text>
      </View>
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
    </View>
  );
}
