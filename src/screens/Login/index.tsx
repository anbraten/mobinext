import { useState, useEffect } from "react";
import { Image } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "~/supabase.ts";
import mobinext from "~/../assets/mobinext.png";

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const signInWithEmail = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    setError("");
  }, [email, password]);

  return (
    <SafeAreaView style={{ margin: 10 }}>
      <Image
        source={mobinext}
        style={{
          alignSelf: "center",
          marginBottom: 20,
        }}
      />
      <Text
        variant="displaySmall"
        style={{ textAlign: "center", marginBottom: 10 }}
      >
        Anmelden
      </Text>
      <TextInput
        label="E-Mail"
        mode="outlined"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        returnKeyType="next"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Passwort"
        mode="outlined"
        returnKeyType="done"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={{ marginBottom: 10 }}
      />
      {error && (
        <HelperText type="error" style={{ marginBottom: 10 }}>
          {error}
        </HelperText>
      )}
      <Button
        mode="contained"
        disabled={loading}
        onPress={() => signInWithEmail()}
        style={{ marginBottom: 10 }}
      >
        Anmelden
      </Button>
      <Button
        mode="text"
        disabled={loading}
        onPress={() => navigation.navigate("Register")}
      >
        Du hast noch kein Konto? Hier registrieren
      </Button>
    </SafeAreaView>
  );
};

export default Login;
