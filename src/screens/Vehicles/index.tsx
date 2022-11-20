import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Avatar,
  Text,
  FAB,
  Card,
  Button,
  SegmentedButtons,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const Vehicles = ({ navigation }: any) => {
  const [value, setValue] = useState("rented");

  const RentedVehicles = () => {
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
            <View style={{ display: "flex", flexDirection: "column" }}>
              <Avatar.Icon size={50} icon="car" />
            </View>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <Text variant="titleLarge">Car Model</Text>
              <Text variant="bodyMedium">Fueltype: Gasoline</Text>
              <Text variant="bodyMedium">Cost per mile: 1€</Text>
              <Text variant="bodyMedium">Cost per minute: 0.10€</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text variant="titleLarge">Seats: 4</Text>
              <Button mode="contained" compact>
                Hand over
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  };

  const LoanedVehicles = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ padding: 15 }}>
          <Card style={{ marginBottom: 10 }}>
            <Card.Content
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Avatar.Icon size={50} icon="car" />
              </View>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text variant="titleLarge">Car Model</Text>
                <Text variant="bodyMedium">Fueltype: Gasoline</Text>
                <Text variant="bodyMedium">Cost per mile: 1€</Text>
                <Text variant="bodyMedium">Cost per minute: 0.10€</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Text variant="titleLarge">Seats: 4</Text>
                <Button mode="contained" compact>
                  Edit
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate("categories")}
        />
      </View>
    );
  };

  const renderContent = () => {
    switch (value) {
      case "rented":
        return <RentedVehicles />;
      case "loaned":
        return <LoanedVehicles />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
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
              value: "rented",
              label: "Rented",
            },
            {
              value: "loaned",
              label: "Loaned",
            },
          ]}
        />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

export default Vehicles;
