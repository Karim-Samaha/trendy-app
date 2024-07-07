import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
    decrementQuantity,
    incementQuantity,
    removeFromCart,
} from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import { config } from "./config";
import _axios from "../Utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderItem from "../components/OrderItem";

const OrderHistory = () => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 3,
    });
    const cart = useSelector((state) => state.cart.cart);
    const [user, setUser] = useState({})
    const [orders, setOrders] = useState([])
    const hangleShowMore = () => {
        setPagination((prev) => ({ ...prev, limit: (prev.limit += 3) }));
    };
    const fetchOrders = async () => {
        const user = await AsyncStorage.getItem(("user"))
        if (user) {
            let parsedUser = JSON.parse(user)
            setUser(parsedUser)
            const response = await _axios.post(`${config.backendUrl}/get-user-order?page=${pagination.page}&limit=${pagination.limit}`,
                { test: "!" }, { parsedUser })
            console.log("!!!!!!!!!!!!!!!")
            console.log(response.data)
            setOrders(response.data.data)
        }
    }
    useEffect(() => {
        fetchOrders()
    }, [pagination])


    return (
        <ScrollView style={{ marginTop: 0, flex: 1, backgroundColor: "white" }}>

            <View style={{ padding: 10, flexDirection: "row", alignItems: "center", flexDirection: "row-reverse" }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>الطلبات السابقة</Text>
            </View>

            <Text
                style={{
                    height: 1,
                    borderColor: "#D0D0D0",
                    borderWidth: 1,
                    marginTop: 16,
                }}
            />

            <View style={{ marginHorizontal: 10 }}>
                {orders.length > 0 ? orders?.map((item, index) => (
                    <OrderItem item={item} key={item?._id} user={user} />
                )) : null}
                <Pressable style={styles.more} onPress={hangleShowMore}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>عرض المزيد</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default OrderHistory;

const styles = StyleSheet.create({

    more: {
        backgroundColor: "#55a8b9",
        padding: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
        marginVertical: 10,
    }
});
