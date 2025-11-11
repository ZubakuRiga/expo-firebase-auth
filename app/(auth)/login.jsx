import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { router } from 'expo-router';
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebase';

WebBrowser.maybeCompleteAuthSession();

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "906962048219-baur9ejr2113pe3kjnve4hv31gn8ta2m.apps.googleusercontent.com",
    expoClientId:
      "906962048219-baur9ejr2113pe3kjnve4hv31gn8ta2m.apps.googleusercontent.com",
    iosClientId:
      "906962048219-baur9ejr2113pe3kjnve4hv31gn8ta2m.apps.googleusercontent.com",
    androidClientId:
      "906962048219-baur9ejr2113pe3kjnve4hv31gn8ta2m.apps.googleusercontent.com",
    responseType: "id_token",
    scopes: ["profile", "email"],
    redirectUri,
  });

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === "success") {
        try {
          setLoading(true);
          const { id_token } = response.params;
          if (!id_token) {
            setError("Google authentication failed: missing ID token");
            return;
          }

          const credential = GoogleAuthProvider.credential(id_token);
          await signInWithCredential(auth, credential);
          router.push("/");
        } catch (err) {
          console.error(err);
          setError(err.message || "Failed to sign in with Google");
        } finally {
          setLoading(false);
        }
      }
    };

    handleResponse();
  }, [response]);

  const validateInputs = () => {
    if (email.trim() === '' || password.trim() === "") {
      setError('Both fields are required');
      return false;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address")
            return false;
        }

    setError("");
    return true;
  }

  const handleLogin = async () => {
    if (!validateInputs()) return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setError("Incorrect email or password");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync({
        useProxy: Platform.OS !== "web",
        showInRecents: true,
      });
    } catch (err) {
      console.error(err);
      setError(err?.message || JSON.stringify(err) || "Google sign-in failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
         style={[styles.googleBtn, { marginTop: 15 }]}
        onPress={handleGoogleSignIn}
        disabled={!request || loading}
      >
        <Text style={styles.googleBtnText}>
          {loading ? "Please wait..." : "Sign in with Google"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {fontSize: 26,fontWeight: "bold",marginBottom: 25,textAlign: "center"},
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
  },
  btn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "600" },
  link: { marginTop: 10, textAlign: "center", color: "#007AFF" },
  error: { color: "red", marginTop: 10, textAlign: "center" },
  googleBtn: {
    backgroundColor: "#DB4437",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  googleBtnText: { color: "white", fontWeight: "600" },
});
