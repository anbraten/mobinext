import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    Avatar,
    Text,
    FAB,
    Card,
    Button,
    SegmentedButtons,
    TextInput
  } from "react-native-paper";
import { supabase } from "~/supabase";
import { Rentable } from "~/types";

export const Details = ({ navigation }: any) => {
    const [rentable, setRentable] = React.useState<Rentable>({} as Rentable);
    return (
      <View style={{ margin: "5%" }}>
        <View style={{width: "100%", marginBottom: 10}}>
          <Text variant="titleMedium">Modell:</Text>
          <TextInput
            onChangeText={rentable.model}
            value={rentable.model}
          ></TextInput>
        </View>

        <View style={{width: "100%", marginBottom: 10 }}>
          <Text variant="titleMedium">Sitze:</Text>
          <TextInput></TextInput>
        </View>

        <View style={{width: "100%", marginBottom: 10 }}>
          <Text variant="titleMedium">Treibstoff:</Text>
          <TextInput
            onChangeText={rentable.fuel}
            value={rentable.fuel}
          ></TextInput>
        </View>

        <View style={{width: "100%", marginBottom: 10 }}>
          <Text variant="titleMedium">Fahrzeug Standort:</Text>
          <TextInput
            onChangeText={rentable.city}
            value={rentable.city}
          ></TextInput>
        </View>

        <View style={{width: "100%", marginBottom: 10 }}>
          <Text variant="titleMedium">Weitere Informationen:</Text>
          <TextInput 
            multiline
            numberOfLines={5}
            onChangeText={rentable.city}
            value={rentable.city}
          ></TextInput>
        </View>
        
        <Button onPress={() => createCar(rentable)} mode="contained">
          Create Rentable
        </Button>
      </View>
    );
  };

async function createCar(rentable: Rentable) {
  const { data, error, status } = await supabase
  .from('rentables')
  .insert([
    rentable
  ])

  console.log(data, error, status);
  
}
