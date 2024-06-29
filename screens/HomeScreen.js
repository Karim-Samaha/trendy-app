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
import Product from "../components/Product";
import Search from "../components/Search";
const HomeScreen = () => {
  // const images = [
  //   "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/wb9ms.jpeg",
  //   "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/dznig.png",
  //   "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/wb9ms.jpeg",
  // ];
  const [sections, setSections] = useState({})
  const [images, setImages] = useState({
    banners: [],
    heros: []
  })
  const categoryRef = useRef();
  const sectionOneRef = useRef();
  const sectionTwoRef = useRef();
  const sectionThreeRef = useRef();

  const scrollToEnd = (ref) => {
    categoryRef.current?.scrollToEnd({ animated: false });
    sectionOneRef.current?.scrollToEnd({ animated: false });
    sectionTwoRef.current?.scrollToEnd({ animated: false });
    sectionThreeRef.current?.scrollToEnd({ animated: false });

  };
  const [list, setList] = useState([])
  const [listImgError, setListImgError] = useState([])
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [selectedAddress, setSelectedAdress] = useState("");
  const dispatch = useDispatch();


  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/category`);
      setList(response.data.data.filter((item) => item?.active));
    } catch (error) {
      console.log("error message", error);
    }
  };
  const fetchSections = async (order) => {
    try {
      const response = await axios.get(`${config.backendUrl}/subcategory?isHomeSection=${order}`);
      setSections(prev => ({ ...prev, [order]: { productsList: response.data.data[0]?.productList.filter((item) => item?.active), categoryName: response.data.data[0].name } }));
    } catch (error) {
      console.log("error message", error);
    }
  };
  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/banners`);
      setImages((prev) => ({
        ...prev, banners: response.data.data.filter((item) => item.type === 'BANNER'),
        heros: response.data.data.filter((item) => item.type === 'HERO_IMG'),
      }))
      console.log("!!!!!!!!!")
      console.log(response.data)
    } catch (error) {
      console.log("error message", error);
    }
  }
  useEffect(() => {
  }, [images])
  useEffect(() => {
    Promise.all([fetchCategory(),
    fetchSections(1),
    fetchSections(2),
    fetchSections(3),
    fetchBanners(),])
  }, []);

  useEffect(() => {
    console.log("!!!!!")
    console.log({ sections })
  }, [sections])


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
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = await AsyncStorage.getItem("authToken");
  //     const decodedToken = jwt_decode(token);
  //     const userId = decodedToken.userId;
  //     setUserId(userId);
  //   };

  //   fetchUser();
  // }, []);
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
          <Search />
          {images?.heros.length > 0 ? <SliderBox
            images={images.heros.map((item) => `${config.backendBase}${item?.imageSrc}`)}
            autoPlay
            circleLoop
            dotColor={"#13274F"}
            inactiveDotColor="#90A4AE"
            ImageComponentStyle={{ width: "100%" }}
          /> : null}
          <View style={{ direction: "rtl" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
              flexDirection: "row-reverse"
            }}
              onContentSizeChange={scrollToEnd}
              ref={categoryRef}
            >
              {list.length > 0 ? list.map((item, index) => (
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
                  onPress={() => navigation.navigate("SubCategories", {
                    id: item?.id,
                    title: item?.title,
                    price: item?.price,
                    carouselImages: item?.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })}
                >
                  <Image
                    style={{ width: 100, height: 100, resizeMode: "cover", borderRadius: 11 }}
                    source={{
                      uri: listImgError.includes(item?._id) ? "https://picsum.photos/200/300"
                        : `${config.backendBase}${item.image}`
                    }}
                    onError={() => setListImgError((prev) => ([...prev, item?._id]))}
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
              )) : null}
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
            {sections["1"]?.productsList?.length > 0 ? <>
              <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold", direction: "rtl", color: "#55a8b9" }}>
                {sections["1"]?.categoryName}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
                flexDirection: "row-reverse"
              }}
                onContentSizeChange={scrollToEnd}
                ref={sectionOneRef}>
                {sections["1"]?.productsList?.map((item, index) => (
                  <Product item={item} key={item.id} />
                ))}
              </ScrollView>
            </> : null}

            {images?.banners.length > 0 &&
              <>
                <Image src={`${config.backendBase}${images?.banners[0].imageSrc}`}
                  style={{ width: "100%", height: 200, marginVertical: 15 }} />
              </>
            }
          </View>
          <View>
            {sections["2"]?.productsList?.length > 0 ? <>
              <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold", direction: "rtl", color: "#55a8b9" }}>
                {sections["2"]?.categoryName}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
                flexDirection: "row-reverse"
              }}
                onContentSizeChange={scrollToEnd}
                ref={sectionTwoRef}>
                {sections["2"]?.productsList?.map((item, index) => (
                  <Product item={item} key={item.id} />
                ))}
              </ScrollView>
            </> : null}
            {images?.banners.length > 1 &&
              <>
                <Image src={`${config.backendBase}${images?.banners[1].imageSrc}`}
                  style={{ height: 200, marginVertical: 15 }} />
              </>
            }
          </View>
          <View>
            {sections["3"]?.productsList?.length > 0 ? <>
              <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold", direction: "rtl", color: "#55a8b9" }}>
                {sections["3"]?.categoryName}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
                flexDirection: "row-reverse"
              }}
                onContentSizeChange={scrollToEnd}
                ref={sectionThreeRef}>
                {sections["3"]?.productsList?.map((item, index) => (
                  <Product item={item} key={item.id} />
                ))}
              </ScrollView>
            </> : null}
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
