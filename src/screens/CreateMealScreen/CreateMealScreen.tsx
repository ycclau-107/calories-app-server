import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, ScrollView, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DatePicker from 'react-native-modern-datepicker'
import RNPickerSelect from "react-native-picker-select";

import BarcodeScanner from '../BarcodeScanner/BarcodeScannerScreen';

const CreateMealScreen: React.FC = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // form reponses
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("")
  const [selectedFood, setSelectedFood] = useState("")
  const [selectedKcal, setSelectedKcal] = useState(0)
  const [selectedCarb, setSelectedCarb] = useState(0)
  const [selectedProt, setSelectedProt] = useState(0)
  const [selectedFat, setSelectedFat] = useState(0)

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setModalVisible(false);
  };

  const renderForm = () => {
    // Form for manual entry of nutrients
    return (
      <ScrollView>
        <DatePicker 
            mode='calendar' 
            onSelectedChange={(date: React.SetStateAction<string>) => setSelectedDate(date)}
        />

        <RNPickerSelect
            onValueChange={(value) => setSelectedMeal(value)}
            items={[
                {label: "breakfast", value:"Breakfast"},
                {label: "lunch", value:"Lunch"},
                {label: "dinner", value:"Dinner"}
            ]}
        />

        <View style={{flexDirection:"row", alignItems:"center"}}>
            <Text>Food Name: </Text>
            <TextInput 
                underlineColorAndroid='transparent' 
                style={{margin:10}} 
                placeholder="Food Name" 
                onChangeText={val => setSelectedFood(val)}
            />
        </View>

        <View style={{flexDirection:"row", alignItems:"center"}}>
            <Text>Calories: </Text>
            <TextInput 
                underlineColorAndroid='transparent' 
                style={{margin:10}} 
                placeholder="Kcal" 
                keyboardType='numeric'
                onChangeText={val => setSelectedKcal(Number(val))}
            />
        </View>

        <View style={{flexDirection:"row", alignItems:"center"}}>
            <Text>Carbohydrate: </Text>
            <TextInput 
                underlineColorAndroid='transparent' 
                style={{margin:10}} 
                placeholder="g" 
                keyboardType='numeric'
                onChangeText={val => setSelectedCarb(Number(val))}
            />
        </View>

        <View style={{flexDirection:"row", alignItems:"center"}}>
            <Text>Protein: </Text>
            <TextInput 
                underlineColorAndroid='transparent' 
                style={{margin:10}} 
                placeholder="g" 
                keyboardType='numeric'
                onChangeText={val => setSelectedProt(Number(val))}
            />
        </View>

        <View style={{flexDirection:"row", alignItems:"center"}}>
            <Text>Fat: </Text>
            <TextInput 
                underlineColorAndroid='transparent' 
                style={{margin:10}} 
                placeholder="g" 
                keyboardType='numeric'
                onChangeText={val => setSelectedFat(Number(val))}
            />
        </View>

        <Button title="Submit" onPress={() => handleFormSubmit()} />
      </ScrollView>
    );
  };

  const handleFormSubmit = () => {
    // Implement logic to store data in the database
    // You can use a state management library like Redux or send a network request
    // For simplicity, I'm just printing the selected values to the console.
    console.log('Form Data:', selectedOption);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Your main content goes here */}
      <Text>Main Content</Text>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Choose an option:</Text>
            <Button title="Scan Barcode" onPress={() => handleOptionSelect('barcode')} />
            <Button title="Enter Manually" onPress={() => handleOptionSelect('manual')} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Conditionally render BarcodeScanner or Form based on the selected option */}
      {selectedOption === 'barcode' ? (
        <BarcodeScanner />
      ) : (
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedOption === 'manual'}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Enter Meal Details:</Text>
              {renderForm()}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'tomato',
    borderRadius: 30,
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '95%'
  },
});

export default CreateMealScreen;