import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./subnavigation/MainStack";
import AuthStack from "./subnavigation/AuthStack";
import Loading from "../components/Loading";

const Navigation = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  return (
    <NavigationContainer>
      {user == null && <Loading />}
      {user == false && <AuthStack />}
      {user == true && <MainStack />}
    </NavigationContainer>
  );
};

export default Navigation;
