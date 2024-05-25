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

const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [orders, setOrders] = useState([
    {
      id: "1",
      products: [{
        title:
          "منتج 1",
        offer: "72%",
        oldPrice: 7500,
        price: 4500,
        image:
          "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
        carouselImages: [
          "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
          "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
          "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
          "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
        ],
        color: "Green",
        size: "Normal",
      }]
    }
  ]);
  const [loading, setLoading] = useState(false);
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
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#00CED1",
      },
    });
  }, []);
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(handleLogout())
    navigation.navigate("Home")
    AsyncStorage.removeItem("user");
  }
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchUserProfile();
  }, []);
  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("auth token cleared");
    navigation.replace("Login");
  };
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8000/orders/${userId}`
  //       );
  //       const orders = response.data.orders;
  //       setOrders(orders);

  //       setLoading(false);
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };

  //   fetchOrders();
  // }, []);
  console.log("orders", orders);
  return (
    <ScrollView style={{ padding: 10, flex: 1, backgroundColor: "white" }}>


      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <Pressable
          style={{
            padding: 10,

            width: "95%",
            flex: 1,
          }}
        >
          <Text style={{ fontWeight: "bold", textAlign: "right" }}>
            {user_?.name || user_?.email || user_?.phone}

          </Text>
        </Pressable>
        <Pressable
          style={{
            padding: 10,
            borderColor: "#55a8b9",
            borderWidth: 1,
            borderRadius: 8,
            width: "95%",
            flex: 1,
            height: 50,
            justifyContent: "center"
          }}
          onPress={() => navigation.navigate("OrderHistory")}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>طلباتي</Text>
        </Pressable>

        <Pressable
          style={{
            padding: 10,
            borderColor: "#55a8b9",
            borderWidth: 1,
            borderRadius: 8,
            width: "95%",

            flex: 1,
            height: 50,
            justifyContent: "center"

          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>حسابي</Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <Pressable
          style={{
            padding: 10,
            borderColor: "#55a8b9",
            borderWidth: 1,
            borderRadius: 8,
            width: "95%",
            flex: 1,
            height: 50,
            justifyContent: "center"

          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>قائمتي</Text>
        </Pressable>

        <Pressable
          style={{
            padding: 10,
            borderColor: "#ff1111",
            backgroundColor : "#ff1111",
            borderWidth: 1,
            borderRadius: 8,
            width: "95%",
            flex: 1,
            height: 45,
            justifyContent: "center"

          }}
          onPress={signOut}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>تسجيل الخروج</Text>
        </Pressable>
      </View>

      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading ? (
          <Text>Loading...</Text>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <Pressable
              style={{
                marginTop: 20,
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#d0d0d0",
                marginHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              key={order._id}
            >
              {order.products.map((product) => (
                <View style={{ marginVertical: 10 }} key={product._id}>
                  <Image
                    source={{ uri: product.image }}
                    style={{ width: 100, height: 100, resizeMode: "contain" }}
                  />
                </View>
              ))}
            </Pressable>
          ))
        ) : (
          <Text>لا يوجد طلبات</Text>
        )}
      </ScrollView> */}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
