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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
import { config } from "./config";
import Product from "../components/Product";

const SubCategorie = () => {
    const route = useRoute();

    const sectionRef = useRef();
    const sectionOneRef = useRef();
    const sectionTwoRef = useRef();
    const sectionThreeRef = useRef();

    const scrollToEnd = (ref) => {
        sectionRef.current.scrollToEnd({ animated: false });
        //   sectionOneRef.current.scrollToEnd({ animated: false });
        //   sectionTwoRef.current.scrollToEnd({ animated: false });
        //   sectionThreeRef.current.scrollToEnd({ animated: false });

    };
    const [products, setProducts] = useState([]);
    const [productLoaded, setProductLoaded] = useState(false)
    const navigation = useNavigation();
    const [addresses, setAddresses] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const [currentSubId, setCurrentSubId] = useState("")
    const [subCategories, setSubCategories] = useState([])
    const dispatch = useDispatch();

    console.log(route.params)
    const fetchCategoryAllProducts = async () => {
        const categoryId = await route.params?.item?._id
        const response = await axios.get(`${config.backendUrl}/category/${categoryId}/all-products?channel=web`)
        let setObj = new Set(response.data.data.map(JSON.stringify));
        let output = Array.from(setObj).map(JSON.parse);
        setProducts(output)
        setProductLoaded(true)
    }
    const fetchSubCategory = async () => {
        const categoryId = await route.params?.item?._id
        const response = await axios.get(`${config.backendUrl}/subcategory?ctg=${categoryId}`)
        console.log(response.data.data)
        setSubCategories(response.data.data.reverse())
    }
    const fetchSubCategoryProducts = async () => {
        const subCategoryId = currentSubId
        const response = await axios.get(`${config.backendUrl}/subcategory/${subCategoryId}`)
        setProducts(response.data.data.productList.reverse())
        setProductLoaded(true)
    }
    useEffect(() => {
        if (!currentSubId && products.length <= 0) {
            fetchCategoryAllProducts()
        } else {
            fetchSubCategoryProducts()
        }
    }, [currentSubId])
    useEffect(() => {
        fetchSubCategory()
    }, [])



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
                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingTop: 30 }}>
                            <Pressable
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


                            >
                                <Image
                                    style={{ width: 120, height: 100, resizeMode: "cover", borderRadius: 11 }}
                                    source={{ uri: `${config.backendBase}${route.params.item.image}` }}
                                />

                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontSize: 16,
                                        fontWeight: "600",
                                        marginTop: 5,
                                    }}
                                >
                                    {route.params.item?.name}
                                </Text>

                            </Pressable>

                        </View>
                        <Text style={{
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: "600",
                            marginTop: 5,
                            marginBottom: 10,
                            textAlign: "right",
                            paddingHorizontal: 10
                        }}

                        >{route.params.item?.description}
                        </Text>
                        {subCategories.length > 0 ?
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                            }}
                                onContentSizeChange={scrollToEnd}
                                ref={sectionRef} >
                                {subCategories.map((item) => {
                                    return <Pressable
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginHorizontal: 7,
                                            backgroundColor: currentSubId === item?._id ? "#55a8b9" : "white",
                                            borderRadius: 3,
                                            paddingHorizontal: 20,
                                            color: currentSubId === item?._id ? "#fff" : "000",
                                            paddingVertical: 10,
                                            borderColor: "#55a8b9",
                                            borderWidth: 3,

                                        }}
                                        key={item?._id}
                                        onPress={() => setCurrentSubId(item?._id)}
                                    >
                                        <Text style={{
                                            color: currentSubId === item?._id ? "#fff" : "#000",
                                        }}

                                        >{item.name}</Text>

                                    </Pressable>
                                })}
                            </ScrollView> : null}
                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", paddingTop: 30, }}>
                            {products.length > 0 ? products.map((item) => {
                                return <Product item={item} key={item?._id} />
                            }) : products.length === 0 && productLoaded ? 
                            <Text style={{fontWeight: "bold", fontSize: 18, marginTop: 40}}>لا يوجد منتجات حاليا</Text>
                            : null}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >

        </>
    );
};

export default SubCategorie;

const styles = StyleSheet.create({});
