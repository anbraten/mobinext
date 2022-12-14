import { useState, useEffect } from "react";
import { Image } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "~/supabase.ts";
import mobinext from "~/../assets/mobinext.png";
import Toast from "react-native-toast-message";

const Register = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [passwordsMatching, setPasswordsMatching] = useState<boolean>(true);

  const signUpWithEmail = async () => {
    setLoading(true);

    const { response, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      Toast.show({
        type: "error",
        text1: error.message,
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Du hast dich erfolgreich registriert",
        text2: "Schau in dein E-Mail Postfach und bestätige die Verfikation",
      });
      navigation.navigate("Login");
    }

    setLoading(false);
  };

  useEffect(() => {
    setError("");
  }, [email, password, passwordConfirm]);

  useEffect(() => {
    if (password && passwordConfirm && password !== passwordConfirm) {
      setPasswordsMatching(false);
    } else {
      setPasswordsMatching(true);
    }
  }, [password, passwordConfirm]);

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
        Registrieren
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
      <TextInput
        label="Passwort bestätigen"
        mode="outlined"
        returnKeyType="done"
        secureTextEntry
        value={passwordConfirm}
        error={!passwordsMatching}
        onChangeText={(text) => setPasswordConfirm(text)}
        style={{ marginBottom: 10 }}
      />
      {!passwordsMatching && (
        <HelperText type="error" style={{ marginBottom: 10 }}>
          {"Die Passwörter stimmen nicht überein!"}
        </HelperText>
      )}
      {error && (
        <HelperText type="error" style={{ marginBottom: 10 }}>
          {`Fehler: ${error}`}
        </HelperText>
      )}
      <Button
        mode="contained"
        disabled={
          loading ||
          !passwordsMatching ||
          !password ||
          !passwordConfirm ||
          !email
        }
        onPress={() => signUpWithEmail()}
        style={{ marginBottom: 10 }}
      >
        Registrieren
      </Button>
      <Button
        mode="text"
        disabled={loading}
        onPress={() => navigation.navigate("Login")}
      >
        Du hast bereits ein Konto? Hier anmelden
      </Button>
    </SafeAreaView>
  );
};

export default Register;
