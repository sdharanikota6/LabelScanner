import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./components/AuthScreen";
import SignUpScreen from "./components/SignUpScreen";
import SignInScreen from "./components/SignInScreen";
import HomeScreen from "./components/HomeScreen";
import CameraScreen from "./components/CameraScreen.js";
import DisplayScreen from "./components/DisplayScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: "Sign In / Sign Up" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ title: "Sign In" }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ title: "Camera" }}
        />
        <Stack.Screen
          name="DisplayScreen"
          component={DisplayScreen}
          options={{ title: "Display" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
