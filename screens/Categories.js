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
import ProductItem from "../components/ProductItem";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
import { config } from "./config";

const Categories = () => {
    const [list, setList] = useState([])


    const categoryRef = useRef();
    const sectionOneRef = useRef();
    const sectionTwoRef = useRef();
    const sectionThreeRef = useRef();


    const [products, setProducts] = useState([]);
    const navigation = useNavigation();
    const [addresses, setAddresses] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const [selectedAddress, setSelectedAdress] = useState("");
    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${config.backendUrl}/category`);
            setList(response.data.data.filter((item) => item?.active));
        } catch (error) {
            console.log("error message", error);
        }
    };
    useEffect(() => {
        fetchCategory()
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
                                direction: "rtl", flexDirection: "row-reverse",
                            }}
                            />
                            <AntDesign
                                style={{
                                    position: "absolute", right: 5,
                                    top: 8,
                                }}
                                name="search1"
                                size={22}
                                color="black"
                            />
                        </Pressable>

                    </View>



                    <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#55a8b9", paddingTop: 30 }}>كل التصنيفات</Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingTop: 30 }}>
                            {list.map((item, index) => (
                                <Pressable
                                    key={index}
                                    style={{
                                        width: "45%",
                                        backgroundColor: "#f4f1df",
                                        borderRadius: 11,
                                        margin: 5,
                                        height: 160,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                    onPress={() => navigation.navigate("SubCategories", {
                                        id: item.id,
                                        title: item.title,
                                        price: item?.price,
                                        carouselImages: item.carouselImages,
                                        color: item?.color,
                                        size: item?.size,
                                        oldPrice: item?.oldPrice,
                                        item: item,
                                    })}

                                >
                                    <Image
                                        style={{ width: 120, height: 100, resizeMode: "cover", borderRadius: 11 }}
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
                        </View>
                    </View>






                </ScrollView>
            </SafeAreaView >

        </>
    );
};

export default Categories;

const styles = StyleSheet.create({});
