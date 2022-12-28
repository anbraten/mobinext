import { useContext } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { AuthContext } from "~/provider/AuthProvider";
import { Message } from "~/types";

export function TextMessage({ message }: { message: Message }) {
  const { user } = useContext(AuthContext);

  return (
    <View
      style={{
        backgroundColor: message?.author === user?.id ? "#eadcf9" : "#dddddd",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text>{message?.message}</Text>
    </View>
  );
}
