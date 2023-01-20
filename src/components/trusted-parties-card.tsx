import { View } from "react-native";
import { Avatar, Card, Chip, Title } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

export const TrustedPartiesCard = ({
  title,
  role,
  callback,
}: {
  title: string;
  role: string;
  callback: () => void;
}) => {
  return (
    <Card style={{ margin: 10 }} onPress={callback}>
      <Card.Content
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar.Icon size={50} icon="account-group" />
          <View
            style={{
              marginLeft: 15,
            }}
          >
            <Title>{title}</Title>
            <Chip>{role}</Chip>
          </View>
        </View>

        <Ionicons name="chevron-forward" color={"black"} size={24} />
      </Card.Content>
    </Card>
  );
};
