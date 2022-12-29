import { useContext, useState } from "react";
import { View, Alert, Pressable, Platform } from "react-native";
import {
  Avatar,
  Divider,
  Headline,
  Button,
  MD3Colors,
  List,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "~/supabase";
import { AuthContext } from "~/provider/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import Toast from "react-native-toast-message";

export const Profile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Profile">) => {
  const { user, setUser } = useContext(AuthContext);

  async function uploadProfileImage() {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: false,
      });

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
      } as unknown as Blob);

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
      <View style={{ paddingTop: 20 }}>
        <List.Item
          title="Profil"
          left={(props) => <List.Icon {...props} icon="account" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            Toast.show({
              type: "success",
              text1: "Soon™",
            });
          }}
        />
        <List.Item
          title="Deine Fahrzeuge"
          left={(props) => <List.Icon {...props} icon="car-convertible" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.push("OwnRentables")}
        />
        <List.Item
          title="Trusted Parties"
          left={(props) => <List.Icon {...props} icon="check-decagram" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.push("TrustedParties")}
        />
        <List.Item
          title="Reviews"
          left={(props) => <List.Icon {...props} icon="message-draw" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.push("Reviews")}
        />
        <List.Item
          title="Statistiken"
          left={(props) => <List.Icon {...props} icon="chart-line-variant" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.push("Statistics")}
        />
      </View>
    </SafeAreaView>
  );
};
