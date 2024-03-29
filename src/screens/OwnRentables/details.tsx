import { useEffect, useState, useContext } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  Button,
  SegmentedButtons,
  TextInput,
  Portal,
  Dialog,
  Chip,
  IconButton,
} from "react-native-paper";
import { Rentable, Trusted_party_members } from "~/types";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { manageRentable } from "./utils";
import { supabase } from "~/supabase";
import { AuthContext } from "~/provider/AuthProvider";

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

export const OwnRentablesDetails = ({ route, navigation }: any) => {
  const { user } = useContext(AuthContext);
  const { category, currRentable } = route.params;
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // const edit = currRentable !== undefined;
  const [rentable, setRentable] = useState<Partial<Rentable>>(
    currRentable || {}
  );
  const [visible, setVisible] = useState(false);
  const [seats, setSeats] = useState<string>(
    rentable.seat_count?.toString() || defaultSeats.toString()
  );
  const [costMinute, setCostMinute] = useState<string>(
    rentable.cost_per_minute?.toString() || "0"
  );
  const [costKm, setCostKm] = useState<string>(
    rentable.cost_per_km?.toString() || "0"
  );
  const [locationAddress, setLocationAddress] =
    useState<Location.LocationGeocodedAddress[]>();

  rentable.type = rentable.type || category;
  rentable.seat_count = rentable.seat_count || defaultSeats;

  // let trustedParties = rentable.trusted_parties || []
  let [allTrustedParties, setAllTrustedParties] = useState<any[] | undefined>(
    []
  );
  let [rentableTrustedParties, setRentableTrustedParties] = useState<
    number[] | undefined
  >([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("trusted_parties")
        .select("*, trusted_party_members ( * )");

      setAllTrustedParties(
        data?.filter(
          (tp) =>
            tp.owner === user?.id ||
            (tp.trusted_party_members as Trusted_party_members[]).some(
              (member) => member.user_id === user?.id
            )
        )
      );

      if (rentable.id) {
        const { data: rentableTmp } = (await supabase
          .from("rentables")
          .select("*, trusted_party_rentables ( trusted_party_id )")
          .eq("id", rentable.id)) as any;

        const tpIds = rentableTmp?.[0]?.trusted_party_rentables?.map(
          (tpr: any) => tpr.trusted_party_id
        );
        setRentableTrustedParties(tpIds);
      }
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title:
        categories.find((c) => c.value === rentable.type)?.label || "Details",
    });
  }, [navigation]);

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

  const InformationDialog = () => {
    const hideDialog = () => {
      setShowInfoDialog(false);
    };
    return (
      <Portal>
        <Dialog visible={showInfoDialog} onDismiss={hideDialog}>
          <Dialog.Title>Was hat das zu bedeuten?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Dies ist eine super tolle Beschreibung, wieso man Trusted Parties
              dem Fahrzeug hinzufügen muss!
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" onPress={hideDialog}>
              Schließen
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  return (
    <ScrollView style={{ margin: "5%" }}>
      <InformationDialog />

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
        <Text variant="titleMedium">Fahrzeugstandort:</Text>
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
        <Text variant="titleMedium">Kosten per Stunde (in €):</Text>
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
        <Text variant="titleMedium">Kosten per Kilometer (in €):</Text>
        <TextInput
          onChangeText={(text) => setCostKm(text)}
          value={costKm}
          mode="outlined"
          keyboardType="numeric"
          returnKeyType="done"
          onEndEditing={() =>
            setRentable({ ...rentable, cost_per_km: parseFloat(costKm) })
          }
          dense={true}
        ></TextInput>
      </View>

      <View style={{ width: "100%", marginBottom: 10 }}>
        <Text variant="titleMedium">Kennzeichen:</Text>
        <TextInput
          mode="outlined"
          onChangeText={(text) =>
            setRentable({ ...rentable, license_plate: text })
          }
          value={rentable.license_plate || ""}
          dense={true}
        ></TextInput>
      </View>

      <View style={{ width: "100%", marginBottom: 10 }}>
        <Text variant="titleMedium">Zusätzliche Informationen:</Text>
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

      <View style={{ marginBottom: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text variant="titleMedium">Wähle aus deinen Trusted Parties:</Text>
          <IconButton
            onPress={() => setShowInfoDialog(true)}
            style={{ marginRight: 10 }}
            icon="information-outline"
            mode="contained"
            size={18}
          />
        </View>
        {allTrustedParties?.map((party) => (
          <Chip
            key={party.id}
            style={{ marginVertical: 5 }}
            onPress={() => {
              if (rentableTrustedParties?.includes(party.id)) {
                setRentableTrustedParties(
                  rentableTrustedParties?.filter((id) => id !== party.id)
                );
              } else {
                setRentableTrustedParties([
                  ...(rentableTrustedParties || []),
                  party.id,
                ]);
              }
            }}
            mode={
              rentableTrustedParties?.includes(party.id) ? "flat" : "outlined"
            }
          >
            <Text>{party.name}</Text>
          </Chip>
        ))}
      </View>

      <Button
        onPress={() =>
          manageRentable(
            rentable,
            navigation,
            currRentable ? true : false,
            rentableTrustedParties
          )
        }
        mode="contained"
      >
        {currRentable ? "Fahrzeug aktualisieren" : "Fahrzeug erstellen"}
      </Button>
    </ScrollView>
  );
};

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
    latitude: rentable?.latitude ? rentable?.latitude : 49.5,
    longitude: rentable?.longitude ? rentable?.longitude : 8.5,
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
        <Dialog.Title>Standort auswählen:</Dialog.Title>
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
              initialRegion={
                rentable?.latitude && rentable?.longitude
                  ? {
                      latitude: rentable?.latitude,
                      longitude: rentable?.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }
                  : {
                      latitude: 49.488888,
                      longitude: 8.469167,
                      latitudeDelta: 2.5,
                      longitudeDelta: 2.5,
                    }
              }
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
            Abbrechen
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              setRentable({
                ...rentable,
                latitude: marker.latitude,
                longitude: marker.longitude,
              });
              setVisible(false);
            }}
          >
            Anwenden
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
