import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "./components/CameraScreen.js";
import DisplayScreen from "./components/DisplayScreen.js";
import HomeScreen from "./components/HomeScreen.js";
import userPool from "./components/CognitoConfig.js";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="TextDisplay" component={DisplayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
