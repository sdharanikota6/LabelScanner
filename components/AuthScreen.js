import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons"; // Import FontAwesome5 icons

export default function AuthScreen({ navigation }) {
  return (
    <LinearGradient colors={["#808080", "#1d1d1d"]} style={styles.container}>
      <Text style={styles.title}>Label Scanner</Text>
      <Text style={styles.subtitle}>
        Continue as a guest to use our app or either sign in/sign up to unlock special features
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SignIn")}
          >
            <FontAwesome5 name="sign-in-alt" size={24} color="white" />
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SignUp")}
          >
            <FontAwesome5 name="user-plus" size={24} color="white" />
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.singleButton}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.buttonText}>Continue as a Guest</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "white",
    marginTop: -130,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 6, height: 6 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 30,
  },
  buttonContainer: {
    marginTop: 200, // Adjust spacing from the title
  },
  buttonGroup: {
    flexDirection: "row", // Arrange buttons in a row
    justifyContent: "center", // Center buttons horizontally
    marginBottom: 20,
  },
  button: {
    flexDirection: "column", // Arrange icon and text vertically
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10, // Adjust horizontal spacing between buttons
  },
  singleButton: {
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    marginTop: 5,
  },
});
