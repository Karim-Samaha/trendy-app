import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { handleLogout } from "../redux/userReducer";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Search from "../components/Search";
import StaticLinks from "../components/StaticLinks";
import { ProfileLocals } from "../constants/Locales";

const ProfileScreen = () => {

  const [user_, setUser_] = useState({})
  const checkIsLogedIn = async () => {
    const user = await AsyncStorage.getItem(("user"))
    if (user) {
      let parsedUser = JSON.parse(user)
      if (parsedUser?.accessToken) {
        setUser_(parsedUser)
      }
    }
  }
  useEffect(() => {
    checkIsLogedIn()
  }, [])
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(handleLogout())
    navigation.navigate("Home")
    AsyncStorage.removeItem("user");
  }



  return (
    <>
      <ScrollView style={styles.mainScrollView}>
        <View style={styles.container}>
          <View
            style={styles.formContainer}
          >
            <Pressable
              style={styles.title}
            >
              <Text style={styles.titleText}>
                {user_?.name || user_?.email || user_?.phone}
              </Text>
            </Pressable>
            <Pressable
              style={styles.linkPress}
              onPress={() => navigation.navigate("OrderHistory")}
            >
              <View style={styles.linkContentContainer}>
                <FontAwesome5 name="history" size={24} color="#55a8b9" />
                <Text style={styles.linkText}>
                  {ProfileLocals['ar'].orders}
                </Text>
              </View>

            </Pressable>

            <Pressable
              style={styles.linkPress}
              onPress={() => navigation.navigate("Account")}

            >
              <View style={styles.linkContentContainer}>
                <MaterialIcons name="manage-accounts" size={24} color="#55a8b9" />
                <Text style={styles.linkText}>
                  {ProfileLocals['ar'].profile}
                </Text>
              </View>
            </Pressable>
          </View>

          <View
            style={styles.viewContainer}
          >
            <Pressable
              style={styles.linkPress}
              onPress={() => navigation.navigate("Favorite")}
            >
              <View style={styles.linkContentContainer}>
                <MaterialIcons name="favorite" size={24} color="#55a8b9" />
                <Text style={styles.linkText}>
                  {ProfileLocals['ar'].favList}
                </Text>
              </View>
            </Pressable>
            <StaticLinks />
            <Pressable
              style={styles.signOut}
              onPress={signOut}
            >
              <View style={styles.linkContentContainer}>
                <SimpleLineIcons name="logout" size={22} color="black" />
                <Text style={{ fontFamily: "CairoBold", fontSize: 13, color: "#fff", marginHorizontal: 10 }}>
                  {ProfileLocals['ar'].logOut}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainScrollView: {
    padding: 0,
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20
  },
  container: {
    padding: 10
  },
  formContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  title: {
    padding: 10,
    width: "95%",
    flex: 1,
  },
  titleText: {
    textAlign: "right",
    fontFamily: "CairoBold"
  },
  linkPress: {
    padding: 10,
    borderColor: "#55a8b9",
    borderWidth: 1,
    borderRadius: 8,
    width: "95%",
    flex: 1,
    height: 50,
    justifyContent: "center"
  },
  signOut: {
    padding: 10,
    borderColor: "#ff1111",
    backgroundColor: "#ff1111",
    borderWidth: 1,
    borderRadius: 8,
    width: "95%",
    flex: 1,
    height: 45,
    justifyContent: "center"
  },
  linkText: {
    fontSize: 14,
    marginHorizontal: 10,
    fontFamily: "CairoBold"
  },
  linkContentContainer: {
    flexDirection: "row-reverse"
  },
  viewContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  }
});
