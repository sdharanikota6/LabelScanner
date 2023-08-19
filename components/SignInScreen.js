import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import userPool from "./CognitoConfig";
import { FontAwesome5 } from "@expo/vector-icons";
import { UserContext } from "./UserContext";

/**
 * SignInScreen component handles user authentication.
 * Users can sign in using their username and password.
 * Upon successful authentication, user data is retrieved and stored using UserContext.
 */

export default function SignInScreen({ navigation }) {
  // State variables for user credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Access user context for managing user data
  const { setUserData } = useContext(UserContext);

// Handle user sign-in
  const handleSignIn = () => {
    // Prepare authentication data
    const authenticationData = {
      Username: username,
      Password: password,
    };

    // Create authentication details and Cognito user
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    // Authenticate user using Cognito
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        // Retrieve user attributes
        cognitoUser.getUserAttributes((err, result) => {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }

          // Convert user attributes to a more usable format
          const attributes = {};
          for (let i = 0; i < result.length; i++) {
            attributes[result[i].getName()] = result[i].getValue();
          }

          // Update user data using UserContext
          setUserData({
            isGuest: false,
            age: attributes["custom:age"] || null,
            gender: attributes["gender"] || null,
            allergies: attributes["custom:allergies"] || null,
            healthConcerns: attributes["custom:healthconcerns"] || null,
          });

          // Navigate to the home screen upon successful sign-in
          navigation.navigate("HomeScreen");
        });
      },
    });
  };

  return (
    // Linear gradient background for visual appeal
    <LinearGradient colors={["#808080", "#1d1d1d"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.loginText}>Login</Text>
        <Text style={styles.subtitle}>Please sign in to continue</Text>
       
        {/* Input fields for username and password */}
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

        {/* Sign In button */}
        <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
          <FontAwesome5 name="sign-in-alt" size={24} color="white" />
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

// Styles for the SignInScreen component
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
