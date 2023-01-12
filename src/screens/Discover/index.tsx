import { useState, useEffect, useContext, useCallback } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { supabase } from "~/supabase";
import { FuelTypes, Rentable } from "~/types";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  IconButton,
  MD3Colors,
  Text,
} from "react-native-paper";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { RootStackParamList } from "~/navigation/subnavigation/MainStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { AuthContext } from "~/provider/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "Discover">;

export const Discover = ({ navigation }: Props) => {
  const { user } = useContext(AuthContext);
  const [location, setLocation] = useState<any>(null);
  const [userID, setUserID] = useState<any>();
  const [isRentable, setIsRentable] = useState(false);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [rentables, setRentables] = useState<Rentable[]>([]);
  const [selectedRentable, setSelectedRentable] = useState<
    Rentable | undefined
  >(undefined);
  let map: MapView;
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission to access location was denied",
        });
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserID(user?.id);
      canRent();
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchVehicles = async () => {
        setLoadingVehicles(true);

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        const { error, data } = await supabase.from("rentables").select("*");

        if (error) {
          Toast.show({ type: "error", text1: error.message });
        }
        if (data) {
          setRentables(data);
        }

        setLoadingVehicles(false);
      };

      fetchVehicles();

      return () => {};
    }, [])
  );

  async function requestRentableAccess() {
    const res = await supabase.from("messages").insert({
      message: `${user?.full_name} möchte Zugriff auf dein Fahrzeug haben.`,
      type: "rentable_request",
      context: {
        rentable: selectedRentable?.id!,
      },
      author: user?.id!,
      target: selectedRentable?.owner!,
    });

    if (res.error) {
      Toast.show({ type: "error", text1: res.error.message });
      return;
    }

    navigation.push("Chat", {
      chatPartnerId: selectedRentable?.owner!,
    });
  }

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

  useEffect(() => {
    canRent();
  }, [selectedRentable]);

  const canRent = async () => {
    setIsRentable(false);
    const { error, data: TP_FROM_RENTABLE } = await supabase
      .from("trusted_party_rentables")
      .select("trusted_party_id")
      .eq("rentable_id", selectedRentable?.id);
    const { data: TP_FROM_USER } = await supabase
      .from("trusted_party_members")
      .select("trusted_party_id")
      .eq("user_id", userID);

    TP_FROM_USER?.forEach((user) => {
      TP_FROM_RENTABLE?.forEach((rentable) => {
        if (user.trusted_party_id == rentable.trusted_party_id) {
          setIsRentable(true);
        }
      });
    });
  };

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
        <View style={{ margin: 3 }}>
          <Avatar.Icon size={50} icon="car" />
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
          {selectedRentable != null &&
          (selectedRentable?.owner === userID || isRentable) ? (
            <View>
              <Text variant="titleSmall">
                {`Kraftstoff: ${
                  selectedRentable?.fuel
                    ? FuelTypes[selectedRentable.fuel]
                    : "N/A"
                }`}
              </Text>
              <Text variant="titleSmall">
                Kosten per km: {selectedRentable?.cost_per_km}€
              </Text>
              <Text variant="titleSmall">
                Kosten per Minute: {selectedRentable?.cost_per_minute}€
              </Text>
            </View>
          ) : (
            <View style={{ width: "55%" }}>
              <Text variant="labelSmall">
                Du bist noch nicht in der Trusted Party des Fahrzeugs!
              </Text>
            </View>
          )}
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

          {selectedRentable != null &&
          (selectedRentable?.owner === userID || isRentable) ? (
            <Button
              mode="contained"
              compact
              onPress={() => {
                navigation.navigate("Renting", {
                  selectedRentable: selectedRentable,
                });
              }}
            >
              Leihen
            </Button>
          ) : (
            <Button mode="contained" compact onPress={requestRentableAccess}>
              Anfragen
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
      {loadingVehicles && (
        <View
          style={{
            position: "absolute",
            top: "15%",
            alignSelf: "center",
            zIndex: 1,
          }}
        >
          <Card>
            <Card.Content>
              <Text variant="headlineSmall" style={{ marginBottom: 10 }}>
                Lade Fahrzeuge...
              </Text>
              <ActivityIndicator animating={loadingVehicles} />
            </Card.Content>
          </Card>
        </View>
      )}
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
              key={`${rentable.id}${
                rentable.id === selectedRentable?.id && "active"
              }`}
              coordinate={{
                latitude: rentable.latitude,
                longitude: rentable.longitude,
              }}
              pinColor={selectedRentable?.id === rentable.id ? "blue" : "red"}
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
