import { Card, Text } from "react-native-paper";
import { View } from "react-native";

export const Statistics = () => {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Card style={{ marginBottom: 10 }}>
        <Card.Content
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="displayLarge">2</Text>
          <Text variant="headlineLarge">Eigene Fahrzeuge</Text>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="displayLarge">17</Text>
          <Text variant="headlineLarge">Geliehene Fahrzeuge</Text>
        </Card.Content>
      </Card>
    </View>
  );
};
