import { useState, useEffect } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { supabase } from "~/supabase";
import { Rentable } from "~/types";
import { Button, IconButton, MD3Colors, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Discover = () => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [rentables, setRentables] = useState<Rentable[]>([]);
  const [selectedRentable, setSelectedRentable] = useState<
    Rentable | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const { error, data } = await supabase.from("rentables").select("*");

      if (error) {
        setErrorMsg(error.message);
      }
      if (data) {
        setRentables(data);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("My location", location);
  }, [location]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const SelectedRentable = () => {
    return (
      <View
        style={{
          height: "17%",
          width: "100%",
          borderColor: MD3Colors.neutral50,
          borderStyle: "solid",
          borderWidth: 1.5,
          padding: 3,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <IconButton
            mode="outlined"
            icon="car"
            iconColor={MD3Colors.neutral50}
            size={25}
          />
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Text variant="titleLarge">{selectedRentable?.model}</Text>
          <View>
            <Text variant="titleSmall">Fueltype: {selectedRentable?.fuel}</Text>
            <Text variant="titleSmall">
              Cost per km: {selectedRentable?.cost_per_km}
            </Text>
            <Text variant="titleSmall">
              Cost per minute: {selectedRentable?.cost_per_minute}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Text variant="titleLarge">
            Seats: {selectedRentable?.seat_count}
          </Text>

          <Button mode="contained" compact onPress={() => console.log("Rent")}>
            Rent
          </Button>
        </View>
        <View>
          <IconButton
            mode="outlined"
            icon="close"
            iconColor={MD3Colors.neutral50}
            size={20}
            onPress={() => setSelectedRentable(undefined)}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <MapView
        style={{ height: selectedRentable ? "83%" : "100%", width: "100%" }}
        showsUserLocation
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
      >
        {rentables.map((rentable) => (
          <Marker
            key={"M-1"}
            coordinate={{
              latitude: rentable.latitude,
              longitude: rentable.longitude,
            }}
            onPress={(e) => {
              setSelectedRentable(rentable);
            }}
          />
        ))}
      </MapView>
      {selectedRentable && <SelectedRentable />}
    </SafeAreaView>
  );
};

export default Discover;
