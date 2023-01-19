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
import { FuelTypes, Rentable } from "~/types";
import { supabase } from "~/supabase";
import { View, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { Platform, StyleSheet } from "react-native";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";

type Props = NativeStackScreenProps<RootStackParamList, "Renting">;

export const Renting = ({ route, navigation }: Props) => {
  const [selectedRentable, setSelectedRentable] = useState<Rentable>(
    route.params.selectedRentable
  );

  const isIOS = Platform.OS === "ios";
  const [startDateTime, setStartDate] = useState(new Date());
  const [endDateTime, setEndDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showErorr, setShowError] = useState(false);
  const [startOrEndDate, setStartOrEnd] = useState("start");
  const [mode, setMode] = useState("date");
  const [timeDiff, setTimeDiff] = useState(
    Math.abs(startDateTime.getTime() - endDateTime.getTime()) / 36e5
  );

  const [locationAddress, setLocationAddress] =
    useState<Location.LocationGeocodedAddress[]>();
  let map: MapView;

  useEffect(() => {
    endDateTime.setHours(startDateTime.getHours() + 1);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (selectedRentable?.latitude && selectedRentable?.longitude) {
        map.animateToRegion({
          latitude: selectedRentable.latitude,
          longitude: selectedRentable.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
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

  const checkIfFreeToRent = async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("rentable", selectedRentable.id);

    data?.forEach((reservation) => {
      if (reservation.start != null && reservation.end != null) {
        if (
          dayjs(reservation.start).isBefore(endDateTime) &&
          dayjs(startDateTime).isBefore(reservation.end)
        ) {
          setShowError(true);
        } else {
          setShowError(false);
        }
      }
    });
  };

  // const isBetween = (checkDate: Date, startDate: Date, endDate: Date) => {
  //   var isBefore = dayjs(startDate).isBefore(checkDate);
  //   var isAfter = dayjs(endDate).isAfter(checkDate);
  //   var isSameStart = dayjs(startDate).isSame(checkDate);
  //   var isSameEnd = dayjs(endDate).isSame(checkDate);
  //   return (isBefore && isAfter) || isSameEnd || isSameStart;
  // }

  const rentACar = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const reservation = {
      created_at: new Date().toISOString(),
      rentable: selectedRentable.id,
      borrower: user?.id,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      status: "geliehen",
    };

    const { data, error, status } = await supabase
      .from("reservations")
      .insert([reservation]);

    console.log(error);
    console.log(data);
    console.log(status);

    if (error) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    } else {
      navigation.navigate("Reservations");
      Toast.show({
        type: "success",
        text1: "Du hast das Fahrzeug erfolgreich ausgeliehen!",
      });
    }
  };

  const onChangeStart = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || Date;
    setShow(false);
    setStartDate(currentDate);
    checkIfFreeToRent();
  };

  const onChangeEnd = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || Date;
    setShow(false);
    setEndDate(currentDate);
    checkIfFreeToRent();
  };

  const showDateTimePicker = (currentMode: any, startOrEnd: string) => {
    setMode(currentMode);
    setStartOrEnd(startOrEnd);
    setShow(true);
  };

  useEffect(() => {
    setTimeDiff(
      Math.abs(startDateTime.getTime() - endDateTime.getTime()) / 36e5
    );
  }, [startDateTime, endDateTime]);

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
                {`Kraftstoff: ${
                  selectedRentable?.fuel
                    ? FuelTypes[selectedRentable?.fuel]
                    : "N/A"
                }`}
              </Text>
              <Text variant="titleSmall">
                Kosten per km: {selectedRentable?.cost_per_km}€
              </Text>
              <Text variant="titleSmall">
                Kosten per minute: {selectedRentable?.cost_per_minute}€
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
          <Text variant="titleLarge">Standort</Text>
          {locationAddress && locationAddress?.[0] && (
            <Text
              variant="titleSmall"
              style={{ marginTop: 5 }}
            >{`${locationAddress[0]?.street} ${locationAddress[0]?.streetNumber}, ${locationAddress[0]?.postalCode} ${locationAddress[0]?.city}`}</Text>
          )}
          <View
            style={{
              height: 150,
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
              style={{ height: "99.9%", width: "99.9%" }}
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
                minimumDate={new Date()}
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
                minimumDate={new Date()}
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
                minimumDate={new Date()}
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
                minimumDate={new Date()}
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
          {showErorr && (
            <Text variant="titleMedium">
              Diese Zeit wurde bereits gebucht. Bitte wählen Sie einen anderen
              Zeitraum
            </Text>
          )}
          {show && (
            <DateTimePicker
              mode={mode === "time" ? "time" : "date"}
              minimumDate={new Date()}
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
          width: "100%",
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
        <View style={{ width: "75%" }}>
          <Text variant="titleSmall">
            Geschätzte Kosten (ohne Kilometerkosten):{" "}
            {selectedRentable?.cost_per_minute
              ? Math.round(timeDiff * selectedRentable.cost_per_minute * 60) +
                "€"
              : "N/A"}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={async () => {
            await rentACar();
          }}
        >
          Leihen
        </Button>
      </View>
    </SafeAreaView>
  );
};
