import React from "react";
import { View, Button, StyleSheet } from "react-native";

export default function AuthScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} />
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
