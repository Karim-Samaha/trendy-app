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

const SubCategorie = () => {
    const route = useRoute();

    const list = [
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
    ];

    const deals = [
        {
            id: "20",
            title: "بوكس ورد طبيعي فاخر من البيبي روز مع من الداشبورد",
            oldPrice: 25000,
            price: 19000,
            image:
                "https://images-eu.ssl-images-amazon.com/images/G/31/wireless_products/ssserene/weblab_wf/xcm_banners_2022_in_bau_wireless_dec_580x800_once3l_v2_580x800_in-en.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/61QRgOgBx0L._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61uaJPLIdML._SX679_.jpg",
                "https://m.media-amazon.com/images/I/510YZx4v3wL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61J6s1tkwpL._SX679_.jpg",
            ],
            color: "Stellar Green",
            size: "6 GB RAM 128GB Storage",
        },
        {
            id: "30",
            title: "بوكس ورد طبيعي فاخر من البيبي روز مع من الداشبورد",
            oldPrice: 74000,
            price: 26000,
            image:
                "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/SamsungBAU/S20FE/GW/June23/BAU-27thJune/xcm_banners_2022_in_bau_wireless_dec_s20fe-rv51_580x800_in-en.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/81vDZyJQ-4L._SY879_.jpg",
                "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/71yzyH-ohgL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
            ],
            color: "Cloud Navy",
            size: "8 GB RAM 128GB Storage",
        },
        {
            id: "40",
            title: "بوكس ورد طبيعي فاخر من البيبي روز مع من الداشبورد",
            oldPrice: 16000,
            price: 14000,
            image:
                "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/CatPage/Tiles/June/xcm_banners_m14_5g_rv1_580x800_in-en.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/817WWpaFo1L._SX679_.jpg",
                "https://m.media-amazon.com/images/I/81KkF-GngHL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61IrdBaOhbL._SX679_.jpg",
            ],
            color: "Icy Silver",
            size: "6 GB RAM 64GB Storage",
        },
        {
            id: "40",
            title: "بوكس ورد طبيعي فاخر من البيبي روز مع من الداشبورد",
            oldPrice: 12999,
            price: 10999,
            image:
                "https://images-eu.ssl-images-amazon.com/images/G/31/tiyesum/N55/June/xcm_banners_2022_in_bau_wireless_dec_580x800_v1-n55-marchv2-mayv3-v4_580x800_in-en.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/41Iyj5moShL._SX300_SY300_QL70_FMwebp_.jpg",
                "https://m.media-amazon.com/images/I/61og60CnGlL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61twx1OjYdL._SX679_.jpg",
            ],
        },
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
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [category, setCategory] = useState("jewelery");
    const { userId, setUserId } = useContext(UserType);
    const [selectedAddress, setSelectedAdress] = useState("");
    const [currentSubId, setCurrentSubId] = useState("")
    const dispatch = useDispatch();
    const addItemToCart = (item) => {
        dispatch(addToCart(item));
      };
    const [items, setItems] = useState([
        { label: "Men's clothing", value: "men's clothing" },
        { label: "jewelery", value: "jewelery" },
        { label: "electronics", value: "electronics" },
        { label: "women's clothing", value: "women's clothing" },
    ]);
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
                            {list.filter((item) => item.id === route.params.id).map((item, index) => (
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
                                    onPress={() => navigation.navigate("SubCategory", {
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
                                        source={{ uri: item.image }}
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
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                        }}
                            onContentSizeChange={scrollToEnd}
                            ref={sectionRef} >
                            <Pressable
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginHorizontal: 7,
                                    backgroundColor: currentSubId === '4' ? "#55a8b9" : "white",
                                    borderRadius: 3,
                                    paddingHorizontal: 20,
                                    color: currentSubId === '4' ? "#fff" : "000",
                                    paddingVertical: 10,
                                    borderColor: "#55a8b9",
                                    borderWidth: 3,

                                }}
                                onPress={() => setCurrentSubId("4")}
                            >
                                <Text style={{
                                    color: currentSubId === '4' ? "#fff" : "#000",
                                }}

                                >تصنيف فرعي 4</Text>

                            </Pressable>
                            <Pressable
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginHorizontal: 7,
                                    backgroundColor: currentSubId === '3' ? "#55a8b9" : "white",
                                    borderRadius: 3,
                                    paddingHorizontal: 20,
                                    color: currentSubId === '3' ? "#fff" : "000",
                                    paddingVertical: 10,
                                    borderColor: "#55a8b9",
                                    borderWidth: 3,

                                }}
                                onPress={() => setCurrentSubId("3")}

                            >
                                <Text style={{
                                    color: currentSubId === '3' ? "#fff" : "#000",
                                }}
                                >تصنيف فرعي 3</Text>

                            </Pressable>
                            <Pressable
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginHorizontal: 7,
                                    backgroundColor: currentSubId === '2' ? "#55a8b9" : "white",
                                    borderRadius: 3,
                                    paddingHorizontal: 20,
                                    color: currentSubId === '2' ? "#fff" : "#000",
                                    paddingVertical: 10,
                                    borderColor: "#55a8b9",
                                    borderWidth: 3,

                                }}
                                onPress={() => setCurrentSubId("2")}

                            >
                                <Text style={{
                                    color: currentSubId === '2' ? "#fff" : "#000",
                                }}
                                >تصنيف فرعي 2</Text>

                            </Pressable>
                            <Pressable
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginHorizontal: 7,
                                    backgroundColor: currentSubId === '1' ? "#55a8b9" : "white",
                                    borderRadius: 3,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderColor: "#55a8b9",
                                    borderWidth: 3,

                                }}
                                onPress={() => setCurrentSubId("1")}

                            >
                                <Text style={{
                                    color: currentSubId === '1' ? "#fff" : "#000",
                                }}
                                >تصنيف فرعي 1</Text>

                            </Pressable>

                        </ScrollView>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingTop: 30 }}>
                            {offers.map((item, index) => (
                                <Pressable
                                    key={index}
                                    style={{
                                        width: "45%",
                                        borderRadius: 11,
                                        margin: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                    onPress={() => navigation.navigate("Info", {
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
                                        source={{ uri: item.image }}
                                    />

                                    <Text
                                        style={{
                                            textAlign: "center",
                                            fontSize: 16,
                                            fontWeight: "600",
                                            marginTop: 5,
                                        }}
                                    >
                                        {item?.title}
                                    </Text>
                                    <View>

                                        <Text style={{ fontWeight: "bold", fontSize: 11, }}>سعر قبل الخصم : <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{item.oldPrice}</Text></Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>السعر : {item.price}</Text>

                                    </View>
                                    <Pressable style={{
                                        backgroundColor: "#55a8b9", width: 120, alignItems: "center", justifyContent: "center",
                                        height: 36, borderRadius: 6, marginTop: 10
                                    }} onPress={() => addItemToCart(item)}>
                                        <Text style={{ color: "#fff" }}>اضف الي السلة</Text>
                                    </Pressable>
                                    <View
                                        style={{
                                            backgroundColor: "#E31837",
                                            paddingVertical: 5,
                                            width: 130,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: 10,
                                            borderRadius: 4,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: "center",
                                                color: "white",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            خصم {item?.offer}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </View>






                </ScrollView>
            </SafeAreaView >

        </>
    );
};

export default SubCategorie;

const styles = StyleSheet.create({});
