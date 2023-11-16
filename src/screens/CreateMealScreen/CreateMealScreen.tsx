import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, ScrollView, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DatePicker from 'react-native-modern-datepicker'

import BarcodeScanner from '../BarcodeScanner/BarcodeScannerScreen';
import { useUserId } from '../../context/userContext';
import { serverIP } from '../../../serverConfig';
import axios from 'axios'

const CreateMealScreen: React.FC = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // form reponses
  const {userId} = useUserId()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("")
  const [selectedFood, setSelectedFood] = useState("")
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
    
    const formData = {
      USER_ID: {userId},
      FOOD_ITEM: selectedFood,
      PROTEIN_GRAM: selectedProt,
      CARBS_GRAM: selectedCarb,
      FAT_GRAM: selectedFat
    }

    axios.post(`${serverIP}/calorie/addrecord`, formData)
      .then((response) => {
        console.log('Form data submitted successfully', response.data);

        // reset form fields
        setSelectedDate("");
        setSelectedMeal("");
        setSelectedFood("");
        setSelectedCarb(0);
        setSelectedProt(0);
        setSelectedFat(0);


      setModalVisible(false);
    }).catch((error) =>{
      console.error('Error submitting form data: ', error)
    })
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