import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { router } from 'expo-router'

const login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setError("Incorrect email or password");
      } else {
        setError(error.message)
      }
      
    } finally {
      setLoading(false)
    }

  }
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
        <Text style={styles.btnText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
}

export default login

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 25, textAlign: "center" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginVertical: 5,
        borderRadius: 8
    },
    btn: {
        backgroundColor: "#007AFF",
        padding: 14,
        borderRadius: 8,
        marginTop: 15
    },
    btnText: { color: "white", textAlign: "center", fontWeight: "600" },
    link: { marginTop: 10, textAlign: "center", color: "#007AFF" },
    error: { color: "red", marginTop: 10, textAlign: "center" },

});