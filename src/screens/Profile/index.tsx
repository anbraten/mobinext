import { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import {
  Avatar,
  Divider,
  Headline,
  Text,
  FAB,
  Card,
  Title,
  Chip,
  SegmentedButtons,
  Button,
  MD3Colors,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "~/supabase";
import { AuthContext } from "~/provider/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import { TrustedPartiesCard } from "./trusted-parties-card";
import { ReviewCard } from "./review-card";

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

  const [value, setValue] = useState("trustedParties");

  const TrustedParties = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ padding: 15 }}>
          <TrustedPartiesCard title="Family" role="Member" />
        </ScrollView>
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => console.log("Pressed")}
        />
      </View>
    );
  };

  const Reviews = () => {
    return (
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <ReviewCard username="User_7" rating={4.5} text={'This worked really good! Thank you!'} date={'2 months ago'} />
      </ScrollView>
    );
  };

  const Statistics = () => {
    return (
      <View style={{ flex: 1, padding: 15 }}>
        <Card style={{ marginBottom: 10 }}>
          <Card.Content
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text variant="displayLarge">2</Text>
            <Text variant="headlineLarge">Vehicles loaned</Text>
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
            <Text variant="headlineLarge">Vehicles rented</Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderContent = () => {
    switch (value) {
      case "trustedParties":
        return <TrustedParties />;
      case "reviews":
        return <Reviews />;
      case "statistics":
        return <Statistics />;
    }
  };

  async function uploadProfileImage() {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }

    console.log("pick");

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: false,
      });

      console.log(result);

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const fileExt = file.uri.substring(file.uri.lastIndexOf(".") + 1);
      const fileName = file.uri.replace(/^.*[\\\/]/, "");

      const formData = new FormData();
      formData.append("files", {
        uri: file.uri,
        name: fileName,
        type: file.type ? `image/${fileExt}` : `video/${fileExt}`,
      });

      const filePath = `${user?.id}.${fileExt}`;

      const { error } = await supabase.storage
        .from("avatars")
        .update(filePath, formData, { upsert: true });
      if (error) {
        throw error;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      if (error) {
        throw error;
      }

      const { error: error3 } = await supabase
        .from("profiles")
        .update({
          avatar_url: data.publicUrl,
        })
        .match({ id: user?.id });

      if (error3) {
        throw error3;
      }

      setUser && setUser({ ...user!, avatar_url: filePath });
    } catch (error) {
      console.error(error);
      Alert.alert((error as Error).message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 15,
          paddingTop: 5,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={() => uploadProfileImage()}>
            {user?.avatar_url ? (
              <Avatar.Image size={65} source={{ uri: user?.avatar_url }} />
            ) : (
              <Avatar.Text size={72} label="PL" />
            )}
          </Pressable>
          <View style={{ paddingLeft: 25 }}>
            <Headline>{user?.full_name}</Headline>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Ionicons name="star" color={"black"} size={24} />
              <Ionicons name="star" color={"black"} size={24} />
              <Ionicons name="star" color={"black"} size={24} />
              <Ionicons name="star" color={"black"} size={24} />
              <Ionicons name="star-half-sharp" color={"black"} size={24} />
            </View>
          </View>
        </View>
        <Button
          mode="contained"
          buttonColor={MD3Colors.error50}
          compact
          onPress={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert(error.message);
            }
          }}
        >
          Logout
        </Button>
      </View>
      <Divider style={{ height: 1.5 }} />
      <View
        style={{
          paddingTop: 15,
          paddingHorizontal: 20,
        }}
      >
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "trustedParties",
              label: "Trusted Parties",
            },
            {
              value: "reviews",
              label: "Reviews",
            },
            {
              value: "statistics",
              label: "Statistics",
            },
          ]}
        />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

export default Profile;
