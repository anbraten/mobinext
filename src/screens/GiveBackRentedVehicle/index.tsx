import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, View, Platform } from "react-native";
import { Card } from "react-native-paper";
import CardContent from "react-native-paper/lib/typescript/components/Card/CardContent";
import { supabase } from "~/supabase";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { FuelTypes, Rentable } from "~/types";
import {
  Button,
  Divider,
  IconButton,
  MD3Colors,
  Text,
} from "react-native-paper";
import moment from "moment";
import Toast from "react-native-toast-message";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "GiveBackRentedVehicle"
>;

export const GiveBackRentedVehicle = ({ route, navigation }: any) => {
  const [selectedRentable, setSelectedRentable] = useState<
    Rentable | undefined
  >(route.params.reservation._rentable);

  const isIOS = Platform.OS === "ios";
  const [show, setShow] = useState(false);
  const [showErorr, setShowError] = useState(false);
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    const getOwnerName = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", selectedRentable?.owner)
        .limit(1)
        .single();
      if (profile?.full_name) {
        setOwnerName(profile.full_name);
      }
    };
    getOwnerName();
  }, [selectedRentable]);

  const [locationAddress, setLocationAddress] =
    useState<Location.LocationGeocodedAddress[]>();
  let map: MapView;

  useEffect(() => {
    setTimeout(() => {
      if (vehicleInfo.latitude && vehicleInfo.longitude) {
        map.animateToRegion({
          latitude: vehicleInfo.latitude,
          longitude: vehicleInfo.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    }, 500);
  }, [selectedRentable]);

  useEffect(() => {
    if (vehicleInfo.latitude && vehicleInfo.longitude) {
      const coords = {
        latitude: vehicleInfo.latitude,
        longitude: vehicleInfo.longitude,
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

  const currentReservation = route.params.reservation;
  const vehicleInfo = route.params.reservation._rentable;

  const removeSupabaseCarEntry = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, status, error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", currentReservation.id);

    console.log(error);
    console.log(data);
    console.log(status);
    console.log(currentReservation + " deleted");

    if (error) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    } else {
      navigation.navigate("Reservations");
      Toast.show({
        type: "success",
        text1: "Du hast das Fahrzeug erfolgreich abgegeben!",
      });
    }
  };

  // const convertUTCToLocalTime = (dateString: any) => {
  //   let date = new Date(dateString.getUTCDate);
  //   const milliseconds = Date.UTC(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     date.getDate(),
  //     date.getHours(),
  //     date.getMinutes(),
  //     date.getSeconds(),
  //   );
  //   const localTime = new Date(milliseconds);
  //   localTime.getDate() // local date
  //   localTime.getHours() // local hour
  // };

  // console.log(convertUTCToLocalTime(currentReservation.created_at))

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
          <View
            style={{
              display: "flex",
              flexDirection: "row",
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
                marginLeft: 15,
              }}
            >
              <Text variant="titleLarge">{vehicleInfo.model}</Text>
              <View>
                <Text variant="titleSmall">
                  Kraftstoff:
                  {vehicleInfo?.fuel ? FuelTypes[vehicleInfo.fuel] : "N/A"}
                </Text>
                <Text variant="titleSmall">
                  Kosten per km: {vehicleInfo.cost_per_km}€
                </Text>
                <Text variant="titleSmall">
                  Kosten per Stunde: {vehicleInfo.cost_per_minute}€
                </Text>
              </View>
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
              {`Sitze: ${
                vehicleInfo?.seat_count ? vehicleInfo.seat_count : "N/A"
              }`}
            </Text>
          </View>
        </View>
        <Divider />
        <View
          style={{
            padding: 10,
          }}
        >
          <Text variant="titleLarge">Fahrzeugstandort</Text>
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
              {vehicleInfo.latitude && vehicleInfo.longitude && (
                <Marker
                  key={vehicleInfo.id}
                  coordinate={{
                    latitude: vehicleInfo.latitude,
                    longitude: vehicleInfo.longitude,
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
          <Text variant="titleLarge">Kennzeichen</Text>
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
              {vehicleInfo?.license_plate || "N/A"}
            </Text>
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
              {vehicleInfo?.additional_information || "N/A"}
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
            <Text variant="titleMedium">
              {`Gebucht am: ${moment(currentReservation.created_at).format(
                "DD.MM.YYYY HH:mm"
              )}`}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text variant="titleMedium">
              {`Geplanter Start: ${moment(currentReservation.start).format(
                "DD.MM.YYYY HH:mm"
              )}`}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text variant="titleMedium">
              {`Geplantes Ende: ${moment(currentReservation.end).format(
                "DD.MM.YYYY HH:mm"
              )}`}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          ></View>
        </View>
        <Divider />
        <View
          style={{
            padding: 10,
          }}
        >
          <Text variant="titleLarge">Fahrzeugbesitzer</Text>
          <Button
            mode="contained"
            style={{ marginTop: 5 }}
            onPress={() =>
              navigation.push("Chat", { chatPartnerId: vehicleInfo?.owner! })
            }
          >
            {`${ownerName || "Unbekannt"} kontaktieren`}
          </Button>
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
        <View style={{ width: "50%" }}>
          <Text variant="titleSmall">
            Möchtest du "{vehicleInfo.model}" jetzt abgeben?
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={async () => {
            await removeSupabaseCarEntry();
          }}
        >
          Abgabe bestätigen
        </Button>
      </View>
    </SafeAreaView>
  );
};
