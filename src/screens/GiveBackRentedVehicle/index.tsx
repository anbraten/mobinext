import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { Card, Button } from "react-native-paper";
import CardContent from "react-native-paper/lib/typescript/components/Card/CardContent";

import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { Rentable } from "~/types";

type Props = NativeStackScreenProps<RootStackParamList, "GiveBackRentedVehicle">;

export const GiveBackRentedVehicle = ({ route, navigation }: Props) => {
    const [selectedRentable, setSelectedRentable] = useState<Rentable>(
        route.params.selectedRentable
      );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
      <ScrollView style={{ height: "90%" }}>
        <View style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 35,
          }}>
        <Card>
          <Card.Content>
            <View style={{
              paddingBottom: 50
            }}>
              <Text>
                Möchten du den VW T4 wirklich zurückgeben?
              </Text>
              <Text style={{
                paddingTop: 30
              }}>
                Weitere Informationen: bla bla
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={async () => {
                // await giveBackCar();
                // navigation.navigate("...");
              }}
            >
            Fahrzeug zurückgeben
            </Button>
          </Card.Content>
        </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};