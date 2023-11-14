import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import styles from "./styles";

const BarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
    })();
  };

  // ask for camera permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when scanning barcode
  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    setText(data);
    console.log("Type: " + type + "\nData" + data);
  };

  // check permissions and return screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  if (hasPermission === true) {
    return (
      <View style={styles.container}>
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }}
          />
        </View>
        <Text style={styles.maintext}>{text}</Text>

        {scanned && (
          <Button
            title={"Scan again?"}
            onPress={() => setScanned(false)}
            color="tomato"
          />
        )}
      </View>
    );
  }

  return (
    <View>
      <Text>Granted</Text>
    </View>
  );
};

export default BarcodeScanner;
