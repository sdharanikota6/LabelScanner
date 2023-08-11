import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        cameraStatus.status === "granted" &&
        galleryStatus.status === "granted"
      ) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        Alert.alert(
          "Permission required",
          "You need to grant camera and gallery permissions to use this feature."
        );
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedPhoto(result.assets[0].uri);
    }
  };

  const handleDone = () => {};

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
            <Button title="Pick from Gallery" onPress={pickImage} />
          </View>
        </Camera>
      )}
    </View>
  );
}

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
