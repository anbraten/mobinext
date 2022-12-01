import { useState, useEffect } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { supabase } from "~/supabase";
import { Rentable } from "~/types";
import { Button, IconButton, MD3Colors, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Discover">;

const Discover = ({ navigation }: Props) => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [rentables, setRentables] = useState<Rentable[]>([]);
  const [selectedRentable, setSelectedRentable] = useState<
    Rentable | undefined
  >(undefined);
  let map: MapView;

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
    if (location) {
      map.animateToRegion({
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

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

          {selectedRentable?.owner && selectedRentable.id === 1 ? (
            <Button
              mode="contained"
              compact
              onPress={() => {
                navigation.navigate("Renting", {
                  selectedRentable: selectedRentable,
                });
              }}
            >
              Rent
            </Button>
          ) : (
            <Button
              mode="contained"
              compact
              onPress={() => {
                navigation.navigate("Chat", {
                  chatPartnerId: selectedRentable?.owner!,
                });
              }}
            >
              Message
            </Button>
          )}
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
        ref={(_map) => {
          if (_map) {
            map = _map;
          }
        }}
      >
        {rentables.map((rentable) => {
          if (!rentable.longitude || !rentable.latitude) {
            return null;
          }

          return (
            <Marker
              key={rentable.id}
              coordinate={{
                latitude: rentable.latitude,
                longitude: rentable.longitude,
              }}
              onPress={(e) => {
                setSelectedRentable(rentable);
              }}
            />
          );
        })}
      </MapView>
      {selectedRentable && <SelectedRentable />}
    </SafeAreaView>
  );
};

export default Discover;
