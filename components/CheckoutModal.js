import {
    ActivityIndicator,
    Image,
    Modal,

    Pressable,

    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import React, { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import _axios from "../Utils/axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { config } from "../screens/config"
import { getUser, renderTotalPrice_ } from "../Utils/helpers"
import axios from "axios"
import { PaymentLocal, RefundLocal } from "../constants/Locales"


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


const PaymentDialog = ({ show, close, amount, vat, couponResponse, ShippingType, ShippingInfo }) => {
    const [method, setMethod] = useState("CC")
    const [loading, setLoading] = useState(false)
    const cart = useSelector((state) => state.cart.cart);
    const renderTotalPrice = renderTotalPrice_(cart, couponResponse?.precent);

    const navigation = useNavigation();
    const PaymentMethods = [
        // { img: require("../assets/payments/dialog-mada.png"), value: "MC" },
        // { img: require("../assets/payments/dialog-stcpay.png"), value: "SP" },
        { img: require("../assets/payments/dialog-vm.png"), value: "CC" },
        { img: require("../assets/payments/tabby.png"), value: "TABYY" },
        { img: require("../assets/payments/delv.png"), value: "CASH" },
        { img: require("../assets/payments/transfer.png"), value: "TRANSFER" },

    ]
    const handlePayment = async () => {
        // create checkout session
        const user = await AsyncStorage.getItem(("user"))
        if (user) {
            let parsedUser = await JSON.parse(user)
            const sessionBody = {
                id: "000",
                status: 'PROCCESSING',
                amount: +amount * 100,
                description: JSON.stringify(cart.map((item) => ({
                    id: item?.item?._id,
                    price: item.price,
                    priceBefore: item.priceBefore,
                    name: item?.item?.name,
                    formInfo: item.formInfo,
                    color: item?.item?.color,
                    quantity: item.quantity,
                    selectedCard: item?.selectedCard,
                    text: item?.item?.text,
                    image: item?.item?.image,
                }))),
                amount_format: `${+amount * 100}`,
                source: "null",
                userId: parsedUser?._id,
                couponResponse: couponResponse,
                ShippingType: ShippingType || 'Trendy Rose',
                ShippingInfo: ShippingType === 'استلام من المتجر' ? ShippingInfo : {},
                vat: +vat,
                userNote: "",
                pointsUsed: 0,
            }
            let response = await _axios.post(`${config.backendUrl}/create-checkout-initial-session`,
                sessionBody, { parsedUser })
            // navigate to gateway
            close()
            navigation.navigate("Payment", {
                user: parsedUser,
                mobileSessionId: response.data.data._id,
                amount: +amount * 100
            })
        }
    }
    const createCheckoutSession = async () => {
        const id = Math.random().toString(16).slice(2);
        const user = await getUser()
        _axios
            .post(
                `${config.backendUrl}/create-checkout-deleviery/${id}`,
                {
                    id: id,
                    status: "PROCCESSING",
                    amount: +amount,
                    vat: +vat,
                    description: JSON.stringify(cart.map((item) => ({
                        id: item?.item?._id,
                        price: item.price,
                        priceBefore: item.priceBefore,
                        name: item?.item?.name,
                        formInfo: item.formInfo,
                        color: item?.item?.color,
                        quantity: item.quantity,
                        selectedCard: item?.selectedCard,
                        text: item?.item?.text,
                        image: item?.item?.image,
                    }))),
                    amount_format: `${+amount}`,
                    source:
                        method === "TRANSFER"
                            ? "BANK_TRANSFER"
                            : method === "Points"
                                ? "Points"
                                : "Cash_On_Delivery",
                    userId: user._id,
                    couponResponse: JSON.stringify({
                        ...couponResponse,
                        deductedAmount: +renderTotalPrice?.deductedAmount,
                    }),
                    ShippingType: ShippingType || 'Trendy Rose',
                    ShippingInfo: ShippingType === 'استلام من المتجر' ? ShippingInfo : {},
                    userNote: "",
                    pointsUsed: 0,
                },
                //@ts-ignore
                { user }
            )
            .then((res) => {
                close()
                navigation.navigate("OrderHistory", { callback: "purchase" })
            })
            .catch((err) => console.log(err));
    };
    const PayNow = () => {
        if (method === 'CC') {
            handlePayment()
        } else if (method === 'TRANSFER' || method === 'CASH') {
            createCheckoutSession()
        }
    }
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={show}
            onRequestClose={close}
            style={styles.wrapper}
        >
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {PaymentLocal['ar'].methodSelect}
                        </Text>
                    </View>
                    <View style={styles.methodsWrapper}>
                        {PaymentMethods.map((m, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => {
                                    setMethod(m.value)
                                }}
                                style={
                                    method === m.value
                                        ? [styles.methodWrapper, styles.selected]
                                        : styles.methodWrapper
                                }
                            >
                                <Image style={styles.img} source={m.img} />
                            </TouchableOpacity>
                        ))}
                    </View>
                    {method === 'TRANSFER' &&
                        <View style={styles.bankInfoContainer}>
                            <Text style={{ ...styles.boldText, marginBottom: 10 }}>{PaymentLocal['ar'].bankHeader}</Text>
                            <Text style={styles.secText}>{PaymentLocal['ar'].bankName} : <Text style={styles.boldText}>مصرف الراجحي</Text></Text>
                            <Text style={styles.secText}>{PaymentLocal['ar'].accountName} : <Text style={styles.boldText}>TRENDY ROSE</Text></Text>
                            <Text style={styles.secText}>{PaymentLocal['ar'].accountNum} : <Text style={styles.boldText}>996000010006080868434</Text></Text>
                            <Text style={styles.secText}>{PaymentLocal['ar'].iban} : <Text style={styles.boldText}>SA1280000996000010006080868434</Text></Text>
                            <Text style={styles.secText}>{PaymentLocal['ar'].swift} : <Text style={styles.boldText}>RJHISARI</Text></Text>
                        </View>
                    }
                    <View style={styles.bankInfoContainer}>
                        <Text style={{ ...styles.boldText, marginBottom: 10 }}>{RefundLocal['ar'].title}</Text>
                        <Text style={styles.bankContentTxt}>{RefundLocal['ar'].content}</Text>
                    </View>
                    <View style={styles.noteSection}>
                        <Text style={styles.noteSectionText}>{PaymentLocal['ar'].note1}
                        </Text>
                        <Pressable onPress={() => null} style={styles.noteWrapper}>
                            <Text style={styles.note}>{PaymentLocal['ar'].note2}</Text>
                        </Pressable>
                    </View>
                    <View style={styles.section}>
                        {loading ? (
                            <ActivityIndicator size="large" color={Theme?.fontColor} />
                        ) : (
                            <TouchableOpacity
                                onPress={PayNow} style={styles.button}
                            >
                                <Text style={styles.buttonText}>{PaymentLocal['ar'].payNow}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default PaymentDialog

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
        fontSize: 14,
        color: "#000",
        fontFamily: "CairoBold"
    },
    methodsWrapper: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    methodWrapper: {
        width: "45%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        marginLeft: "2.5%",
        marginRight: "2.5%",
        marginBottom: "5%",
        padding: 5,
        backgroundColor: "#f2f2f2",
    },
    selected: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    button: {
        width: "100%",
        padding: 15,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#55a8b9",
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontFamily: "CairoMed"
    },
    img: {
        width: "100%",
        height: undefined,
        aspectRatio: 2 / 1,
        borderRadius: 8,
        resizeMode: 'contain'

    },
    section: {
        width: "100%",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    noteSection: {
        width: "100%",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        textAlign: "center",
    },
    noteWrapper: {
        paddingLeft: 4,
        paddingRight: 4,
    },
    note: {
        color: 'blue',
        fontFamily: "CairoMed",
        fontSize: 11

    },
    noteSectionText: {
        color: `#000`,
        fontFamily: "CairoMed",
        fontSize: 12,
    },
    bankInfoContainer: {
        width: "100%",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "silver",
        padding: 10,
        borderRadius: 10
    },
    boldText: {
        fontFamily: "CairoBold",
        fontSize: 13
    },
    secText: {
        fontFamily: "CairoMed",
        fontSize: 13
    },
    bankContentTxt: { 
        fontSize: 9, 
        fontFamily: "CairoMed"
     }
})
