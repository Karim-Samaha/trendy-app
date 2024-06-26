import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import AddressScreen from "../screens/AddressScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import OrderScreen from "../screens/OrderScreen";
import Categories from "../screens/Categories";
import SubCategorie from "../screens/SubCategory";
import { useDispatch, useSelector } from "react-redux";
import Login from "../screens/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleLogin } from "../redux/userReducer";
import OrderHistory from "../screens/OrderHistory";
import Payment from "../screens/Payment";
import AccountInfo from "../screens/AccountInfo";
import Favorite from "../screens/Favorite";
const StackNavigator = () => {

  const { login } = useSelector((state) => state.user)
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const checkIsLogedIn = async () => {
    const user = await AsyncStorage.getItem(("user"))
    if (user) {
      let parsedUser = JSON.parse(user)
      if (parsedUser?.accessToken) {
        dispatch(handleLogin())
      }
    }
  }
  useEffect(() => {
    checkIsLogedIn()
  }, [])
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "الرئيسية",
            tabBarLabelStyle: { color: "#008E97", fontWeight: "bold" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#008E97" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Categories"
          component={Categories}
          options={{
            tabBarLabel: "التصنيفات",
            tabBarLabelStyle: { color: "#008E97", fontWeight: "bold" },
            headerShown: true,
            headerStyle: {
              backgroundColor: '#55a8b9',
            },
            headerTitleAlign: 'center',
            title: 'التصنيفات',
            headerTintColor: "#fff",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#008E97" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={login ? ProfileScreen : Login}

          options={{
            tabBarLabel: "حسابي",
            tabBarLabelStyle: { color: "#008E97", fontWeight: "bold" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="#008E97" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: "السلة",
            tabBarLabelStyle: { color: "#008E97", fontWeight: "bold" },
            headerShown: true,
            headerStyle: {
              backgroundColor: '#55a8b9',
            },
            headerTitleAlign: 'center',
            title: 'العربة',
            headerTintColor: "#fff",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="shoppingcart" size={24} color="#008E97" />
              ) : (
                <AntDesign name="shoppingcart" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SubCategories"
          component={SubCategorie}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#55a8b9',
            },
            headerTitleAlign: 'center',
            title: 'التصنيفات',
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Info"
          component={ProductInfoScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#55a8b9',
            },
            headerTitleAlign: 'center',
            title: 'تفاصيل المنتج',
            headerTintColor: "#fff",
          }} />
        <Stack.Screen
          name="Address"
          component={AddAddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Add"
          component={AddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Confirm"
          component={ConfirmationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistory}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#55a8b9',
            },
            headerTitleAlign: 'center',
            title: 'الطلبات السابقة',
            headerTintColor: "#fff",
          }} />

        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#55a8b9',
            },
            headerTitleAlign: 'center',
            title: 'الدفع',
            headerTintColor: "#fff",
          }} />
        <Stack.Screen
          name="Account"
          component={AccountInfo}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#55a8b9',
            },
            headerTitleAlign: 'center',
            title: 'بيانات الحساب',
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Favorite"
          component={Favorite}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#55a8b9',
            },
            headerTitleAlign: 'center',
            title: 'قائمتي',
            headerTintColor: "#fff",
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
