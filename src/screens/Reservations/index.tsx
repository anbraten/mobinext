import { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Avatar, Text, Card, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "~/provider/AuthProvider";
import { supabase } from "~/supabase";
import { Rentable, Reservations as _Reservations } from "~/types";

export const Reservations = ({ navigation }: any) => {
  const { user } = useContext(AuthContext);

  type Reservation = _Reservations & {
    _rentable: Rentable;
  };

  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .or(`borrower.eq.${user?.id}`)
        .order("created_at", { ascending: false });
      if (data) {
        for await (const reservation of data) {
          const rentable = await supabase
            .from("rentables")
            .select("*")
            .or(`id.eq.${reservation.rentable}`);
          if (rentable.data) {
            setReservations([
              ...reservations,
              { ...reservation, _rentable: rentable.data[0] },
            ]);
          }
        }
      }

      // TODO: show error
      error && console.error(error);
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView style={{ flex: 1 }}>
        {reservations.map((reservation, i) => (
          <Card
            style={{
              margin: 15,
              marginBottom: 10,
              marginTop: i === 0 ? 15 : 0,
            }}
            key={i}
          >
            <Card.Content
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Avatar.Icon size={50} icon="car" />
              </View>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text variant="titleLarge">{reservation._rentable.model}</Text>
                <Text variant="bodyMedium">
                  Kraftstoff: {reservation._rentable.fuel}
                </Text>
                <Text variant="bodyMedium">
                  Kosten per mile: {reservation._rentable.cost_per_km}€
                </Text>
                <Text variant="bodyMedium">
                  Kosten per minute: {reservation._rentable.cost_per_minute}€
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Text variant="titleLarge">
                  Sitze: {reservation._rentable.seat_count}
                </Text>
                <Button mode="contained" compact>
                  Abgeben
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
