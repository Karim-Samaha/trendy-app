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
    const status = {
        PROCCESSING: "قيد التنفيذ",
        ON_THE_WAY: "تم الشحن",
        DELEIVERD: "تم التوصيل",
        RETURNED: "مسترجع"
    }

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
                    <View
                        style={{
                            marginVertical: 10,
                            minHeight: 300,
                            borderBottomColor: "#F0F0F0",
                            borderWidth: 2,
                            borderLeftWidth: 0,
                            borderTopWidth: 0,
                            borderRightWidth: 0,
                        }}
                        key={item?._id}
                    >
                        <View style={styles.orderHeader}>
                            <Text>
                                الرقم المرجعي : <Text style={{ fontWeight: "bold" }}>{item?._id}</Text>
                            </Text>
                            <Pressable style={styles.rate}>
                                <Text style={{
                                    color: "#5C71E5",
                                    fontWeight: "bold"
                                }}>تقيم</Text>
                            </Pressable>
                            <Text style={{ marginTop: 10 }}>
                                التاريخ : <Text style={{ fontWeight: "bold" }}>{item?.createdAt.split("T")[0]}</Text>
                            </Text>
                            <Text style={{ marginTop: 10 }}>
                                السعر : <Text style={{ fontWeight: "bold" }}>{item?.amount / 100}رس</Text>
                            </Text>
                            <View style={{
                                width: 150, height: 48, backgroundColor: item.orderStatus === 'DELEIVERD' ? "green" : "#faefe3",
                                justifyContent: "center",
                                borderRadius: 11
                            }}>
                                <Text style={{
                                    fontWeight: "bold",
                                    fontSize: 18,
                                    color: item.orderStatus === 'DELEIVERD' ? "#fff" : "#55a8b9", textAlign: "center"
                                }}>
                                    {status[item.orderStatus]}</Text>
                            </View>
                        </View>
                        {item.purchaseBulk.map((purchaseItem, index) => {
                            return <View style={styles.orderInfo} key={index}>
                                <Image
                                    style={{ width: 120, height: 120, resizeMode: "contain", borderRadius: 8 }}
                                    source={{ uri: `${config.assetsUrl}/${purchaseItem?.image}` }}
                                />
                                <View style={{ paddingHorizontal: 20, paddingTop: 20, flexShrink: 1 }}>
                                    <Text style={{ fontSize: 16, }}>{purchaseItem.name}</Text>
                                    <Text style={{ textAlign: "right" }}>الكمية : <Text style={{ fontWeight: "bold" }}>{purchaseItem.quantity}</Text></Text>
                                    <Text style={{ textAlign: "right" }}>السعر : <Text style={{ fontWeight: "bold" }}>{purchaseItem.price}رس</Text></Text>
                                    <Text style={{ textAlign: "right" }}>طريقة الشحن : <Text style={{ fontWeight: "bold" }}>{item.ShippingType}</Text></Text>
                                    <Text style={{ textAlign: "right" }}>بيانات المستلم  : <Text style={{ fontWeight: "bold" }}>
                                        {purchaseItem?.formInfo?.sentTo || item.ShippingInfo?.name || user?.name || user?.email || ""}</Text></Text>
                                    <Text style={{ textAlign: "right" }}>عنوان الشحن : <Text style={{ fontWeight: "bold" }}> {purchaseItem?.formInfo?.address ||
                                        "لم يتم تحديد العنوان (سيقوم الدعم بالتواصل مع المستلم)"}</Text></Text>


                                    <View style={styles.extra}><Text> التوصيل
                                        ( + 0.00 ر.س )</Text></View>
                                    <View style={styles.extra}><Text>
                                        وسيلة الدفع : <Text style={{ fontWeight: "bold" }}>{item.source}</Text>
                                    </Text></View>
                                    {purchaseItem.formInfo?.cardText.length > 0 ? <View style={styles.extra}><Text> نص بطاقة
                                        <Text style={{ fontWeight: "bold" }}>( + 6.00 ر.س )</Text></Text></View> : null}
                                    {purchaseItem?.selectedCard?.price ? <View style={styles.extra}><Text> اضافات الورود
                                        <Text style={{ fontWeight: "bold" }}>( + {purchaseItem?.selectedCard?.price} ر.س )</Text></Text></View> : null}
                                </View>

                            </View>
                        })}
                    </View>
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
    orderHeader: {
        minHeight: 135,
        backgroundColor: "#F8FAFC",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderTopLeftRadius: 11,
        borderTopRightRadius: 11,
        paddingVertical: 10,
        paddingHorizontal: 5,
        position: "relative"
    },
    rate: {
        position: "absolute",
        left: 5,
        top: 5,
        fontWeight: "bold",
    },
    orderInfo: {
        flexDirection: 'row-reverse',
        paddingVertical: 10,
    },
    extra: {
        backgroundColor: "#f8fafc",
        width: 220,
        height: 40,
        marginTop: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
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
