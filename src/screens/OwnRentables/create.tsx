import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { manageRentable } from "./utils";

export const OwnRentablesCreate = ({ route, navigation }: any) => {
  const { rentable, success } = route.params;

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
      <Text>
        {rentable.model}
        {success
          ? " wurde erfolgreich erstellt/aktualisiert"
          : " wurde nicht erfolgreich erstellt/aktualisiert"}
      </Text>
      {!success && (
        <Button
          mode="contained"
          onPress={() => manageRentable(rentable, navigation)}
          style={{ marginTop: 10 }}
        >
          Erneut erstellen
        </Button>
      )}
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Vehicles")}
        style={{ marginTop: 10 }}
      >
        Zurück zu den Fahrzeugen
      </Button>
    </View>
  );
};
