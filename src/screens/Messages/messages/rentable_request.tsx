import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import { AuthContext } from "~/provider/AuthProvider";
import { supabase } from "~/supabase";
import { Message, Profile, Rentable, Trusted_parties } from "~/types";

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

  async function getOrCreateTrustedParty() {
    const tp_rentable = await supabase
      .from("trusted_party_rentables")
      .select("*")
      .eq("rentable_id", rentable?.id!);

    if (tp_rentable.error) {
      console.error(tp_rentable.error);
      Toast.show({ type: "error", text1: tp_rentable.error.message });
      return;
    }

    if (tp_rentable.data?.length || 0 > 0) {
      return tp_rentable.data[0].trusted_party_id;
    }

    const tp = await supabase
      .from("trusted_parties")
      .insert({
        name: `${user?.full_name} - ${chatPartner.full_name}`,
        owner: user?.id,
      })
      .select();

    if (tp.error) {
      console.error(tp.error);
      Toast.show({ type: "error", text1: tp.error?.message });
      return;
    }

    const trusted_party_id = tp.data[0].id;

    let res = await supabase.from("trusted_party_members").insert({
      trusted_party_id,
      pending: false,
      user_id: chatPartner.id,
    });

    if (res.error) {
      console.error(res.error);
      Toast.show({ type: "error", text1: res.error?.message });
      return;
    }

    res = await supabase.from("trusted_party_rentables").insert({
      trusted_party_id,
      rentable_id: rentable?.id!,
    });

    return trusted_party_id;
  }

  async function grantAccess() {
    const trustedPartyId = await getOrCreateTrustedParty();
    if (!trustedPartyId) {
      return;
    }

    let res = await supabase.from("trusted_party_members").insert({
      trusted_party_id: trustedPartyId,
      user_id: chatPartner.id,
      pending: false,
    });

    if (res.error) {
      console.error(res.error);
      Toast.show({ type: "error", text1: res.error.message });
      return;
    }

    res = await supabase
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
      console.error(res.error);
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
      console.error(res.error);
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
