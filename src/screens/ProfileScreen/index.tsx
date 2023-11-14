import React from "react";

// import UI components
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Title, Button } from "react-native-paper";

// import icon library
import Icon from "@expo/vector-icons/MaterialIcons";

// import styles
import styles from "./styles";

// import demo case
import { user } from "../../demo";

// user background
type UserBackgroundType = {
  imgSrc?: string;
};
const UserBackground = ({ imgSrc }: UserBackgroundType) => (
  <View style={styles.background}>
    <TouchableOpacity onPress={handleBackgroundPress}>
      <Image
        source={imgSrc ? { uri: imgSrc } : user.background}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  </View>
);

// handle handlers for user background
const handleBackgroundPress = () => {
  /** todo */
};

// user profile card
type UserCardType = {
  imgSrc?: string;
  name?: string;
  joinTime?: string;
  userTag?: string;
};
const UserCard = ({ imgSrc, name, joinTime, userTag }: UserCardType) => (
  <View style={styles.userCard}>
    {/** user avatar */}
    <TouchableOpacity>
      <Avatar.Image
        source={imgSrc ? { uri: imgSrc } : user.avatar}
        size={100}
        style={{ zIndex: 10 }}
      />
    </TouchableOpacity>
    {/* user info*/}
    <View style={styles.name}>
      <Title>{name ? name : user?.name}</Title>
      <TouchableOpacity style={styles.tagContainer}>
        <Text style={styles.tag}>{userTag ? userTag : user?.userTag}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* user section */}
        <View style={styles.user}>
          <UserBackground />
          <UserCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
