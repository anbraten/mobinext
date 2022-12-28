import { useContext } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { AuthContext } from "~/provider/AuthProvider";
import { Message } from "~/types";

export function RentableRequestMessage({ message }: { message: Message }) {
  const { user } = useContext(AuthContext);

  return (
    <View
      style={{
        backgroundColor: message?.author === user?.id ? "#eadcf9" : "#dddddd",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text>Da will wer dein Auto!</Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Button>Ok</Button>
        <Button>Nope!</Button>
      </View>
    </View>
  );
}
