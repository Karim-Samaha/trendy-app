import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Platform,
    ScrollView,
} from "react-native";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "./config";
import Product from "../components/Product";
import _axios from "../Utils/axios";
import Search from "../components/Search";
import { useFocusEffect } from '@react-navigation/native';
import { FavLocales } from "../constants/Locales";

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
            setProductLoaded(true)
        }

    }
    useEffect(() => {
        fetchFav()
        console.log("what!!!")
    }, [])
    useFocusEffect(
        useCallback(() => {
            fetchFav()
        }, [])
    );
    return (
        <>
            <SafeAreaView
                style={styles.safeScrollView}
            >
                <Search />

                <ScrollView style={styles.scrollView}>



                    <View style={styles.container}>

                        <View style={{
                            ...styles.productsContainer, justifyContent: products.length === 0 ? "center" : "space-between",
                        }}>
                            {products.length > 0 ? products.map((item) => {
                                return <Product item={item} key={item?._id} twoCell={true} containerStyle={{ width: 160, height: 140 }} />
                            }) : products.length === 0 && productLoaded ?
                                <Text style={styles.noProductsText}>
                                    {FavLocales[['ar'].empty]}
                                </Text>
                                : null}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >

        </>
    );
};

export default Favorite;

const styles = StyleSheet.create({
    safeScrollView: {
        paddinTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "white",
    },
    scrollView: {
        direction: "rtl",
        paddingTop: 50,
    },
    container: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        paddingBottom: 80
    },
    productsContainer: {
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        paddingTop: 30
    },
    noProductsText: {
        fontSize: 16,
        marginTop: 40,
        fontFamily: "CairoBold"
    }
});
