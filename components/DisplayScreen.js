import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TextDisplayScreen({ route }) {
  const { extractedText } = route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>{extractedText}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 20, // Add some padding at the bottom for better scrolling
  },
});
