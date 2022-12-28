import dayjs from "dayjs";
import { useContext } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { AuthContext } from "~/provider/AuthProvider";
import { Message, Profile } from "~/types";

export function TextMessage({
  message,
}: {
  message: Message;
  chatPartner: Profile;
}) {
  const { user } = useContext(AuthContext);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "70%",
        alignSelf: message?.author === user?.id ? "flex-end" : "flex-start",
        backgroundColor: message?.author === user?.id ? "#eadcf9" : "#dddddd",
        borderRadius: 5,
        padding: 10,
      }}
    >
      <Text>{message?.message}</Text>
      <Text style={{ marginLeft: "auto", fontSize: 10 }}>
        {dayjs(message.created_at).format("HH:mm")}
      </Text>
    </View>
  );
}
