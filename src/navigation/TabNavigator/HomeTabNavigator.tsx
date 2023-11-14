import * as React from "react";

// import stack navigators
import HomeScreen from "../../screens/HomeScreen";
import BarcodeScanner from "../../screens/BarcodeScanner";
import ProfileScreen from "../../screens/ProfileScreen";

// import icon library
import Icon from "@expo/vector-icons/MaterialIcons";

// import bottom tab navigator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          tabBarShowLabel: false,
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={BarcodeScanner}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="camera" color={color} size={size} />
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
