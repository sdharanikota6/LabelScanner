import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import userPool from "./CognitoConfig";
import { FontAwesome5 } from "@expo/vector-icons";
import { useContext } from "react";
import { UserContext } from "./UserContext";

/**
 * SignUpScreen component handles user registration.
 * Users can sign up with various details including username, password, email, age, allergies, health concerns, and gender.
 * It also handles verification through a modal with a verification code input.
 */

export default function SignUpScreen({ navigation }) {
 // State variables for user registration and verification
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [allergies, setAllergies] = useState("");
  const [healthConcerns, setHealthConcerns] = useState("");
  const [gender, setGender] = useState("");
  const [isVerificationModalVisible, setIsVerificationModalVisible] =
    useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  // Access user context for managing user data
  const { setUserData } = useContext(UserContext);

  // Handle user registration
  const handleSignUp = () => {
    // Create a list of user attributes for registration
    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: "custom:age",
        Value: age,
      }),
      new CognitoUserAttribute({
        Name: "custom:allergies",
        Value: allergies,
      }),
      new CognitoUserAttribute({
        Name: "custom:healthconcerns",
        Value: healthConcerns,
      }),
      new CognitoUserAttribute({
        Name: "gender",
        Value: gender,
      }),
    ];

    // Sign up the user using Cognito user pool
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      setIsVerificationModalVisible(true); // Show verification modal
    });

    // Update user data in context
    setUserData({
      isGuest: false,
      age: age,
      gender: gender,
      allergies: allergies,
      healthConcerns: healthConcerns,
    });
  };

 // Verify user registration with verification code
  const verifyUser = () => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      alert("Verification successful! You can now sign in.");
      setIsVerificationModalVisible(false);
      navigation.navigate("Auth"); // Navigate back to authentication screen
    });
  };

  return (
    // Linear gradient background for visual appeal
    <LinearGradient colors={["#808080", "#1d1d1d"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.loginText}>Sign Up</Text>
        <Text style={styles.subtitle}>Please fill out the details below</Text>
        {/* Input fields for user details */}
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
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Allergies"
          value={allergies}
          onChangeText={setAllergies}
          style={styles.input}
        />
        <TextInput
          placeholder="Health Concerns"
          value={healthConcerns}
          onChangeText={setHealthConcerns}
          style={styles.input}
        />
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          style={styles.input}
        />
        {/* Sign Up button */}
        <TouchableOpacity onPress={handleSignUp} style={styles.signInButton}>
          <FontAwesome5 name="user-plus" size={24} color="white" />
          <Text style={styles.signInButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Modal for verification code */}
        <Modal
          visible={isVerificationModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Enter Verification Code</Text>

              {/* Verification code input */}
              <TextInput
                placeholder="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                style={styles.input}
              />
              {/* Verify button */}
              <Button title="Verify" onPress={verifyUser} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

// Styles for the SignUpScreen component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 64,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
  },
});
