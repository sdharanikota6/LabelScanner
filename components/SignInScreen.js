import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import userPool from "./CognitoConfig";
import { FontAwesome5 } from "@expo/vector-icons"; // Import FontAwesome5 icons

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    const authenticationData = {
      Username: username,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: () => {
        navigation.navigate("HomeScreen");
      },
      onFailure: (err) => {
        alert(err.message || JSON.stringify(err));
      },
    });
  };

  return (
      <LinearGradient colors={["#808080", "#1d1d1d"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.loginText}>Login</Text>
        <Text style={styles.subtitle}>Please sign in to continue</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
          <FontAwesome5 name="sign-in-alt" size={24} color="white" />
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 80,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 36,
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    width: "80%",
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  signInButtonText: {
    color: "white",
    marginLeft: 10,
  },
});
