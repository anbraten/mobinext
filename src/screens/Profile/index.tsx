import { useContext, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
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
import { supabase } from "~/supabase.ts";
import { AuthContext } from "~/provider/AuthProvider";

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [value, setValue] = useState("trustedParties");

  const TrustedParties = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ padding: 15 }}>
          <Card style={{ marginBottom: 10 }}>
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
                <Avatar.Text size={65} label="F" />
                <View style={{ marginLeft: 15 }}>
                  <Title>Family</Title>
                  <Chip>Owner</Chip>
                </View>
              </View>

              <Ionicons name="chevron-forward" color={"black"} size={24} />
            </Card.Content>
          </Card>

          <Card>
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
                <Avatar.Text size={65} label="N" />
                <View style={{ marginLeft: 15 }}>
                  <Title>Neighbours</Title>
                  <Chip>Member</Chip>
                </View>
              </View>

              <Ionicons name="chevron-forward" color={"black"} size={24} />
            </Card.Content>
          </Card>
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
              <Avatar.Text size={65} label="U7" />
              <View style={{ marginLeft: 15 }}>
                <Title>User_7</Title>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Ionicons name="star" color={"black"} size={24} />
                  <Ionicons name="star" color={"black"} size={24} />
                  <Ionicons name="star" color={"black"} size={24} />
                  <Ionicons name="star" color={"black"} size={24} />
                  <Ionicons name="star-half-sharp" color={"black"} size={24} />
                </View>
                <Text variant="bodyLarge" style={{ marginTop: 5 }}>
                  All good. Thanks!
                </Text>
              </View>
            </View>
            <Text variant="bodyLarge">2 months ago</Text>
          </Card.Content>
        </Card>
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
          <Avatar.Text size={72} label="PL" />
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
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: 15,
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
