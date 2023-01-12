import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { supabase } from "~/supabase";
import { Message, Profile, Rentable } from "~/types";

export function RentableRequestResponseMessage({
  message,
  chatPartner,
}: {
  message: Message;
  chatPartner: Profile;
}) {
  const [rentable, setRentable] = useState<Rentable>();
  const rentableId = (message.context as { rentable: string })?.rentable;
  const messageContext = message.context as {
    rentable: string;
    granted?: boolean;
  };

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

  return message.target === chatPartner.id ? (
    <View
      style={{
        backgroundColor: "white",
        borderColor: messageContext.granted ? "#4caf50" : "#f44336",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        maxWidth: "70%",
        alignSelf: "flex-start",
      }}
    >
      {messageContext.granted ? (
        <Text>
          Du hast {chatPartner.full_name} Zugriff auf "{rentable?.model}"
          gegeben.
        </Text>
      ) : (
        <Text>
          Du hast {chatPartner.full_name} den Zugriff auf "{rentable?.model}"
          verweigert.
        </Text>
      )}
      <Text style={{ marginLeft: "auto", fontSize: 10 }}>
        {dayjs(message.created_at).format("HH:mm")}
      </Text>
    </View>
  ) : (
    <View
      style={{
        backgroundColor: "white",
        borderColor: messageContext.granted ? "#4caf50" : "#f44336",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        maxWidth: "70%",
        alignSelf: "flex-end",
      }}
    >
      {messageContext.granted ? (
        <Text>Dir wurde Zugriff auf "{rentable?.model}" gegeben.</Text>
      ) : (
        <Text>Dir wurde der Zugriff auf "{rentable?.model}" verweigert.</Text>
      )}
      <Text style={{ marginLeft: "auto", fontSize: 10 }}>
        {dayjs(message.created_at).format("HH:mm")}
      </Text>
    </View>
  );
}
