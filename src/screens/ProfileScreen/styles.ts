import { StyleSheet } from "react-native";

// import contexts
import { ThemeContext } from "../../context/themes";
import { useContext } from "react";

// use a function to create styles with context rendered
const createStyles = () => {
  // get context
  const { isDarkTheme } = useContext(ThemeContext);

  // initialize styles
  const styles = StyleSheet.create({
    // root container
    container: {
      flex: 1,
    },

    // user info section
    user: {
      backgroundColor: isDarkTheme ? "#0c0c0c" : "#f7f7f7",
    },

    // user background container
    background: {
      position: "absolute",
      height: 100,
      width: "100%",
    },
    backgroundImage: {
      width: "100%",
      height: "100%",
    },

    // user card container
    userCard: {
      padding: 30,
    },
    name: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    tagContainer: {
      backgroundColor: "#dddddd",
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderRadius: 5,
    },
    tag: {
      color: "#777",
    },

    // general
    elevation: {
      shadowOffset: { width: 10, height: 100 },
      shadowColor: "black",
      shadowOpacity: 1,
      elevation: 3,
      // background color must be set
      backgroundColor: "#0000", // invisible color
    },
  });

  //return styles
  return styles;
};

export { createStyles };
