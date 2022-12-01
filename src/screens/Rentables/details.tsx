import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    Avatar,
    Text,
    FAB,
    Card,
    Button,
    SegmentedButtons,
    TextInput,
    Portal,
    Dialog
  } from "react-native-paper";
import { supabase } from "~/supabase";
import { Rentable } from "~/types";
import * as Location from 'expo-location';
import { LocationObject } from "expo-location";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";


export const Details = ({ navigation }: any) => {
    const [rentable, setRentable] = React.useState<Partial <Rentable>>({});
    const [visible, setVisible] = React.useState(false);
    
    return (
      <View style={{ margin: "5%" }}>
        <View style={{width: "100%", marginBottom: 10}}>
          <Text variant="titleMedium">Modell:</Text>
          <TextInput
            onChangeText={text => setRentable({...rentable, model: text})}
            value={rentable.model || ""}
          ></TextInput>
        </View>

        <View style={{width: "100%", marginBottom: 10 }}>
          <Text variant="titleMedium">Sitze:</Text>
          <TextInput
            onChangeText={text => setRentable({...rentable, seat_count: parseInt(text)})}
            value={rentable.seat_count?.toString() || "0"}
          >
          </TextInput>
        </View>

        <View style={{width: "100%", marginBottom: 10 }}>
          <Text variant="titleMedium">Treibstoff:</Text>
          <TextInput
            onChangeText={text => setRentable({...rentable, fuel: text})}
            value={rentable.fuel || ""}
          ></TextInput>
        </View>

        <View style={{width: "100%", marginBottom: 10 }}>
          <Text variant="titleMedium">Fahrzeug Standort:</Text>
          <Button mode="contained" onPress={() => setVisible(true)}>Pick Location</Button>
        </View>
        <MapDialog visible={visible} setVisible={setVisible} rentable={rentable} setRentable={setRentable} />

        <View style={{width: "100%", marginBottom: 10 }}>
          <Text variant="titleMedium">Weitere Informationen:</Text>
          <TextInput 
            multiline
            numberOfLines={5}
            onChangeText={text => setRentable({...rentable, additional_information: text})}
            value={rentable.additional_information || ""}
          ></TextInput>
        </View>
        
        <Button onPress={() => createCar(rentable)} mode="contained">
          Create Rentable
        </Button>
      </View>
    );
  };

async function createCar(rentable: Partial <Rentable>) {
  const { data: { user } } = await supabase.auth.getUser()

  rentable.owner = user?.id as string;
  const { data, error, status } = await supabase
  .from('rentables')
  .insert([
    rentable
  ])

  console.log(error, status);
}

const MapDialog = ({ visible, setVisible, rentable, setRentable }: {rentable: Partial <Rentable>, setRentable: (rentable: Partial <Rentable>) => void, visible: boolean, setVisible: (visible: boolean) => void}) => {
  const [location, setLocation] = useState<LocationObject|null>(null);
  const [errorMsg, setErrorMsg] = useState<string|null>(null);
  const [marker, setMarker] = useState({latitude: 49.5, longitude: 8.5} as LatLng);
  
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
    console.log("My location", location);
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
        {
          visible &&
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
            { marker && <Marker coordinate={marker} title='Marker' /> }
          </MapView>
        }
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => {
          setVisible(false)
        }}>
          Cancel
        </Button>
        <Button onPress={() => {
            setRentable({...rentable, latitude: marker.latitude, longitude: marker.longitude});
            setVisible(false)
          }}>
            Ok
          </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  );
}