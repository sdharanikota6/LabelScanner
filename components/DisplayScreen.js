import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TextDisplayScreen({ route }) {
  const { extractedText } = route.params;
  return (
    <View style={styles.container}>
      <Text>{extractedText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
});
