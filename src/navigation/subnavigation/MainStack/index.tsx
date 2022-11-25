import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import Messages from "~/screens/Messages";
import Profile from "~/screens/Profile";
import Vehicles from "~/screens/Vehicles";
import Discover from "~/screens/Discover";
import { Chat } from "~/screens/Messages/chat";

export type RootStackParamList = {
  Home: undefined;
  Discover: undefined;
  Chat: { chatPartnerId: string };
};

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const DiscoverScreen = ({ navigation }: any) => {
  return <Discover navigation={navigation} />;
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

const Details_1_Screen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Details 1</Text>
      <Button onPress={() => navigation.navigate("Details_2")} mode="contained">
        To Details 2
      </Button>
    </View>
  );
};

const Details_2_Screen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Details 2</Text>
      <Button onPress={() => navigation.navigate("Discover")} mode="contained">
        To Discover
      </Button>
    </View>
  );
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
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

export default MainStack;
