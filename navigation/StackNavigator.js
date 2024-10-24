import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
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
import SearchScreen from "../screens/Search";
import Terms from "../screens/Terms";
import RefundPolicy from "../screens/RefundPolicy";
import CustomerService from "../screens/CustomerService";
import Licence from "../screens/Licence";
import * as Font from "expo-font";
import { LanguageContext } from "../context/langContext";
import { HomeLocales } from "../constants/Locales";
import { direction } from "../Utils/align";

const fetchFonts = () => {
  return Font.loadAsync({
    CairoBold: require("../assets/fonts/Cairo-Bold.ttf"),
    CairoMed: require("../assets/fonts/Cairo-Medium.ttf"),
  });
};

const StackNavigator = () => {
  const { login } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart.cart);
  const { lang, getSavedLang } = useContext(LanguageContext)
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const checkIsLogedIn = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      let parsedUser = JSON.parse(user);
      if (parsedUser?.accessToken) {
        dispatch(handleLogin());
      }
    }
  };
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  useEffect(() => {
    checkIsLogedIn();
    getSavedLang();
  }, []);
  const loadFonts = useCallback(async () => {
    await fetchFonts();
    setFontsLoaded(true);
  }, []);
  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;
  const screenOptions = {
    tabBarStyle: {
      height: Platform.OS === "ios" ? 85 : 60,
    },
  };
  const tabScreens = [
    <Tab.Screen
      name="Cart"
      component={CartScreen}
      options={{
        tabBarLabel: HomeLocales[lang].cart,
        tabBarLabelStyle: {
          color: "#008E97",
          fontFamily: "CairoBold",
          marginBottom: 5,
        },
        headerTitleStyle: {
          fontFamily: "CairoMed",
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: "#55a8b9",
        },
        headerTitleAlign: "center",
        title: HomeLocales[lang].cart,
        headerTintColor: "#fff",
        tabBarIcon: ({ focused }) =>
          focused ? (
            <>
              {cart.length > 0 ? (
                <View style={styles.cartNumContainer}>
                  <Text style={styles.cartNum}>{cart.length}</Text>
                </View>
              ) : null}
              <AntDesign name="shoppingcart" size={24} color="#008E97" />
            </>
          ) : (
            <>
              {cart.length > 0 ? (
                <View style={styles.cartNumContainer}>
                  <Text style={styles.cartNum}>{cart.length}</Text>
                </View>
              ) : null}
              <AntDesign name="shoppingcart" size={24} color="black" />
            </>
          ),
      }}
    />,
    <Tab.Screen
      name="Profile"
      component={login ? ProfileScreen : Login}
      options={{
        tabBarLabel: HomeLocales[lang].profile,
        tabBarLabelStyle: {
          color: "#008E97",
          fontFamily: "CairoBold",
          marginBottom: 5,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: "#55a8b9",
          fontFamily: "CairoBold",
        },
        headerTitleAlign: "center",
        title: login ? HomeLocales[lang].profile : lang === 'en' ? "Login" : "تسجيل الدخول",
        headerTitleStyle: {
          fontFamily: "CairoMed",
        },
        headerTintColor: "#fff",
        tabBarIcon: ({ focused }) =>
          focused ? (
            <Ionicons name="person" size={24} color="#008E97" />
          ) : (
            <Ionicons name="person-outline" size={24} color="black" />
          ),
      }}
    />,
    <Tab.Screen
      name="Categories"
      component={Categories}
      options={{
        tabBarLabel: HomeLocales[lang].categoires,
        tabBarLabelStyle: {
          color: "#008E97",
          fontFamily: "CairoBold",
          marginBottom: 5,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: "#55a8b9",
        },
        headerTitleAlign: "center",
        title: HomeLocales[lang].categoires,
        headerTitleStyle: {
          fontFamily: "CairoMed",
        },
        headerTintColor: "#fff",
        tabBarIcon: ({ focused }) =>
          focused ? (
            <Entypo name="list" size={24} color="#008E97" />
          ) : (
            <Entypo name="list" size={24} color="black" />
          ),
      }}
    />,
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: HomeLocales[lang].home,
        tabBarLabelStyle: {
          color: "#008E97",
          fontFamily: "CairoBold",
          marginBottom: 5,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: "#55a8b9",
        },
        headerTitleStyle: {
          fontFamily: "CairoMed",
        },
        headerTitleAlign: "center",
        title: HomeLocales[lang].home,
        headerTintColor: "#fff",
        tabBarIcon: ({ focused }) =>
          focused ? (
            <Entypo name="home" size={24} color="#008E97" />
          ) : (
            <AntDesign name="home" size={24} color="black" />
          ),
      }}
    />
  ]
  function BottomTabs() {

    return (
      <Tab.Navigator initialRouteName={"Home"} {...{ screenOptions }}>
        {lang === 'en' ? tabScreens.reverse().map((item) => item) : tabScreens.map((item) => item)}
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Login"
          component={BottomTabs}
          options={{
            headerShown: false,
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
          }}
        />

        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{
            headerShown: false,
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
          }}
        />
        <Stack.Screen
          name="SubCategories"
          component={SubCategorie}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: HomeLocales[lang].categoires,
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "Search Results" : "نتائج البحث",
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Info"
          component={ProductInfoScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "Product Details" : "تفاصيل المنتج",
            headerTintColor: "#fff",
          }}
        />

        <Stack.Screen
          name="OrderHistory"
          component={OrderHistory}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "Order History" : "الطلبات السابقة",
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "Payment" : "الدفع",
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Account"
          component={AccountInfo}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "Account Info" : "بيانات الحساب",
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Favorite"
          component={Favorite}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "My List" : "قائمتي",
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "Terms And Condition" : "الشروط والأحكام",
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="RefundPolicy"
          component={RefundPolicy}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "Refund Policy" : "سياسة الاستبدال والاسترجاع",
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="CustomerService"
          component={CustomerService}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "Customer support" : "خدمة العملاء والشكاوى والاقتراحات",
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Licence"
          component={Licence}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#55a8b9",
            },
            headerTitleStyle: {
              fontFamily: "CairoMed",
            },
            headerTitleAlign: "center",
            title: lang === "en" ? "Licenses" : "التراخيص",
            headerTintColor: "#fff",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({
  cartNumContainer: {
    backgroundColor: "#55a8b9",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    right: 5,
    top: 5,
  },
  cartNum: {
    color: "#fff",
  },
});
