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
import { Categories } from "~/screens/Rentables/categories";
import { Details } from "~/screens/Rentables/details";

export type RootStackParamList = {
  Home: undefined;
  Discover: undefined;
  Rentables: undefined;
  Messages: undefined;
  Chat: { chatPartnerId: string };
  Renting: { selectedRentable: Rentable };
  Profile: undefined;
  Loaning: undefined;
  LoanDetails: undefined;
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
          tabBarLabel: "Discover",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Vehicles"
        component={Rentables}
        options={{
          tabBarLabel: "Vehicles",
          tabBarIcon: ({ color }) => (
            <Ionicons name="car" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color }) => (
            <Ionicons name="mail" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
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
        name="Loaning"
        component={Categories}
        options={{ title: "Loan a vehicle" }}
      />
      <Stack.Screen
        name="LoanDetails"
        component={Details}
        options={{ title: "Vehicle Details" }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;