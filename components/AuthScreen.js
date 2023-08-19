import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

/**
 * AuthScreen component handles the initial authentication view.
 * Users can sign in, sign up, or continue as a guest.
 */

export default function AuthScreen({ navigation }) {
  return (
    // Linear gradient background for visual appeal
    <LinearGradient colors={["#808080", "#1d1d1d"]} style={styles.container}>
      <Text style={styles.title}>Label Scanner</Text>
      <Text style={styles.subtitle}>
        Continue as a guest to use our app or either sign in/sign up to unlock special features
      </Text>
      {/* Button container */}
      <View style={styles.buttonContainer}>
        {/* Group of sign-in and sign-up buttons */}
        <View style={styles.buttonGroup}>
          {/* Sign In button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SignIn")}
          >
            <FontAwesome5 name="sign-in-alt" size={24} color="white" />
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          {/* Sign Up button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SignUp")}
          >
            <FontAwesome5 name="user-plus" size={24} color="white" />
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        {/* Continue as a Guest button */}
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

// Styles for the AuthScreen component
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
    marginTop: 200,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
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
