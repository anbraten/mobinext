import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { Card, Button } from "react-native-paper";
import CardContent from "react-native-paper/lib/typescript/components/Card/CardContent";
import { supabase } from "~/supabase";

import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { Rentable } from "~/types";

type Props = NativeStackScreenProps<RootStackParamList, "GiveBackRentedVehicle">;

export const GiveBackRentedVehicle = ({ route, navigation }: any) => {
  const [selectedRentable, setSelectedRentable] = useState<Rentable | undefined>(
    route.params.selectedRentable
  );

  const currentReservation = route.params.reservation;
  const vehicleInfo = route.params.reservation._rentable;

  //console.log("Das Fahrzeug " + currentReservation.rentable + ", mit dem Namen " + vehicleInfo.model + " ist im Moment ausgeliehen von " + currentReservation.borrower + ".")

    const removeSupabaseCarEntry = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      const { data, status, error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', currentReservation.id)
        // .match({
        //   rentable: currentReservation.rentable,
        //   borrower: currentReservation.borrower,
        // })
      
      console.log(error);
      console.log(data);
      console.log(status);
      console.log(currentReservation.id + " should be gone now")
    };

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
                Möchten du das Fahrzeug "{vehicleInfo.model}" wirklich zurückgeben?
              </Text>
              <Text style={{
                paddingTop: 30
              }}>
                Weitere Informationen: {vehicleInfo.additional_information}
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={async () => {
                await removeSupabaseCarEntry();
                navigation.navigate("Reservations");
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