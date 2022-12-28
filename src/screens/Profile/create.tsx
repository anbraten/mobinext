import React from "react";
import { View } from "react-native";
import { Text, Button, } from "react-native-paper";
import { manageTrustedParty } from "./utils";

export const CreateTrustedPartyResult = ({ route, navigation }: any) => {
    const { trustedParty, members, success, update = false } = route.params;

    const text = `${trustedParty.name} wurde ${success ? 'erfolgreich':'nicht erfolgreich'} ${update ? "aktualisiert" : "erstellt"}.`

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: "100%", width: "100%"}}>
        <Text>
            {text}
        </Text>
        {(!success && <Button mode="contained" onPress={() => manageTrustedParty(trustedParty, members, navigation)} style={{marginTop: 10}}>Erneut erstellen</Button>)}
        <Button mode="contained" onPress={() => navigation.navigate("Profile")} style={{marginTop: 10}}>Zurück zum Profil</Button>
      </View>
    );
  };