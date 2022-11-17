import { View, ScrollView } from "react-native";
import { Text, Card, Avatar, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

const Messages = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <Card style={{ marginBottom: 10 }}>
          <Card.Content
            style={{
              display: "flex",
              flexDirection: "row",
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
              <Avatar.Text size={65} label="U1" />
              <View style={{ marginLeft: 15 }}>
                <Title>User_2</Title>
                <Text
                  variant="bodyLarge"
                  style={{ marginTop: 5, flex: 1 }}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  Invite me!
                </Text>
              </View>
            </View>
            <Text variant="bodyLarge" style={{ flex: 1, textAlign: "right" }}>
              10 minutes ago
            </Text>
            <Ionicons
              name="chevron-forward"
              color={"black"}
              size={24}
              style={{ alignSelf: "center" }}
            />
          </Card.Content>
        </Card>
        <Card style={{ marginBottom: 10 }}>
          <Card.Content
            style={{
              display: "flex",
              flexDirection: "row",
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
              <Avatar.Text size={65} label="U2" />
              <View style={{ marginLeft: 15 }}>
                <Title>User_2</Title>
                <Text variant="bodyLarge" style={{ marginTop: 5 }}>
                  All good. Thanks!
                </Text>
              </View>
            </View>
            <Text variant="bodyLarge">2 hours ago</Text>
            <Ionicons
              name="chevron-forward"
              color={"black"}
              size={24}
              style={{ alignSelf: "center" }}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Messages;
