import { router } from "expo-router";
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";

export default function Home() {
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email)
      } else {
        router.replace("/login")
      }
      setLoading(false)
    })
    return () => unsubscribe();
  }, [])

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  )
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome {userEmail || 'User'}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  addTaskBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    height: 40,
  },
  addTaskText: { color: "white", fontWeight: "bold" },
});
