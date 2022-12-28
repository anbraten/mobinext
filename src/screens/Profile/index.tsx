import { useContext, useEffect, useState } from "react";
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
import { TrustedPartiesCard } from "../../components/trusted-parties-card";
import { ReviewCard } from "../../components/review-card";
import { Trusted_parties } from "~/types";
import { RealtimeChannel } from "@supabase/supabase-js";

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

type Trusted_Party_With_Members = Trusted_parties & {
  trusted_party_members: { user_id: string }[];
};

const Profile = ({ navigation }: any) => {
  const { user, setUser } = useContext(AuthContext);
  const [value, setValue] = useState("trustedParties");

  const TrustedParties = () => {
    const [trustedParties, setTrustedParties] = useState<Trusted_parties[]>([]);

    let trustedPartiesSubsription: RealtimeChannel;

    const fetchTrustedParties = async () => {
      const { data, error } = (await supabase
        .from("trusted_parties")
        .select("*, trusted_party_members(user_id)")) as any;

      const filteredData = data?.filter(
        (trustedParty: Trusted_Party_With_Members) => {
          return (
            trustedParty.trusted_party_members.some((member) => {
              return member.user_id === user?.id;
            }) || trustedParty.owner === user?.id
          );
        }
      );

      if (filteredData) {
        setTrustedParties(filteredData);
      }

      trustedPartiesSubsription = supabase
        .channel("trusted_parties:*")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "trusted_parties" },
          (payload) => {
            fetchTrustedParties();
          }
        )
        .subscribe();
    };

    useEffect(() => {
      fetchTrustedParties();
    }, []);

    useEffect(() => {
      generateTrustedPartyElements();
    }, [trustedParties]);

    const generateTrustedPartyElements = () => {
      trustedPartyElements = [];
      trustedPartyElements = trustedParties.map((trustedParty) => (
        <TrustedPartiesCard
          title={trustedParty.name as string}
          role={trustedParty.owner === user?.id ? "Owner" : "Member"}
          key={trustedParty.id}
          callback={() => {
            navigation.navigate("NewTrustedParty", {
              trustedPartyId: trustedParty.id,
              update: true,
            });
          }}
        />
      ));
    };

    let trustedPartyElements: JSX.Element[] = [];
    generateTrustedPartyElements();

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ padding: 15 }}>{trustedPartyElements}</ScrollView>
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() =>
            navigation.navigate("NewTrustedParty", {
              trustedParties: trustedParties,
            })
          }
        />
      </View>
    );
  };

  const Reviews = () => {
    return (
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <ReviewCard
          username="User_7"
          rating={4.5}
          text={"This worked really good! Thank you!"}
          date={"2 months ago"}
        />
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
              <Avatar.Text size={65} label={user?.full_name?.[0] || "A"} />
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
