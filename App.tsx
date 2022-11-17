import { View } from "react-native";
import { Button, Provider as PaperProvider, Text } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Messages from "./screens/Messages/Messages";
import Profile from "./screens/Profile/Profile";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Vehicles from "./screens/Vehicles/Vehicles";
import Discover from "./screens/Discover/Discover";

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

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={BottomNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Details_1" component={Details_1_Screen} />
            <Stack.Screen name="Details_2" component={Details_2_Screen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
