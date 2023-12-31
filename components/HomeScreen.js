import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

/**
 * HomeScreen component is the main screen of the app where users can choose to capture an image or select from gallery.
 * The selected image is processed for text extraction and passed to the DisplayScreen for showing extracted text.
 */

export default function HomeScreen({ navigation }) {
  // Function to process the selected image for text extraction
  const processImage = async (imageUri) => {
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
      navigation.navigate("DisplayScreen", {
        extractedText: textractData.text,
        imageUri: imageUri,
      });
    } catch (error) {
      console.error("Error in processImage:", error);
      if (error instanceof TypeError) {
        console.error(
          "Network request failed. Additional Info:",
          error.message
        );
      }
    }
  };

  // Function to open the image gallery for selecting an image
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
      processImage(imageUri); // Process the image after selecting from gallery
    }
  };

  return (
    // Linear gradient background for visual appeal
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
            onPress={() => navigation.navigate("CameraScreen")}
          >
            <AntDesign name="camerao" size={24} color="white" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

// Styles for the HomeScreen component
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
});
