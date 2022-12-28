import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RealtimeChannel } from "@supabase/realtime-js";
import { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Avatar, Button, Card, FAB, Text } from "react-native-paper";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { AuthContext } from "~/provider/AuthProvider";
import { supabase } from "~/supabase";
import { Rentable } from "~/types";

const fuelTypes: { [key: string]: string } = {
  gas: "Benzin",
  diesel: "Diesel",
  electric: "Elektro",
  other: "Andere",
};

export const OwnRentables = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "OwnRentables">) => {
  const { user } = useContext(AuthContext);

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
              ...(oldRentables?.filter(
                (rentable) => rentable.id !== newRentable.id
              ) as Rentable[]),
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
              navigation.navigate("OwnRentablesDetails", {
                currRentable: rentable,
              })
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
                <Text>
                  Kraftstoff:{" "}
                  {rentable?.fuel ? fuelTypes[rentable.fuel] : "N/A"}
                </Text>
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
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        icon="plus"
        onPress={() => navigation.navigate("OwnRentablesCreate")}
      />
    </View>
  );
};
