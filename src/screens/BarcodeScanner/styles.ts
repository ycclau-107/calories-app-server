import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "grey",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  confirmBtn: {
    marginTop: 10,
  }, 
  cancelBtn: {
    alignItems: "flex-end"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  nopermission: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }

});

export default styles;
