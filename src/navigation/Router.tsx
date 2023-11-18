import React from "react";

// import tab navigators
import HomeTabNavigator from "./TabNavigator/HomeTabNavigator";

// import screens
import HomeScreen from "../screens/HomeScreen/HomeScreen";

// import main stack creator
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import HomeStackNavigator from "./StackNavigator/HomeStackNavigator";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeTabNavigator} />
    </Stack.Navigator>
  );
};

export default Router;
