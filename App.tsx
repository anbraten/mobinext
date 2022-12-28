import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/provider/AuthProvider";
import Navigation from "./src/navigation";
import { NotificationProvider } from "~/provider/NotificationProvider";
import Toast from "react-native-toast-message";

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <NotificationProvider>
            <Navigation />
          </NotificationProvider>
        </AuthProvider>
        <Toast />
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
