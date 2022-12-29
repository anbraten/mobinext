import { ScrollView } from "react-native";
import { ReviewCard } from "~/components/review-card";

export const Reviews = () => {
  return (
    <ScrollView style={{ flex: 1, padding: 5 }}>
      <ReviewCard
        username="User_7"
        rating={4.5}
        text={"This worked really good! Thank you!"}
        date={"2 months ago"}
        key={0}
      />
    </ScrollView>
  );
};
