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
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
import { config } from "./config";
import Product from "../components/Product";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import _axios from "../Utils/axios";
import Search from "../components/Search";

const Favorite = () => {
    const route = useRoute();
    const sectionRef = useRef();
    const scrollToEnd = (ref) => {
        sectionRef.current.scrollToEnd({ animated: false });
        //   sectionOneRef.current.scrollToEnd({ animated: false });
        //   sectionTwoRef.current.scrollToEnd({ animated: false });
        //   sectionThreeRef.current.scrollToEnd({ animated: false });

    };
    const [products, setProducts] = useState([]);
    const [productLoaded, setProductLoaded] = useState(false)
    const navigation = useNavigation();
    const fetchFav = async () => {
        const user = await AsyncStorage.getItem(("user"))
        if (user) {
            let parsedUser = JSON.parse(user)
            const response = await _axios.post(`${config.backendUrl}/favorite`,
                {}, { parsedUser })

            setProducts(response.data.data)
            console.log(response.data.data)
            setProductLoaded(true)
        }

    }
    useEffect(() => {
        fetchFav()
    }, [])












    return (
        <>
            <SafeAreaView
                style={{
                    paddinTop: Platform.OS === "android" ? 40 : 0,
                    flex: 1,
                    backgroundColor: "white",
                }}
            >
                <Search />

                <ScrollView style={{
                    direction: "rtl",
                    paddingTop: 80,
                }}>



                    <View style={{ paddingHorizontal: 10, paddingVertical: 20, paddingBottom: 80 }}>
                        {/* <View style={{ flexDirection: "row-reverse", alignItems: "center", marginTop: 10 }}>
                            <MaterialIcons name="favorite" size={24} color="#55a8b9" />
                            <Text style={{ fontSize: 20, fontWeight: "bold", marginHorizontal: 10 }}>
                                قائمتي
                            </Text>

                        </View> */}
                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", paddingTop: 30, }}>
                            {products.length > 0 ? products.map((item) => {
                                return <Product item={item} key={item?._id}  twoCell={true}/>
                            }) : products.length === 0 && productLoaded ?
                                <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 40 }}>لم يتم اضافة منتجات في القائمة</Text>
                                : null}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >

        </>
    );
};

export default Favorite;

const styles = StyleSheet.create({});
