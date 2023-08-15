import React, { useState } from "react";
import { View, TextInput, Button, Modal, Text, StyleSheet } from "react-native";
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import userPool from "./CognitoConfig";

export default function SignUpScreen({ navigation }) {
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

  const handleSignUp = () => {
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

    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      setIsVerificationModalVisible(true);
    });
  };

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
      navigation.navigate("Auth");
    });
  };

  return (
    <View style={styles.container}>
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
      <Button title="Sign Up" onPress={handleSignUp} />

      <Modal
        visible={isVerificationModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Enter Verification Code</Text>
            <TextInput
              placeholder="Verification Code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              style={styles.input}
            />
            <Button title="Verify" onPress={verifyUser} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
