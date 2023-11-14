import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ProfileScreen from "../../screens/ProfileScreen";

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={ProfileScreen}
        options={{
          title: "Home",
          headerTitleStyle: {
            justifyContent: "center",
          },
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
