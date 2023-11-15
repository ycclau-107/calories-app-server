import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import styles from "./styles";

const BarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");
  const [foodNutrient, setFoodNutrient] = useState([])
  const [foodName, setFoodName] = useState("")
  const [hasData, setHasData] = useState(false);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
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
    console.log("Type: " + type + "\nData: " + data);
  };

  const getBarcodeDataFromAPI = async (barcodeData: string) => {
    var myHeaders = new Headers();
    // API authentication token
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Token token=6c3b233f7fd40016099247f2f364201a");
    myHeaders.append("Cookie", "_food_repo_session=SDwWKPX9eixJLXM4Q6H6OniJ5vu3EGqfmO6kJTV1zL9%2Fbcg3ddtnSM4iYhTI1evyrPnFOvAQilF3KO2YZq%2FXdRm8e5xEyVZyDacegCm%2FhmeB62Y7%2Bxgs%2BXfYI2If7m8muLGalt3A%2FG%2BRca8hj9Ak4VCeIVf3Fae%2FyO4wVOFDSlZw5szqlMb1TS%2FMY4zvm3W8mzITi3tiAG0F8Q%3D%3D--VXmcKOM2HlEFXJuB--f0b10adTRFlOdfJba%2FkYyw%3D%3D");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    // try to fetch from API
    try {
      const response = await fetch(`https://www.foodrepo.org/api/v3/products?barcodes=${barcodeData}`, requestOptions);
      const result = await response.json();
      // if Fetch successful and result valid, set states, otherwise reset states
      try {
        // Updates state w API response
        setHasData(true);
        setFoodNutrient(result.data[0]);
        setFoodName(result.data[0].display_name_translations.en);
      } catch(error){
        // no data returned from API
        setFoodName("NO DATA AVAILABLE");
        setHasData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Check if the barcode has been scanned
    if (scanned && text !== "Not yet scanned") {
      // Call the API using the getBarcodeDataFromAPI function
      getBarcodeDataFromAPI(text);
    }
  }, [scanned, text]);

  const handleConfirm = () =>{
    console.log("Data", foodNutrient);
  }

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
        <Text style={styles.maintext}>{foodName}</Text>

        {scanned && (
          <View>
            <Button title={"Scan again?"} onPress={() => setScanned(false)} color="tomato"/>
          </View>
        )}

        {hasData && (
          <View style={styles.confirmBtn}>
            <Button title={"Confirm"} onPress={handleConfirm}/>
          </View>
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
