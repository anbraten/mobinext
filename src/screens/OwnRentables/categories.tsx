import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import { Text, Button } from "react-native-paper";

const btns = [
  { label: "Auto", value: "car" },
  { label: "Transporter", value: "transporter" },
  { label: "Fahrrad", value: "bicycle" },
  { label: "Motorrad", value: "motorbike" },
  { label: "Landwirtschaft", value: "agriculture" },
  { label: "Andere", value: "other" },
];

export const OwnRentablesCategories = ({ navigation }: any) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Text variant="titleMedium" style={{ marginTop: 10, marginBottom: 5 }}>
        Wählen Sie eine Fahrzeugkategorie:
      </Text>
      <FlatList
        // first one to center the 6 buttons
        // style={{ width: "100%", height: "auto", flexGrow: 0, flexShrink: 1, flexBasis: "auto" }}
        style={{ width: "100%" }}
        numColumns={2}
        data={btns}
        renderItem={({ item }) => (
          <View
            style={{
              width: "45%",
              aspectRatio: 1 / 1,
              marginHorizontal: "2.5%",
              marginVertical: "2.5%",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate("OwnRentablesDetails", { category: item.value })
              }
              contentStyle={{ width: "100%", aspectRatio: 1 / 1 }}
            >
              <Text style={{ color: "white" }}>{item.label}</Text>
            </Button>
          </View>
        )}
      ></FlatList>
    </View>
  );
};
