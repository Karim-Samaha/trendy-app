import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Button,
} from "react-native";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
import { addToCart } from "../redux/CartReducer";
import { config } from "./config";
const HomeScreen = () => {
  const images = [
    "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/wb9ms.jpeg",
    "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/dznig.png",
    "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/wb9ms.jpeg",
  ];

  const offers = [
    {
      id: "0",
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
    },
    {
      id: "1",
      title:
        "منتج 2",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg",
      ],
      color: "black",
      size: "Normal",
    },
    {
      id: "2",
      title:
        "منتج 3",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
      carouselImages: ["https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg"],
      color: "black",
      size: "Normal",
    },
    {
      id: "3",
      title:
        "منتج 4",
      offer: "40%",
      oldPrice: 24999,
      price: 19999,
      image: "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
        "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
      ],
      color: "Norway Blue",
      size: "8GB RAM, 128GB Storage",
    },
  ];
  const categoryRef = useRef();
  const sectionOneRef = useRef();
  const sectionTwoRef = useRef();
  const sectionThreeRef = useRef();

  const scrollToEnd = (ref) => {
    categoryRef.current.scrollToEnd({ animated: false });
    sectionOneRef.current.scrollToEnd({ animated: false });
    sectionTwoRef.current.scrollToEnd({ animated: false });
    sectionThreeRef.current.scrollToEnd({ animated: false });

  };
  const [list, setList] = useState([
    {
      id: "0",
      image: "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
      name: "الاكثر مبيعا",
    },
    {
      id: "1",
      image:
        "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
      name: "فازات ورد",
    },
    {
      id: "3",
      image:
        "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
      name: "ورد مع سمك",
    },
    {
      id: "4",
      image:
        "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
      name: "ورود التهنئة",
    },
    {
      id: "5",
      image:
        "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
      name: "ورد",
    },
    {
      id: "6",
      image: "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
      name: "ورد",
    },
  ])
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [selectedAddress, setSelectedAdress] = useState("");
  const dispatch = useDispatch();


  const addItemToCart = (item) => {
    dispatch(addToCart(item));
  };
  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/category`);
      setList(response.data.data.filter((item) => item?.active));
    } catch (error) {
      console.log("error message", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
      } catch (error) {
        console.log("error message", error);
      }
    };

    fetchData();
    fetchCategory()
  }, []);
  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  const cart = useSelector((state) => state.cart.cart);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/addresses/${userId}`
      );
      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);
  console.log("address", addresses);
  return (
    <>
      <SafeAreaView
        style={{
          paddinTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ScrollView style={{
          direction: "rtl"
        }}>
          <View
            style={{
              backgroundColor: "#00CED1",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              direction: "rtl",
              flexDirection: "row-reverse"
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 7,
                backgroundColor: "white",
                borderRadius: 3,
                height: 38,
                flex: 1,
                direction: "rtl",
                flexDirection: "row-reverse",
                position: "relative"
              }}
            >

              <TextInput placeholder="ابحث عن منتجك" style={{
                // direction: "rtl", flexDirection: "row-reverse",
              }}
              />
              <AntDesign
                style={{
                  position: "absolute", right: 5,
                  top: 8,
                }} name="search1"
                size={22}
                color="black" />
            </Pressable>

          </View>

          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 10,
              backgroundColor: "#AFEEEE",
            }}
          >
            {/* <Ionicons name="location-outline" size={24} color="black" />

            <Pressable>
              {selectedAddress ? (
                <Text>
                  Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  Add a Address
                </Text>
              )}
            </Pressable>

            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" /> */}
          </Pressable>



          <SliderBox
            images={images}
            autoPlay
            circleLoop
            dotColor={"#13274F"}
            inactiveDotColor="#90A4AE"
            ImageComponentStyle={{ width: "100%" }}
          />
          <View style={{ direction: "rtl" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
              flexDirection: "row-reverse"
            }}
              onContentSizeChange={scrollToEnd}
              ref={categoryRef}
            >
              {list.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    margin: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FDF9E7",
                    padding: 10,
                    borderRadius: 10
                  }}

                >
                  <Image
                    style={{ width: 100, height: 100, resizeMode: "cover", borderRadius: 11 }}
                    source={{ uri: `${config.backendBase}${item.image}` }}
                  />

                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "600",
                      marginTop: 5,
                    }}
                  >
                    {item?.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />
          <View>
            <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold", direction: "rtl", color: "#55a8b9" }}>
              الاكثر مبيعا
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
              flexDirection: "row-reverse"
            }}
              onContentSizeChange={scrollToEnd}
              ref={sectionOneRef}>
              {offers.map((item, index) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Info", {
                      id: item.id,
                      title: item.title,
                      price: item?.price,
                      carouselImages: item.carouselImages,
                      color: item?.color,
                      size: item?.size,
                      oldPrice: item?.oldPrice,
                      item: item,
                    })
                  }
                  style={{
                    marginVertical: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    marginHorizontal: 10
                  }}
                >
                  <Image
                    style={{ width: 120, height: 120, resizeMode: "contain", borderRadius: 11 }}
                    source={{ uri: item?.image }}
                  />
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
                  <View>

                    <Text style={{ fontWeight: "bold", fontSize: 11, }}>سعر قبل الخصم : <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: "#ff1111" }}>{item.oldPrice}</Text></Text>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>السعر : {item.price}</Text>

                  </View>
                  <View
                    style={{
                      backgroundColor: "#FDFDFD",
                      paddingVertical: 5,
                      width: 100,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                      borderRadius: 11,
                      borderWidth: 1,
                      borderColor : "#55a8b9"
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#55a8b9",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    >
                      خصم {item?.offer}
                    </Text>
                  </View>
                  <Pressable style={{
                    backgroundColor: "#55a8b9", width: 120, alignItems: "center", justifyContent: "center",
                    height: 36, borderRadius: 6, marginTop: 10
                  }} onPress={() => addItemToCart(item)}>
                    <Text style={{ color: "#fff" }} >اضف الي السلة</Text>
                  </Pressable>
                  
                </Pressable>
              ))}
            </ScrollView>
            <Image src={images[0]} style={{ width: "95%", height: 160, marginHorizontal: "2.5%", marginVertical: 15 }} />
          </View>
          <View>
            <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold", direction: "rtl", color: "#55a8b9" }}>
              الاكثر مبيعا
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
              flexDirection: "row-reverse"
            }}
              onContentSizeChange={scrollToEnd}
              ref={sectionTwoRef}>
              {offers.map((item, index) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Info", {
                      id: item.id,
                      title: item.title,
                      price: item?.price,
                      carouselImages: item.carouselImages,
                      color: item?.color,
                      size: item?.size,
                      oldPrice: item?.oldPrice,
                      item: item,
                    })
                  }
                  style={{
                    marginVertical: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    marginHorizontal: 10
                  }}
                >
                  <Image
                    style={{ width: 120, height: 120, resizeMode: "contain", borderRadius: 11 }}
                    source={{ uri: item?.image }}
                  />
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
                  <View>

                    <Text style={{ fontWeight: "bold", fontSize: 11, }}>سعر قبل الخصم : <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{item.oldPrice}</Text></Text>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>السعر : {item.price}</Text>

                  </View>
                  <View
                    style={{
                      backgroundColor: "#FDFDFD",
                      paddingVertical: 5,
                      width: 100,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                      borderRadius: 11,
                      borderWidth: 1,
                      borderColor : "#55a8b9"
                    }}
                  >

                    <Text
                      style={{
                        textAlign: "center",
                        color: "#55a8b9",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    >
                      خصم {item?.offer}
                    </Text>
                  </View>
                  <Pressable style={{
                    backgroundColor: "#55a8b9", width: 120, alignItems: "center", justifyContent: "center",
                    height: 36, borderRadius: 6, marginTop: 10
                  }} onPress={() => addItemToCart(item)}>
                    <Text style={{ color: "#fff" }} >اضف الي السلة</Text>
                  </Pressable>
               
                </Pressable>
              ))}

            </ScrollView>
            <Image src={images[1]} style={{ width: "95%", height: 160, marginHorizontal: "2.5%", marginVertical: 15 }} />
          </View>
          <View>
            <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold", direction: "rtl", color: "#55a8b9" }}>
              الاكثر مبيعا
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
              flexDirection: "row-reverse"
            }}
              onContentSizeChange={scrollToEnd}
              ref={sectionThreeRef}>
              {offers.map((item, index) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Info", {
                      id: item.id,
                      title: item.title,
                      price: item?.price,
                      carouselImages: item.carouselImages,
                      color: item?.color,
                      size: item?.size,
                      oldPrice: item?.oldPrice,
                      item: item,
                    })
                  }
                  style={{
                    marginVertical: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    marginHorizontal: 10
                  }}
                >
                  <Image
                    style={{ width: 120, height: 120, resizeMode: "contain", borderRadius: 11 }}
                    source={{ uri: item?.image }}
                  />
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
                  <View>

                    <Text style={{ fontWeight: "bold", fontSize: 11, }}>سعر قبل الخصم : <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{item.oldPrice}</Text></Text>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>السعر : {item.price}</Text>

                  </View>
                  <View
                    style={{
                      backgroundColor: "#FDFDFD",
                      paddingVertical: 5,
                      width: 100,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                      borderRadius: 11,
                      borderWidth: 1,
                      borderColor : "#55a8b9"
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#55a8b9",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    >
                      خصم {item?.offer}
                    </Text>
                  </View>
                  <Pressable style={{
                    backgroundColor: "#55a8b9", width: 120, alignItems: "center", justifyContent: "center",
                    height: 36, borderRadius: 6, marginTop: 10
                  }} onPress={() => addItemToCart(item)}>
                    <Text style={{ color: "#fff" }} >اضف الي السلة</Text>
                  </Pressable>
              
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />



        </ScrollView>
      </SafeAreaView >

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Choose your Location
            </Text>

            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Select a delivery location to see product availabilty and delivery
              options
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* already added addresses */}
            {addresses?.map((item, index) => (
              <Pressable
                onPress={() => setSelectedAdress(item)}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor: selectedAddress === item ? "#FBCEB1" : "white"
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {item?.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.houseNo},{item?.landmark}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  India, Bangalore
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                Add an Address or pick-up point
              </Text>
            </Pressable>
          </ScrollView>

          <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Enter an Indian pincode
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Use My Currect location
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="earth" size={22} color="#0066b2" />

              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Deliver outside India
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
