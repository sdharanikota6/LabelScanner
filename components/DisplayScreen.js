import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { GPT_API } from "@env";
import { LinearGradient } from "expo-linear-gradient";

export default function TextDisplayScreen({ route }) {
  const { extractedText } = route.params;

  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const modifiedPrompt =
    "Get the ingredients in this extracted nutrition label from AWS textract. " +
    "Output each ingredient that could be harmful to someone consuming it " +
    "and give a quick sentence on why it could be harmful. " +
    "Look at the nutrition facts as well as the ingredients list. " +
    "If something has 0 of it, for example 0g of trans fat, do not include it. " +
    "Do not list ingredients if they don't have any harm. " +
    "Do not say anything else. Only list the ingredients in the format I specified. " +
    "Make sure to include every harmful ingredient. " +
    "All of these rules are very important, follow them exactly. " +
    "Here is the text: " +
    extractedText;

  const fetchResponse = async () => {
    const endpointURL = "https://api.openai.com/v1/chat/completions";
    const headers = {
      Authorization: `Bearer ${GPT_API}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a meticulous nutrition expert. " +
            "Your primary role is to identify harmful ingredients in nutrition labels with utmost accuracy. " +
            "Understand and follow the provided instructions strictly, " +
            "ensuring no harmful ingredient is overlooked.",
        },
        {
          role: "user",
          content: modifiedPrompt,
        },
      ],
    };

    try {
      const response = await fetch(endpointURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      setApiResponse(assistantMessage);
    } catch (e) {
      setApiResponse(e.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponse();
    return () => {}; // Cleanup function
  }, []);

  return (
    <LinearGradient colors={["#808080", "#1d1d1d"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color="white"
                style={styles.loading}
              />
            </View>
          ) : (
            <Text style={styles.whiteText}>{apiResponse}</Text>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  loading: {
    transform: [{ scale: 1.5 }],
  },
  whiteText: {
    color: "white",
  },
});
