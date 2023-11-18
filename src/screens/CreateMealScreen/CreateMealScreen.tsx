import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, ScrollView, TextInput, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DatePicker from 'react-native-modern-datepicker'

import BarcodeScanner from '../BarcodeScanner/BarcodeScannerScreen';
import { useUserId } from '../../context/userContext';
import { serverIP } from '../../../serverConfig';
import axios from 'axios'
import { ActivityIndicator } from 'react-native-paper';

// for displaying daily food records
interface CalorieRecord {
  RECORD_DATE: string;
  'group_concat(FOOD_ITEM)': string;
  'sum(CALORIES)': number;
  'sum(CARBS_GRAM)': number;
  'sum(FAT_GRAM)': number;
  'sum(PROTEIN_GRAM)': number;
}

// for editing recorded values
interface FoodRecord {
  FOOD_ITEM: string;
  CALORIES: number;
  CARBS_GRAM: number;
  FAT_GRAM: number;
  PROTEIN_GRAM: number;
}


const CreateMealScreen: React.FC = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // form reponses
  const userId = useUserId().userId
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedFood, setSelectedFood] = useState("")
  const [selectedCarb, setSelectedCarb] = useState(0)
  const [selectedProt, setSelectedProt] = useState(0)
  const [selectedFat, setSelectedFat] = useState(0)

  // main feed
  const [ load, setLoad ] = useState(true)
  const [ feed, setFeed ] = useState([])

  // edit meals
  const [editDate, setEditDate] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editedData, setEditedData] = useState<FoodRecord[]>([])
  const [deleted, setDeleted] = useState(false)

  // get meal records from database
  // updates every time after new entry recorded in db
  useEffect(() => {
    setEditMode(false)
    axios.get(serverIP + '/calorie/getrecord', {
      params: {
        user_id: userId,
      },
    }).then((response: any) => {
      const data = response.data;
      setFeed(data)
    }).catch((error:any) => {
      console.log("Get record error:", error);
    });
    setLoad(false)
  },[load, selectedOption])

  const handleOptionSelect = (option: string) => {
    setModalVisible(false);
    setSelectedOption(option);
  };

  useEffect(() => {
    onItemClick(editDate)
  }, [deleted])

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

        {(selectedDate !== "" && selectedFood !== "") ?
          <Button title="Submit" onPress={() => handleFormSubmit()} /> : <Text style={{color: "red"}}>Complete all fields</Text>}
        <Button title="Cancel" onPress={handleFormCancel} />
  
      </ScrollView>
    );
  };

  const handleFormCancel = () => {
    setModalVisible(false);
    setSelectedOption(null)
  }

  const handleFormSubmit = () => {

    console.log(selectedDate)
    
    const formData = {
      user_id: userId,
      record_date: selectedDate,
      food_item: selectedFood,
      cal_get: selectedCarb*4 + selectedProt*4 + selectedFat*9,
      protein_gram: selectedProt,
      carbs_gram: selectedCarb,
      fat_gram: selectedFat
    }

    console.log(formData)

    axios.post(`${serverIP}/calorie/addrecord`, formData)
      .then((response) => {
        console.log('Form data submitted successfully', response.data);

        // reset form fields
        setSelectedDate("")
        setSelectedFood("")
        setSelectedCarb(0)
        setSelectedProt(0)
        setSelectedFat(0)

    }).catch((error) =>{
      console.error('Error submitting form data: ', error)
    })
    setModalVisible(false)
    setSelectedOption(null)
    setLoad(true)
  };

  const onItemClick = (item: string) => {
    setEditDate(item)
    axios.get(serverIP + '/calorie/editRecord', {
      params: {
        user_id: userId,
        record_date: item
      },
    }).then((response: any) => {
      const data = response.data;
      setEditedData(data)
    }).catch((error:any) => {
      console.log("Get day record error:", error);
    });
    setEditMode(true)
  }

  const handleFieldChange = (index: number, field: keyof FoodRecord, value: string) => {
    setEditedData((prevData) => {
      const newData = [...prevData];
      const numericValue = value.trim() === '' ? 0 : parseFloat(value);
      newData[index] = { ...newData[index], [field]: field === 'FOOD_ITEM' ? value : numericValue };
      return newData;
    });
  };

  const handleClose = () => {
    setEditDate("")
    setEditedData([])
    setEditMode(false)
  };

  const handleSave = () => {
    const newArray = editedData.map(item => [userId, editDate, ...Object.values(item)]);

    axios.put(serverIP + '/calorie/changerecord', {
        values: newArray
    },).then((response: any) => {
      console.log("Values updated")
    }).catch((error:any) => {
      console.log("Get day record error:", error);
    });

    setEditDate("")
    setEditedData([])
    setEditMode(false)
    setLoad(!load)
  };

  const handleDelete = (foodItem: string) =>{
    axios.delete(serverIP + '/calorie/delRecord', {
      params: {
        'user_id': userId,
        'record_date': editDate,
        'food_item': foodItem
      }
    }).catch(error => {
      console.log("Error making DELETE request: ", error)
    })
    setLoad(!load)
    setDeleted(!deleted)
  }

  return (
    <View style={styles.container}>
      {/* Meal Feed Main Content */}
      <View style={styles.mainView}>
        {feed.length < 1?
          <ActivityIndicator size={"large"} color={"#2FBBF0"}/>:
          <FlatList
            data={feed}
            keyExtractor={(item, index) => index.toString()}
            renderItem = {({ item }: { item: CalorieRecord }) => (
              <TouchableOpacity onPress={() => onItemClick(item.RECORD_DATE)} style={styles.item}>
                <Text>Date: {item.RECORD_DATE}</Text>
                <Text>Food Items: {item['group_concat(FOOD_ITEM)']}</Text>
                <Text>Calories: {item['sum(CALORIES)']}</Text>
                <Text>Carbs: {item['sum(CARBS_GRAM)']}</Text>
                <Text>Fat: {item['sum(FAT_GRAM)']}</Text>
                <Text>Protein: {item['sum(PROTEIN_GRAM)']}</Text>
              </TouchableOpacity>
            )}
          />
        }
      </View>

      {editMode === true ? (
        <Modal visible={editMode}>
          <Text>{editDate}</Text>
          {editedData.length < 1?
          <ActivityIndicator size={"large"} color={"#2FFFF0"}/>:
          <FlatList
            data={editedData}
            keyExtractor={(_, index) => index.toString()}
            renderItem = {({ item, index }: { item: FoodRecord; index: number }) => (
              <View style={styles.item}>
                <Text>Food Item: {item.FOOD_ITEM}</Text>

                <Text>Calories:</Text>
                <TextInput
                  value={editedData[index].CALORIES.toString()}
                  onChangeText={(text) => handleFieldChange(index, 'CALORIES', text)}
                  keyboardType="numeric"
                  style={styles.input}
                />
          
                <Text>Carbohydrates (g):</Text>
                <TextInput
                  value={editedData[index].CARBS_GRAM.toString()}
                  onChangeText={(text) => handleFieldChange(index, 'CARBS_GRAM', text)}
                  keyboardType="numeric"
                  style={styles.input}
                />
          
                <Text>Fat (g):</Text>
                <TextInput
                  value={editedData[index].FAT_GRAM.toString()}
                  onChangeText={(text) => handleFieldChange(index, 'FAT_GRAM', text)}
                  keyboardType="numeric"
                  style={styles.input}
                />
          
                <Text>Protein (g):</Text>
                <TextInput
                  value={editedData[index].PROTEIN_GRAM.toString()}
                  onChangeText={(text) => handleFieldChange(index, 'PROTEIN_GRAM', text)}
                  keyboardType="numeric"
                  style={styles.input}
                />

                <Button title="Delete food" onPress={() => handleDelete(editedData[index].FOOD_ITEM)}></Button>
              </View>
            )
            }
          />
        }
          <Button title="Save" onPress={handleSave} />
          <Button title="Close" onPress={handleClose} />
        </Modal>
      ) : (<></>)}
      

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
        <BarcodeScanner setSelectedOption={setSelectedOption}/>
        
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
  mainView: {
    width: '90%'
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default CreateMealScreen;