import { RealtimeChannel } from "@supabase/realtime-js";
import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Avatar,
  Text,
  FAB,
  Card,
  Button,
  SegmentedButtons,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "~/provider/AuthProvider";
import { supabase } from "~/supabase";
import { Rentable, Reservations } from "~/types";

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const Rentables = ({ navigation }: any) => {
  const { user } = useContext(AuthContext);

  const [value, setValue] = useState("rented");

  const RentedRentables = () => {
    type Reservation = Reservations & {
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
    );
  };

  const LoanedRentables = () => {
    const [rentables, setRentables] = useState<Rentable[]>();

    let rentablesSubscription: RealtimeChannel;

    useEffect(() => {
      (async () => {
        const { data, error } = await supabase
          .from("rentables")
          .select("*")
          .eq("owner", user?.id);

        if (data) {
          setRentables(data);
        }

        rentablesSubscription = supabase
          .channel("rentables")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "rentables",
              filter: `owner=eq.${user?.id}`,
            },
            (payload) => {
              const newRentable = payload.new as Rentable;

              setRentables((oldRentables) => [
                ...(oldRentables?.filter(rentable => rentable.id !== newRentable.id) as Rentable[]),
                newRentable,
              ]);
            }
          )
          .subscribe();
      })();

      return () => {
        rentablesSubscription.unsubscribe();
      };
    }, []);

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {rentables?.map((rentable, i) => (
            <Card
              style={{
                margin: 15,
                marginBottom: 10,
                marginTop: i === 0 ? 15 : 0,
              }}
              key={i}
              onPress={() =>
                navigation.navigate("LoanDetails", { currRentable: rentable })
              }
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
                  <Text variant="titleLarge">{rentable.model}</Text>
                  <Text>Sitze: {rentable.seat_count}</Text>
                  <Text>Kraftstoff: {rentable.fuel}</Text>
                  <Text>Kosten per km: {rentable.cost_per_km}€</Text>
                  <Text>Kosten per Minute: {rentable.cost_per_minute}€</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignSelf: "center",
                  }}
                >
                  <Button mode="contained" compact>
                    Ändern
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate("Loaning")}
        />
      </View>
    );
  };

  const renderContent = () => {
    switch (value) {
      case "rented":
        return <RentedRentables />;
      case "loaned":
        return <LoanedRentables />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: 15,
        }}
      >
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          style={{ alignSelf: "center", marginHorizontal: 20 }}
          buttons={[
            {
              value: "rented",
              label: "Geliehene",
            },
            {
              value: "loaned",
              label: "Eigene",
            },
          ]}
        />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

export default Rentables;
