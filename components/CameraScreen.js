import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import { Camera } from "expo-camera";

/**
 * CameraScreen component allows users to capture images using the device's camera
 * and then process the captured image for text extraction.
 */

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [donePressed, setDonePressed] = useState(false); // Track if "Done" is pressed
  const cameraRef = useRef(null);

// Request camera permission on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();

      if (cameraStatus.status === "granted") {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        Alert.alert(
          "Permission required",
          "You need to grant camera permission to use this feature."
        );
      }
    })();
  }, []);

  // Function to take a picture using the camera
  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
    }
  };

  // Function to handle processing of the captured image
  const handleDone = async () => {
    try {
      if (capturedPhoto && !donePressed) {
        setDonePressed(true);
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
        const imageResponse = await fetch(capturedPhoto);
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
        navigation.navigate("DisplayScreen", {
          extractedText: textractData.text,
        });
      }
    } catch (error) {
      console.error("Error in handleDone:", error);
      if (error instanceof TypeError) {
        console.error(
          "Network request failed. Additional Info:",
          error.message
        );
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {capturedPhoto ? (
        <View style={styles.fullScreenContainer}>
          <Image
            source={{ uri: capturedPhoto }}
            style={styles.fullScreenImage}
          />
          <View style={styles.buttonContainer}>
            <Button title="Retake" onPress={() => setCapturedPhoto(null)} />
            <Button title="Done" onPress={handleDone} />
          </View>
        </View>
      ) : (
        <Camera style={{ flex: 1 }} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <Button title="Capture" onPress={takePicture} />
          </View>
        </Camera>
      )}
    </View>
  );
}
// Styles for the CameraScreen component
const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  fullScreenImage: {
    flex: 1,
    resizeMode: "contain",
  },
  buttonContainer: {
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderRadius: 8,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
});
