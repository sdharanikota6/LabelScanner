import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function HomeScreen({ navigation }) {
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
          console.error("Network request failed. Additional Info:", error.message);
        }
      }
    }
  };





  return (
    <View style={styles.container}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
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
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Darker background color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginTop: 5,
  },
});
