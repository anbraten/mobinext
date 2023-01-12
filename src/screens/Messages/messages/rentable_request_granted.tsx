import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { AuthContext } from "~/provider/AuthProvider";
import { supabase } from "~/supabase";
import { Message, Profile, Rentable } from "~/types";

export function RentableRequestGrantedMessage({
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

  return (
    <View
      style={{
        backgroundColor: "#e0e0e0",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        maxWidth: "70%",
        alignSelf: "flex-start",
      }}
    >
      <Text>
        {chatPartner.full_name} hat jetzt Zugriff auf "{rentable?.model}".
      </Text>
    </View>
  );
}
