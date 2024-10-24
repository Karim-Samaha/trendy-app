import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Platform,
    ScrollView,
    Pressable,
    Image,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
import { config } from "./config";
import Search from "../components/Search";
import { LanguageContext } from "../context/langContext";
import { renderEnglishName } from "../Utils/renderEnglishName";

const Categories = () => {
    const [list, setList] = useState([])
    const [listImgError, setListImgError] = useState([])
    const { lang } = useContext(LanguageContext)




    const navigation = useNavigation();
    const [addresses, setAddresses] = useState([]);
    const { userId, setUserId } = useContext(UserType);
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
                style={styles.safeAreaView}
            >
                <Search />

                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <View style={styles.listContainer}>
                            {list.map((item, index) => (
                                <Pressable
                                    key={index}
                                    style={styles.categoryItemPress}
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
                                        style={styles.categoryImg}
                                        source={{
                                            uri: `${config.backendBase}${item.image}`
                                        }}
                                        onError={() => setListImgError((prev) => ([...prev, item?._id]))}
                                    />
                                    <Text
                                        style={styles.categoryText}
                                    >
                                        {lang === 'ar' ? item?.name : renderEnglishName(item)}
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

const styles = StyleSheet.create({
    safeAreaView: {
        paddinTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "white",
    },
    scrollView: {
        direction: "rtl",
        paddingTop: 60,
    },
    container: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        paddingBottom: 80
    },
    listContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingTop: 20
    },
    categoryItemPress: {
        width: "45%",
        backgroundColor: "#f4f1df",
        borderRadius: 11,
        margin: 5,
        height: 160,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    categoryImg: {
        width: 120,
        height: 100,
        resizeMode: "cover",
        borderRadius: 11
    },
    categoryText: {
        textAlign: "center",
        fontSize: 14,
        marginTop: 5,
        fontFamily: "CairoMed"
    }
});
