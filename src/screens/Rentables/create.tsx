import React from "react";
import { View, StyleSheet, ScrollView, FlatList, Pressable } from "react-native";
import {
    Text,
    Button,
  } from "react-native-paper";

import { RouteProp, NavigationProp } from '@react-navigation/native';
import { Rentable } from "~/types";

export const Create = ({ route, navigation }: any) => {
    const { rentable, success } = route.params;

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: "100%", width: "100%"}}>
        <Text>
            {rentable.model}{success ? " wurde erfolgreich erstellt/aktualisiert" : " wurde nicht erfolgreich erstellt/aktualisiert"}
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate("Vehicles")}>Zurück zu den Fahrzeugen</Button>
      </View>
    );
  };