import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TextDisplayScreen({ route }) {
  const { extractedText } = route.params;

  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const modifiedPrompt =
    "Get the ingredients in this extracted text from AWS textract. Don't include the nutrition facts, just the ingredients. Now output each ingredient that could be harmful to someone consuming it and give a quick sentence on why it could be harmful. Don't list ingredients if they don't have any harm. Don't say anything else. Only list the ingredients in the format I specified. Here is the text: " +
    extractedText;

  const fetchResponse = async () => {
    const endpointURL = "https://api.openai.com/v1/chat/completions";
    const headers = {
      Authorization:
        "Bearer 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",
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResponse();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? <Text>Loading...</Text> : <Text>{apiResponse}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
