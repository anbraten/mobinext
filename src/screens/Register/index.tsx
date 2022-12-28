import { useState, useEffect } from "react";
import { Image } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "~/supabase.ts";
import mobinext from "~/../assets/mobinext.png";

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
    }

    setLoading(false);
  };

  useEffect(() => {
    setError("");
  }, [email, password]);

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
        Register
      </Text>
      <TextInput
        label="Email"
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
          {error}
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
        Register
      </Button>
      <Button
        mode="text"
        disabled={loading}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login here
      </Button>
    </SafeAreaView>
  );
};

export default Register;
