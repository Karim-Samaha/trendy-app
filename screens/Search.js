import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Platform,
    ScrollView,

} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

import { config } from "./config";
import Product from "../components/Product";
import Search from "../components/Search";
import { searchLocals } from "../constants/Locales";

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
                style={styles.scrollView}
            >
                <Search />
                <ScrollView style={styles.productsScrollView}>
                    <View style={styles.container}>
                        <Text style={styles.medText}>{searchLocals['ar'].result}
                            : <Text style={styles.boldText}>{route.params?.search}</Text></Text>
                        <View style={styles.productsContainer}>
                            {products.length > 0 ? products.map((item) => {
                                return <Product item={item} key={item?._id} containerStyle={{ width: 160, height: 140 }} twoCell={true} />
                            }) : products.length === 0 && productLoaded ?
                                <Text style={styles.noResultsText}>{searchLocals['ar'].noResult}</Text>
                                : null}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >

        </>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    scrollView: {
        paddinTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "white",
    },
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
    },
    container: {
        paddingHorizontal: 10,
        paddingVertical: 20
    },
    medText: {
        fontFamily: "CairoMed",
        fontSize: 13
    },
    boldText: {
        fontFamily: "CairoBold",
        fontSize: 13
    },
    productsScrollView: {
        direction: "rtl",
        paddingTop: 80,
    },
    productsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingTop: 10,
        paddingBottom: 80
    },
    noResultsText: {
        fontWeight: "bold",
        fontSize: 18,
        marginTop: 40
    }
});
