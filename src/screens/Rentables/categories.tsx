import React from "react";
import { View, StyleSheet, ScrollView, FlatList, Pressable } from "react-native";
import {
    Avatar,
    Text,
    FAB,
    Card,
    Button,
    SegmentedButtons,
  } from "react-native-paper";

const btns = [
    { label: "Auto", value: "LoanDetails" },
    { label: "Transporter", value: "LoanDetails" },
    { label: "Fahrrad", value: "LoanDetails" },
    { label: "Motorrad", value: "LoanDetails" },
    { label: "Landwirtschaft", value: "LoanDetails" },
    { label: "Andere", value: "LoanDetails" },
]

export const Categories = ({ navigation }: any) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: "100%", width: "100%"}}>
        <FlatList
            style={{ width: "100%" }}
            numColumns={2}
            data={btns}
            renderItem={({ item }) => (
                <Pressable onPress={() => navigation.navigate(item.value)} style={{ width: "45%", aspectRatio: 1/1, marginHorizontal: "2.5%", marginVertical: "2.5%", flex:1 , justifyContent: "center", alignItems: "center"}}>
                    <Text>{item.label}</Text>
                </Pressable>
            )}
        >
        </FlatList>
      </View>
    );
  };