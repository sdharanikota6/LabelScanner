import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./components/AuthScreen";
import SignUpScreen from "./components/SignUpScreen";
import SignInScreen from "./components/SignInScreen";
import HomeScreen from "./components/HomeScreen";
import CameraScreen from "./components/CameraScreen.js";
import DisplayScreen from "./components/DisplayScreen";
import { UserProvider } from "./components/UserContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          {/* AuthScreen: A screen for signing in or signing up */}
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ title: "Sign In / Sign Up" }}
          />

          {/* SignUpScreen: A screen for user registration */}
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "Sign Up" }}
          />

          {/* SignInScreen: A screen for user login */}
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: "Sign In" }}
          />

          {/* HomeScreen: The main app screen after user authentication */}
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: "Home" }}
          />

          {/* CameraScreen: A screen for using the device camera */}
          <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{ title: "Camera" }}
          />

          {/* DisplayScreen: A screen for displaying captured or selected content */}
          <Stack.Screen
            name="DisplayScreen"
            component={DisplayScreen}
            options={{ title: "Display" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
