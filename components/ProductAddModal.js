import {
    ActivityIndicator,
    Image,
    Modal,

    Pressable,

    ScrollView,

    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native"
import React, { useEffect, useMemo, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"

import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import _axios from "../Utils/axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { config } from "../screens/config"
import { getUser, renderTotalPrice_ } from "../Utils/helpers"
import axios from "axios"
import Product from "./Product"
import { useFocusEffect } from '@react-navigation/native';


const ReadyUIPayments = {
    SP: "stc_pay",
    MC: "mada_card",
    CC: "credit_card",
}

const CheckoutPayments = {
    SP: "SP",
    MC: "CC",
    CC: "CC",
    AP: "AP",
}



const ProductAddsModal = ({ show, close, category, handleSelectAdd }) => {
    const [products, setProducts] = useState([])
    const [loaded, setLoaded] = useState(false)
    const renderTitle = () => {
        if (category === 'كروت اهداء' || category === '1') {
            return 'كروت اهداء'
        } else {
            return category
        }
    }
    const fetchProducts = async () => {
        try {
            const categoryName = renderTitle()
            const response = await axios.get(`${config.backendUrl}/subcategory?ctgName=${categoryName}`)
            setProducts(response?.data?.data?.productList?.filter((item) => item.active))
            setLoaded(true)
        } catch (err) {
            console.log(err)
            setProducts([])
        }
    }
    useEffect(() => {
        console.log("run!")
        fetchProducts()
    }, [show])

    const handleAddToCart = () => {

    }

    const renderProductRows = (item) => {
        const rows = [];
        for (let i = 0; i < products.length; i += 2) {
            rows.push(
                <View key={products[i]?.id} style={styles.row}>
                    <Product item={products[i]} containerStyle={{ width: 120, height: 100 }} twoCell={true} handleAddToCart={handleSelectAdd} />
                    {products[i + 1] && <Product item={products[i + 1]} containerStyle={{ width: 120, height: 100 }} twoCell={true} handleAddToCart={handleSelectAdd} />}
                </View>
            );
        }
        return rows;
    };
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={show}
            onRequestClose={() => {
                console.log("!!!!!!!!!")
                close()
            }}
            onStartShouldSetResponder={close}
            style={styles.wrapper}
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback>
                        <View style={styles.wrapper}>
                            <View style={styles.header}>
                                <Text style={styles.title}>
                                    {renderTitle()}
                                </Text>
                            </View>
                            <ScrollView style={{
                                direction: "rtl",
                                paddingVertical: 0,
                                marginTop: 0,
                                width: "100%",
                                height: 500,
                            }} contentContainerStyle={{
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {loaded && products?.length > 0 && renderProductRows()}
                                {loaded && products?.length === 0 && <Text>لا يوجد منتجات حاليا</Text>}
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default ProductAddsModal

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, .5)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    wrapper: {
        width: "100%",
        padding: 10,
        backgroundColor: "white",
        borderRadius: 8,
        alignItems: "center",
    },
    header: {
        width: "100%",
        padding: 10,
        marginBottom: 20,
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",

    },
    title: {
        fontWeight: "600",
        fontSize: 17,
        color: "#000",
    },
    productListContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingTop: 10,
        height: 550,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
})
