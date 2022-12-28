import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import Messages from "~/screens/Messages";
import Profile from "~/screens/Profile";
import Rentables from "~/screens/Rentables";
import Discover from "~/screens/Discover";
import { Chat } from "~/screens/Messages/chat";
import Renting from "~/screens/Discover/Renting";
import { Rentable } from "~/types";
import { OwnRentablesCategories } from "~/screens/OwnRentables/categories";
import { OwnRentablesDetails } from "~/screens/OwnRentables/details";
import { OwnRentablesCreate } from "~/screens/OwnRentables/create";
import { TrustedPartiesCreate } from "~/screens/TrustedParties/create";
import { Reviews } from "~/screens/Profile/reviews";
import { Statistics } from "~/screens/Profile/statistics";
import { TrustedParties } from "~/screens/TrustedParties/list";
import { OwnRentables } from "~/screens/OwnRentables/list";

export type RootStackParamList = {
  Home: undefined;
  Discover: undefined;
  Rentables: undefined;
  RentablesCreate: undefined;
  Messages: undefined;
  Chat: { chatPartnerId: string };
  Renting: { selectedRentable: Rentable };

  Profile: undefined;

  OwnRentables: undefined;
  OwnRentablesDetails: { currRentable?: Partial<Rentable> };
  OwnRentablesCreate: undefined;
  OwnRentablesCategories: undefined;

  Statistics: undefined;
  Reviews: undefined;
  TrustedParties: undefined;
  TrustedPartiesCreate: { update?: boolean; trustedPartyId?: string };
};

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const BottomNavigation = () => {
  return (
    <Tab.Navigator initialRouteName="Discover">
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarLabel: "Entdecken",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Vehicles"
        component={Rentables}
        options={{
          tabBarLabel: "Buchungen",
          tabBarIcon: ({ color }) => (
            <Ionicons name="car" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarLabel: "Nachrichten",
          tabBarIcon: ({ color }) => (
            <Ionicons name="mail" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen
        name="Renting"
        component={Renting}
        options={{ title: "Rent a vehicle" }}
      />

      <Stack.Screen
        name="OwnRentables"
        component={OwnRentables}
        options={{ title: "Fahrzeug erstellen", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="OwnRentablesDetails"
        component={OwnRentablesDetails}
        options={{ title: "Dein Fahrzeug", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="OwnRentablesCreate"
        component={OwnRentablesCreate}
        options={{ title: "Fahrzeug erstellen", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="OwnRentablesCategories"
        component={OwnRentablesCategories}
        options={{ title: "Fahrzeug erstellen", headerBackTitle: "Back" }}
      />

      <Stack.Screen
        name="Reviews"
        component={Reviews}
        options={{ title: "Review" }}
      />
      <Stack.Screen
        name="Statistics"
        component={Statistics}
        options={{ title: "Statistiken" }}
      />
      <Stack.Screen
        name="TrustedParties"
        component={TrustedParties}
        options={{ title: "Trusted Parties" }}
      />
      <Stack.Screen
        name="TrustedPartiesCreate"
        component={TrustedPartiesCreate}
        options={{ title: "Trusted Party erstellen" }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
