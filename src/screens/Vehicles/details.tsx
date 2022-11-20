import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    Avatar,
    Text,
    FAB,
    Card,
    Button,
    SegmentedButtons,
  } from "react-native-paper";

export const Details = ({ navigation }: any) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Details 2</Text>
        <Button onPress={() => navigation.navigate("Discover")} mode="contained">
          To Discover
        </Button>
      </View>
    );
  };