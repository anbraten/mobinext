import { useState, useEffect } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { supabase } from "~/supabase";
import { Rentable } from "~/types";

const Discover = () => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [rentables, setRentables] = useState<Rentable[]>([]);

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

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ height: "100%", width: "100%" }}
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
            title={"Car_1"}
            description={"This is Car_1"}
          />
        ))}
      </MapView>
    </View>
  );
};

export default Discover;
