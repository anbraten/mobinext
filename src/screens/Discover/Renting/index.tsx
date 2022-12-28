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
import { supabase } from "~/supabase";
import { View, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { Platform, StyleSheet } from "react-native";
import dayjs from "dayjs";

type Props = NativeStackScreenProps<RootStackParamList, "Renting">;

const Renting = ({ route, navigation }: Props) => {
  const [selectedRentable, setSelectedRentable] = useState<Rentable>(
    route.params.selectedRentable
  );

  const isIOS = Platform.OS === "ios";
  const [startDateTime, setStartDate] = useState(new Date());
  const [endDateTime, setEndDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [startOrEndDate, setStartOrEnd] = useState("start");
  const [mode, setMode] = useState("date");

  const [locationAddress, setLocationAddress] =
    useState<Location.LocationGeocodedAddress[]>();
  let map: MapView;

  useEffect(() => {
    endDateTime.setHours(startDateTime.getHours() + 1);
  }, [startDateTime]);

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

  const rentACar = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const reservation = {
      created_at: new Date().toLocaleString(),
      rentable: selectedRentable.id,
      borrower: user?.id,
      start: startDateTime.toLocaleString(),
      end: endDateTime.toLocaleString(),
      status: "geliehen",
    };

    const { data, error, status } = await supabase
      .from("reservations")
      .insert([reservation]);

    console.log(error);
    console.log(data);
    console.log(status);
  };

  const onChangeStart = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || Date;
    setShow(false);
    setStartDate(currentDate);
  };

  const onChangeEnd = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || Date;
    setShow(false);
    setEndDate(currentDate);
  };

  const showDateTimePicker = (currentMode: any, startOrEnd: string) => {
    setMode(currentMode);
    setStartOrEnd(startOrEnd);
    setShow(true);
  };

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
                Kraftstoff: {selectedRentable?.fuel}
              </Text>
              <Text variant="titleSmall">
                Kosten per km: {selectedRentable?.cost_per_km}
              </Text>
              <Text variant="titleSmall">
                Kosten per minute: {selectedRentable?.cost_per_minute}
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
              Sitze: {selectedRentable?.seat_count}
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
          <Text variant="titleLarge">Zusätzliche Informationen</Text>
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
              {selectedRentable?.additional_information || "N/A"}
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
            <Text variant="titleMedium">Startdatum: </Text>
            {isIOS ? (
              <DateTimePicker
                mode="date"
                value={startDateTime}
                is24Hour={true}
                onChange={onChangeStart}
              />
            ) : (
              <Button onPress={() => showDateTimePicker("date", "start")}>
                {dayjs(startDateTime).format("DD. MMMM YYYY")}
              </Button>
            )}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text variant="titleMedium">Startzeit: </Text>
            {isIOS ? (
              <DateTimePicker
                mode="time"
                value={startDateTime}
                is24Hour={true}
                onChange={onChangeStart}
              />
            ) : (
              <Button onPress={() => showDateTimePicker("time", "start")}>
                {dayjs(startDateTime).format("HH:mm") + " Uhr"}
              </Button>
            )}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text variant="titleMedium">Geplantes Enddatum: </Text>
            {isIOS ? (
              <DateTimePicker
                mode="date"
                value={endDateTime}
                is24Hour={true}
                onChange={onChangeEnd}
              />
            ) : (
              <Button onPress={() => showDateTimePicker("date", "end")}>
                {dayjs(endDateTime).format("DD. MMMM YYYY")}
              </Button>
            )}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text variant="titleMedium">Geplante Endzeit: </Text>
            {isIOS ? (
              <DateTimePicker
                mode="time"
                value={endDateTime}
                is24Hour={true}
                onChange={onChangeEnd}
              />
            ) : (
              <Button onPress={() => showDateTimePicker("time", "end")}>
                {dayjs(endDateTime).format("HH:mm") + " Uhr"}
              </Button>
            )}
          </View>
          {show && (
            <DateTimePicker
              mode={mode === "time" ? "time" : "date"}
              value={startOrEndDate === "start" ? startDateTime : endDateTime}
              is24Hour={true}
              onChange={
                startOrEndDate === "start" ? onChangeStart : onChangeEnd
              }
            />
          )}
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
          <Text variant="titleSmall">
            Geschätzte Kosten (ohne Kilometerkosten): 18€
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={async () => {
            await rentACar();
            navigation.navigate("Discover");
          }}
        >
          Leihen
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Renting;
