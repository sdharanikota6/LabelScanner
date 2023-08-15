import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import userPool from "./CognitoConfig";

export default function HomeScreen({ navigation }) {
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [allergies, setAllergies] = useState("");
  const [healthConcerns, setHealthConcerns] = useState("");
  const [isVerificationModalVisible, setIsVerificationModalVisible] =
    useState(false);
  const [verificationCode, setVerificationCode] = useState("");

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
    });
  };

  const handleSignUp = () => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: "gender",
        Value: gender,
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
    ];

    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      const cognitoUser = result.user;
      console.log("user name is " + cognitoUser.getUsername());
      setIsSignUpModalVisible(false); // Close sign up modal
      setIsVerificationModalVisible(true); // Open verification modal
    });
  };

  const handleSignIn = () => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        console.log("Authentication successful:", session);
        // Here you can redirect user or do other tasks upon successful authentication
        setIsSignInModalVisible(false);
      },
      onFailure: (err) => {
        console.error("Authentication failed:", err);
      },
    });
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      const imageUri = selectedAsset.uri;
      try {
        // 1. Request a Signed URL
        const signedUrlResponse = await fetch(
          "https://bt29bcadb9.execute-api.us-east-2.amazonaws.com/prod/textract",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getSignedUrl" }),
          }
        );
        const data = await signedUrlResponse.json();
        const signedUrl = data.signedUrl;

        // 2. Upload the Image to S3
        const imageResponse = await fetch(imageUri);
        const blob = await imageResponse.blob();
        await fetch(signedUrl, {
          method: "PUT",
          body: blob,
          headers: { "Content-Type": "image/jpeg" },
        });

        // 3. Request Text Extraction
        const textractResponse = await fetch(
          "https://bt29bcadb9.execute-api.us-east-2.amazonaws.com/prod/textract",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageKey: data.key }),
          }
        );
        const textractData = await textractResponse.json();

        // Navigate to the TextDisplayScreen after extracting the text
        navigation.navigate("TextDisplay", {
          extractedText: textractData.text,
          imageUri: imageUri,
        });
      } catch (error) {
        console.error("Error in openGallery:", error);
        if (error instanceof TypeError) {
          console.error(
            "Network request failed. Additional Info:",
            error.message
          );
        }
      }
    }
  };

  return (
    <LinearGradient colors={["#808080", "#1d1d1d"]} style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to LabelScanner</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.instructionsText}>
          To utilize this application, you have two options: capture a picture
          of an item's ingredients or select an image from your gallery. We will
          then promptly identify and inform you about any ingredients that may
          be harmful to you.
        </Text>
        <View style={styles.buttonContainer}>
          {/* Gallery button with icon */}
          <TouchableOpacity style={styles.button} onPress={openGallery}>
            <AntDesign name="picture" size={24} color="white" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>

          {/* Camera button with icon */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Camera")}
          >
            <AntDesign name="camerao" size={24} color="white" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>

          {/* Sign Up button to open the modal */}
          <TouchableOpacity onPress={() => setIsSignUpModalVisible(true)}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignInModalVisible(true)}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {isSignInModalVisible && (
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Username"
              onChangeText={setUsername}
              value={username}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              style={styles.input}
            />
            <Button title="Sign In" onPress={handleSignIn} />
            <Button
              title="Close"
              onPress={() => setIsSignInModalVisible(false)}
            />
          </View>
        )}

        {isVerificationModalVisible && (
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Verification Code"
              onChangeText={setVerificationCode}
              value={verificationCode}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button title="Verify" onPress={verifyUser} />
            <Button
              title="Close"
              onPress={() => setIsVerificationModalVisible(false)}
            />
          </View>
        )}

        {isSignUpModalVisible && (
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Username"
              onChangeText={setUsername}
              value={username}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              style={styles.input}
            />
            <TextInput
              placeholder="Gender"
              onChangeText={setGender}
              value={gender}
              style={styles.input}
            />
            <TextInput
              placeholder="Age"
              onChangeText={setAge}
              value={age}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Allergies"
              onChangeText={setAllergies}
              value={allergies}
              style={styles.input}
            />
            <TextInput
              placeholder="Health Concerns"
              onChangeText={setHealthConcerns}
              value={healthConcerns}
              style={styles.input}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button
              title="Close"
              onPress={() => setIsSignUpModalVisible(false)}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 30,
    color: "white",
    marginTop: 55,
    textAlign: "center",
    // Add shadow
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 6, height: 6 },
    textShadowRadius: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionsText: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    lineHeight: 33,
    marginBottom: 130,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 60,
    left: 50,
    right: 50,
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginTop: 5,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: "white", // Text color
    width: "80%", // Width of the input fields
  },
  signUpText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
  signInText: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
});
