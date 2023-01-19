import { ScrollView } from "react-native";
import { ReviewCard } from "~/components/review-card";

export const Reviews = () => {
  return (
    <ScrollView style={{ flex: 1, padding: 5 }}>
      <ReviewCard
        username="Albert Einstein"
        rating={4.5}
        text={"Das hat wirklich gut funktioniert! Vielen Dank dafür!"}
        date={"vor 2 Monaten"}
        key={0}
      />
    </ScrollView>
  );
};
