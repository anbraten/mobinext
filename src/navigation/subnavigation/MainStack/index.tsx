import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import Messages from "../../../screens/Messages";
import Profile from "../../../screens/Profile";
import Vehicles from "../../../screens/Vehicles";
import Discover from "../../../screens/Discover";
import { Categories } from "../../../screens/Vehicles/categories";
import { Details } from "../../../screens/Vehicles/details";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DiscoverScreen = () => {
  return <Discover />;
};

const VehiclesScreen = ({ navigation }: any) => {
  return <Vehicles navigation={navigation} />;
};

const MessagesScreen = () => {
  return <Messages />;
};

const ProfileScreen = () => {
  return <Profile />;
};

const BottomNavigation = () => {
  return (
    <Tab.Navigator initialRouteName="Discover">
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Vehicles"
        component={VehiclesScreen}
        options={{
          tabBarLabel: "Vehicles",
          tabBarIcon: ({ color }) => (
            <Ionicons name="car" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color }) => (
            <Ionicons name="mail" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
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
      <Stack.Screen name="categories" component={Categories} options={({route}) => ({ title: "Kategorien"})} />
      <Stack.Screen name="details" component={Details} options={({route}) => ({ title: "Fahrzeug Details"})}/>
    </Stack.Navigator>
  );
};

export default MainStack;
