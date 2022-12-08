import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  SegmentedButtons,
  TextInput,
  Portal,
  Dialog,
} from "react-native-paper";
import { supabase } from "~/supabase";
import { Rentable } from "~/types";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";

const fuelTypes = [
  { label: "Benzin", value: "gas" },
  { label: "Diesel", value: "diesel" },
  { label: "Elektro", value: "electric" },
  { label: "Andere", value: "other" },
];

const categories = [
  { label: "Auto", value: "car" },
  { label: "Transporter", value: "transporter" },
  { label: "Fahrrad", value: "bicycle" },
  { label: "Motorrad", value: "motorbike" },
  { label: "Landwirtschaft", value: "agriculture" },
  { label: "Andere", value: "other" },
];

const defaultSeats = 4;

export const Details = ({ route, navigation }: any) => {
  const { category } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: categories.find((c) => c.value === category)?.label || "Details",
    });
  }, [navigation]);

  const [rentable, setRentable] = React.useState<Partial<Rentable>>({});
  const [visible, setVisible] = React.useState(false);
  const [seats, setSeats] = React.useState<string>(defaultSeats.toString());
  const [costMinute, setCostMinute] = React.useState<string>("0");
  const [costKilometer, setCostKilometer] = React.useState<string>("0");
  const [locationAddress, setLocationAddress] =
    useState<Location.LocationGeocodedAddress[]>();

  useEffect(() => {
    if (rentable?.latitude && rentable?.longitude) {
      const coords = {
        latitude: rentable.latitude,
        longitude: rentable.longitude,
      };
      const { latitude, longitude } = coords;

      const getAdress = async () => {
        const response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (response) {
          setLocationAddress(response);
        }
      };

      getAdress();
    }
  }, [rentable]);

  rentable.type = category;
  rentable.seat_count = rentable.seat_count || defaultSeats;

  return (
    <ScrollView style={{ margin: "5%" }}>
      <View style={{ width: "100%", marginBottom: 10 }}>
        <Text variant="titleMedium">Modell:</Text>
        <TextInput
          onChangeText={(text) => setRentable({ ...rentable, model: text })}
          value={rentable.model || ""}
          mode="outlined"
          dense={true}
        ></TextInput>
      </View>

      <View style={{ flex: 0, width: "100%", marginBottom: 10 }}>
        <Text variant="titleMedium">Sitze:</Text>
        <TextInput
          onChangeText={(text) => setSeats(text)}
          value={seats}
          mode="outlined"
          keyboardType="numeric"
          returnKeyType="done"
          maxLength={2}
          onEndEditing={() =>
            setRentable({ ...rentable, seat_count: parseInt(seats) })
          }
          dense={true}
        ></TextInput>
      </View>

      <View style={{ width: "100%", marginBottom: 10 }}>
        <Text variant="titleMedium">Treibstoff:</Text>
        <SegmentedButtons
          buttons={fuelTypes}
          onValueChange={(text: string) =>
            setRentable({ ...rentable, fuel: text })
          }
          value={rentable.fuel || "other"}
          style={{ alignSelf: "center" }}
        />
      </View>

      <View style={{ width: "100%", marginBottom: 10 }}>
        <Text variant="titleMedium">Fahrzeug Standort:</Text>
        <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
          {locationAddress && locationAddress?.[0]
            ? `${
                locationAddress[0]?.street || locationAddress[0]?.name || ""
              } ${locationAddress[0]?.streetNumber || ""}, ${
                locationAddress[0]?.postalCode
              } ${locationAddress[0]?.city}`
            : "Aktuell ist noch kein Standort ausgewählt. Bitte wählen Sie einen aus."}
        </Text>
        <Button mode="contained" onPress={() => setVisible(true)}>
          Standort auswählen
        </Button>
      </View>
      <MapDialog
        visible={visible}
        setVisible={setVisible}
        rentable={rentable}
        setRentable={setRentable}
      />

      <View style={{ width: "100%", marginBottom: 10 }}>
        <Text variant="titleMedium">Kosten pro Minute:</Text>
        <TextInput
          onChangeText={(text) => setCostMinute(text)}
          value={costMinute}
          mode="outlined"
          keyboardType="numeric"
          returnKeyType="done"
          onEndEditing={() =>
            setRentable({
              ...rentable,
              cost_per_minute: parseFloat(costMinute),
            })
          }
          dense={true}
        ></TextInput>
      </View>

      <View style={{ width: "100%", marginBottom: 10 }}>
        <Text variant="titleMedium">Kosten pro Kilometer:</Text>
        <TextInput
          onChangeText={(text) => setCostKilometer(text)}
          value={costKilometer}
          mode="outlined"
          keyboardType="numeric"
          returnKeyType="done"
          onEndEditing={() =>
            setRentable({ ...rentable, cost_per_km: parseFloat(costKilometer) })
          }
          dense={true}
        ></TextInput>
      </View>

      <View style={{ width: "100%", marginBottom: 10 }}>
        <Text variant="titleMedium">Weitere Informationen:</Text>
        <TextInput
          multiline
          numberOfLines={5}
          mode="outlined"
          onChangeText={(text) =>
            setRentable({ ...rentable, additional_information: text })
          }
          value={rentable.additional_information || ""}
          dense={true}
        ></TextInput>
      </View>

      <Button onPress={() => createRentable(rentable)} mode="contained">
        Fahrzeug erstellen
      </Button>
    </ScrollView>
  );
};

async function createRentable(rentable: Partial<Rentable>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  rentable.owner = user?.id as string;
  const { data, error, status } = await supabase
    .from("rentables")
    .insert([rentable]);

  console.log(error, status);
}

const MapDialog = ({
  visible,
  setVisible,
  rentable,
  setRentable,
}: {
  rentable: Partial<Rentable>;
  setRentable: (rentable: Partial<Rentable>) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [marker, setMarker] = useState({
    latitude: 49.5,
    longitude: 8.5,
  } as LatLng);

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
    })();
  }, []);

  useEffect(() => {
    if (location) {
      // map.animateToRegion({
      //   latitude: location?.coords?.latitude,
      //   longitude: location?.coords?.longitude,
      //   latitudeDelta: 0.0922,
      //   longitudeDelta: 0.0421,
      // });
    }
  }, [location]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Standort</Dialog.Title>
        <Dialog.Content>
          {visible && (
            <MapView
              style={{ height: 300, width: 300 }}
              provider={PROVIDER_GOOGLE}
              ref={(_map) => {
                if (_map) {
                  map = _map;
                }
              }}
              showsMyLocationButton
              showsUserLocation
              onPress={(e) => {
                setMarker(e.nativeEvent.coordinate);
              }}
            >
              {marker && <Marker coordinate={marker} />}
            </MapView>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              setRentable({
                ...rentable,
                latitude: marker.latitude,
                longitude: marker.longitude,
              });
              setVisible(false);
            }}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
