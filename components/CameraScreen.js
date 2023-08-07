import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

export default function CameraScreen() {
  // State to hold permission status
  const [hasPermission, setHasPermission] = useState(null);

  // State to hold the captured photo's URI
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  // Reference to the camera component
  const cameraRef = useRef(null);

  // Check for camera permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();

      // Update permission status in state
      if (cameraStatus.status === "granted") {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    })();
  }, []);

  // Function to handle taking a picture
  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri); // Set captured photo's URI to state
    }
  };

  // Handle cases when permission status is undetermined or denied
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {capturedPhoto ? (
        // Display the captured photo with a Recapture button
        <View style={{ flex: 1 }}>
          <Image source={{ uri: capturedPhoto }} style={{ flex: 1 }} />
          <Button
            title="Take Photo Again"
            onPress={() => setCapturedPhoto(null)}
          />
        </View>
      ) : (
        // Display the camera view with a Capture button
        <Camera style={{ flex: 1 }} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <Button title="Capture Label" onPress={takePicture} />
          </View>
        </Camera>
      )}
    </View>
  );
}

// Styling for the Capture button container
const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
});
``;
