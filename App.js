import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect }  from "react";
import { StyleSheet, Text, View } from "react-native";
import { Barcode_scanner } from "./src/Barcode_scanner";

export default function App() {
  return (
    <Barcode_scanner/>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
