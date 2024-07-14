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
    TouchableOpacity
} from "react-native";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
import { config } from "./config";
import Product from "../components/Product";
import Search from "../components/Search";

const SearchScreen = () => {
    const route = useRoute();

    const sectionRef = useRef();


    const [products, setProducts] = useState([]);
    const [productLoaded, setProductLoaded] = useState(false)
    const [subCategories, setSubCategories] = useState([])
    const [limit, setLimit] = useState(12)
    const requestMore = () => {
        setLimit(prev => prev + 10)
    }


    const fetchProductsSearch = async () => {
        const keyword = await route.params?.search
        console.log(keyword)
        const response = await axios.get(`${config.backendUrl}/products/search/${keyword}?channel=web`)
        setProducts(response.data.data.reverse())
        setProductLoaded(true)
    }

    useEffect(() => {
        fetchProductsSearch()
    }, [route?.params?.search])


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
                    <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                        <Text style={{fontFamily: "CairoMed", fontSize: 13}}>نتائج البحث : <Text style={{ fontFamily: "CairoBold", fontSize: 13 }}>{route.params?.search}</Text></Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", paddingTop: 10, paddingBottom: 80 }}>
                            {products.length > 0 ? products.map((item) => {
                                return <Product item={item} key={item?._id} containerStyle={{ width: 160, height: 140 }} twoCell={true} />
                            }) : products.length === 0 && productLoaded ?
                                <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 40 }}>لا يوجد نتائج</Text>
                                : null}
                        </View>
                        {/* <View style={{ alignItems: "center" }}>
                            <TouchableOpacity style={styles.moreBtn} onPress={requestMore}>
                                <Text style={styles.moreText}>
                                    عرض المزيد
                                </Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </ScrollView>
            </SafeAreaView >

        </>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    moreBtn: {
        backgroundColor: "#55a8b9",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
        marginTop: 10,
        width: "40%",
    },
    moreText: {
        color: '#fff',
        fontWeight: "bold"
    }

});
