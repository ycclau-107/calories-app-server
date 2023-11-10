import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect }  from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';

export const Barcode_scanner = () => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet scanned')

    const askForCameraPermission = () => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status=='granted')
        }) ()
    }

    // ask for camera permission
    useEffect(() => {

        askForCameraPermission();

    }, [])

    // What happens when scanning barcode
    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        setText(data);
        console.log("Type: " + type + '\nData' + data)
    }

    // check permissions and return screens
    if (hasPermission === null){
        return(
        <View style={styles.container}>
            <Text>Requesting for camera permission</Text>
        </View>
        )
    }

    if (hasPermission === false){
    return(
        <View style={styles.container}>
        <Text style={{margin: 10}}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()}/>
        </View>
    )
    }

    if (hasPermission === true){
    return(
        <View style={styles.container}>
            <View style={styles.barcodebox}>
            <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{height: 400, width: 400}}/>
            </View>
            <Text style={styles.maintext}>{text}</Text>

            {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato'/>}
        </View>
    )
    }

    return (
        <View>
            <Text>Granted</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },

    barcodebox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'tomato'
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    }
  });
  