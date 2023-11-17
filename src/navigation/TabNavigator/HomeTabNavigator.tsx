import * as React from "react";

// import stack navigators
import HomeScreen from "../../screens/HomeScreen";
import BarcodeScanner from "../../screens/BarcodeScanner/BarcodeScannerScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import CreateMealScreen from "../../screens/CreateMealScreen/CreateMealScreen";

// import icon library
import Icon from "@expo/vector-icons/MaterialIcons";

// import bottom tab navigator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../../screens/LoginScreen/LoginScreen";

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={LoginScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          tabBarShowLabel: false,
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Meals"
        component={CreateMealScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="fastfood" color={color} size={size} />
          ),
          tabBarShowLabel: false,
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
          tabBarShowLabel: false,
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
