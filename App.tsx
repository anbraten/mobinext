import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/provider/AuthProvider";
import Navigation from "./src/navigation";

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
