import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Camera button with icon */}
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate("Camera")}
        >
          <AntDesign name="camerao" size={24} color="white" />
        </TouchableOpacity>

        {/*Add some explanatory text */}
        <Text style={styles.text}>Tap the camera icon to go to the Camera</Text>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -500, // Add marginBottom to push content to the bottom
  },
  cameraButton: {
    backgroundColor: "black",
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
