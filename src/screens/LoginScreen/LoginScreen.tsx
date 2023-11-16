import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useUserId } from '../../context/userContext';

import {serverIP} from "../../../serverConfig";

//FIXME: navigation part
import Router from "../../navigation/Router";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const LoginScreen = ({ navigation }:any) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {userId, setUserId } = useUserId()

    useEffect(() => {
      // This useEffect will run every time userId changes
      console.log("Updated userId:", userId);
    }, [userId]);

    const handleLogin = () => {
        axios.get(serverIP + '/profile/get',{
            params: {
                username: username,
                password: password,
            },
        }).then((response: any) => {
            const data = response.data;
            if("error" in data){
                console.log("Login failed:", data.error);
            } else{
                console.log("Login success:", data);
                // FIXME: part of navigation
                setUserId(data.userid)
                console.log(userId)
                
                navigation.navigate('Home');
            }
        }).catch((error:any) => {
            console.log("Login error:", error);
        });
    };
  

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../../../assets/icon.png")} /> 
            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                style={styles.TextInput}
                placeholder="Username"
                placeholderTextColor="#666666"
                onChangeText={(username) => setUsername(username)}
                /> 
            </View> 
            <View style={styles.inputView}>
                <TextInput
                style={styles.TextInput}
                placeholder="Password"
                placeholderTextColor="#666666"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                /> 
            </View> 
            <TouchableOpacity>
                <Text style={styles.forgot_button}>Forgot Password?</Text> 
            </TouchableOpacity> 
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginText}>LOGIN</Text> 
            </TouchableOpacity> 
            </View> 
    );
}

// feel free to adjust to align with the default style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 100,
    width: 100,
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#FFDC6B",
    borderRadius: 30,
    width: "60%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
    TextInput: {
      height: 50,
      flex: 1,
      padding: 15,
      marginLeft: 20,
    },
    loginText: {
      height: 40,
      flex: 1,
      padding: 15,
      marginLeft: 20,
      fontSize: 15
    },
    forgot_button: {
      height: 30,
      marginBottom: 30,
    },
    loginBtn: {
      width: "50%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "#FFC300",
    },
});

export default LoginScreen;