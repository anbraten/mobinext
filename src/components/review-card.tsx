import { View } from "react-native";
import { Avatar, Card, Chip, Title, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

export const ReviewCard = ({
  username,
  rating,
  text,
  date,
}: {
  username: string;
  rating: number;
  text: string;
  date: string;
}) => {
  const fullStars = Math.floor(rating);
  const halfStars = Math.round(rating - fullStars);

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Ionicons key={`fS-${i}`} name="star" color={"black"} size={24} />
    );
  }
  for (let i = 0; i < halfStars; i++) {
    stars.push(
      <Ionicons
        key={`hS-${i}`}
        name="star-half-sharp"
        color={"black"}
        size={24}
      />
    );
  }

  const label =
    username[0].toUpperCase() + username[username.length - 1].toUpperCase();

  return (
    <Card style={{ margin: 10 }}>
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
          <Avatar.Text size={65} label={label} />
          <View style={{ marginLeft: 15 }}>
            <Title>{username}</Title>
            <View style={{ display: "flex", flexDirection: "row" }}>
              {stars}
            </View>
            <Text
              variant="bodyLarge"
              style={{ marginTop: 5, marginRight: 50 }}
              lineBreakMode="tail"
            >
              {text}
            </Text>
          </View>
        </View>
        <Text variant="bodyLarge">{date}</Text>
      </Card.Content>
    </Card>
  );
};
