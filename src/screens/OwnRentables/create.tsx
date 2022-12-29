import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { manageRentable } from "./utils";

export const OwnRentablesCreate = ({ route, navigation }: any) => {
  const { rentable, success, update } = route.params;

  const text = `${rentable.model} wurde ${success ? 'erfolgreich': 'nicht erfolgreich'} ${update ? 'aktualisiert' : 'erstellt'}`;

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
        {text}
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
        onPress={() => navigation.navigate("OwnRentables")}
        style={{ marginTop: 10 }}
      >
        Zurück zu den Fahrzeugen
      </Button>
    </View>
  );
};
