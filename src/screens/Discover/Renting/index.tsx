import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  IconButton,
  MD3Colors,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { Rentable } from "~/types";
import { View, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";

type Props = NativeStackScreenProps<RootStackParamList, "Renting">;

const Renting = ({ route, navigation }: Props) => {
  const [selectedRentable, setSelectedRentable] = useState<Rentable>(
    route.params.selectedRentable
  );
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [locationAddress, setLocationAddress] =
    useState<Location.LocationGeocodedAddress[]>();
  let map: MapView;

  useEffect(() => {
    setTimeout(() => {
      if (selectedRentable?.latitude && selectedRentable?.longitude) {
        map.animateToRegion({
          latitude: selectedRentable.latitude,
          longitude: selectedRentable.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        });
      }
    }, 500);
  }, [selectedRentable]);

  useEffect(() => {
    if (selectedRentable?.latitude && selectedRentable?.longitude) {
      const coords = {
        latitude: selectedRentable.latitude,
        longitude: selectedRentable.longitude,
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
  }, [selectedRentable]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
      <ScrollView style={{ height: "90%" }}>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
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
              <Text variant="titleSmall">
                Fueltype: {selectedRentable?.fuel}
              </Text>
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
          </View>
        </View>
        <Divider />
        <View
          style={{
            padding: 10,
          }}
        >
          <Text variant="titleLarge">Location</Text>
          <View
            style={{
              height: 125,
              width: "45%",
              borderColor: MD3Colors.neutral50,
              borderStyle: "solid",
              borderWidth: 1.5,
              borderRadius: 3,
              marginTop: 5,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <MapView
              style={{ height: "100%", width: "100%" }}
              provider={PROVIDER_GOOGLE}
              ref={(_map) => {
                if (_map) {
                  map = _map;
                }
              }}
            >
              {selectedRentable?.latitude && selectedRentable?.longitude && (
                <Marker
                  key={selectedRentable.id}
                  coordinate={{
                    latitude: selectedRentable.latitude,
                    longitude: selectedRentable.longitude,
                  }}
                />
              )}
            </MapView>
            {locationAddress && locationAddress?.[0] && (
              <Text
                variant="titleSmall"
                style={{ marginLeft: 5, alignSelf: "center" }}
              >{`${locationAddress[0]?.street} ${locationAddress[0]?.streetNumber}, ${locationAddress[0]?.postalCode} ${locationAddress[0]?.city}`}</Text>
            )}
          </View>
        </View>
        <Divider />
        <View
          style={{
            padding: 10,
          }}
        >
          <Text variant="titleLarge">Additional Information</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text
              variant="titleSmall"
              style={{ marginLeft: 10, alignSelf: "center" }}
            >
              {selectedRentable?.additional_infomation || "N/A"}
            </Text>
          </View>
        </View>
        <Divider />
        <View style={{ padding: 10 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text variant="titleMedium">Startdate: </Text>
            <DateTimePicker
              mode="date"
              value={startDate}
              minimumDate={new Date()}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text variant="titleMedium">Starttime: </Text>
            <DateTimePicker
              mode="time"
              value={startDate}
              minimumDate={new Date()}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text variant="titleMedium">Est. Enddate: </Text>
            <DateTimePicker
              mode="date"
              value={startDate}
              minimumDate={new Date()}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text variant="titleMedium">Est. Endtime: </Text>
            <DateTimePicker
              mode="time"
              value={startDate}
              minimumDate={new Date()}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          height: "10%",
          borderColor: MD3Colors.neutral50,
          borderStyle: "solid",
          borderTopWidth: 1.5,
          padding: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text variant="titleSmall">Est. Costs (w/o miles): 18€</Text>
        </View>
        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate("Discover");
          }}
        >
          Rent
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Renting;
