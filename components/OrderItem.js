import {
    StyleSheet,
    Text,
    View,
    Pressable,
    Image,
} from "react-native";
import { config } from "../screens/config";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
import { OrderItemLocal } from "../constants/Locales";
const OrderItem = ({ item, user }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const openModal = () => {
        setModalVisible(true)
    }
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const status = {
        PROCCESSING: "قيد التنفيذ",
        ON_THE_WAY: "تم الشحن",
        DELEIVERD: "تم التوصيل",
        RETURNED: "مسترجع"
    }
    return <View
        style={styles.screenContainer}
        key={item?._id}
    >
        <View style={styles.orderHeader}>
            <Text style={{ fontFamily: "CairoMed" }}>
                {OrderItemLocal['ar'].refNum} : <Text style={styles.boldTxt}>{item?._id}</Text>
            </Text>
            <Pressable style={styles.rate} onPress={openModal}>
                <Text style={styles.rateText}>{OrderItemLocal['ar'].rate}</Text>
            </Pressable>
            <Text style={styles.midTxt}>
                {OrderItemLocal['ar'].date} : <Text style={styles.boldTxt}>{item?.createdAt.split("T")[0]}</Text>
            </Text>
            <Text style={styles.midTxt}>
                {OrderItemLocal['ar'].price} : <Text style={styles.boldTxt}>{item?.amount / 100}رس</Text>
            </Text>
            <View style={{
                ...styles.orderStatusContainer,
                backgroundColor: item.orderStatus === 'DELEIVERD' ? "green" : "#faefe3",
            }}>
                <Text style={{
                    ...styles.orderStatus,
                    color: item.orderStatus === 'DELEIVERD' ? "#fff" : "#55a8b9",
                }}>
                    {status[item.orderStatus]}</Text>
            </View>
        </View>
        {item.purchaseBulk.map((purchaseItem, index) => {
            return <View style={styles.orderInfo} key={index}>
                <Image
                    style={styles.image}
                    source={{ uri: `${config.assetsUrl}/${purchaseItem?.image}` }}
                />
                <View style={styles.infoContainer}>
                    <Text style={{ fontSize: 16, }}>{purchaseItem.name}</Text>
                    <Text style={styles.orderInfo}>{OrderItemLocal['ar'].qty} : <Text style={styles.boldTxt}>{purchaseItem.quantity}</Text></Text>
                    <Text style={styles.orderInfo}>{OrderItemLocal['ar'].price} : <Text style={styles.boldTxt}>{purchaseItem.price}رس</Text></Text>
                    <Text style={styles.orderInfo}>{OrderItemLocal['ar'].shipping} : <Text style={styles.boldTxt}>{item.ShippingType}</Text></Text>
                    <Text style={styles.orderInfo}>{OrderItemLocal['ar'].reciverName}  : <Text style={styles.boldTxt}>
                        {purchaseItem?.formInfo?.sentTo || item.ShippingInfo?.name || user?.name || user?.email || ""}</Text></Text>
                    <Text style={styles.orderInfo}>{OrderItemLocal['ar'].address} : <Text style={styles.boldTxt}> {purchaseItem?.formInfo?.address ||
                        "لم يتم تحديد العنوان (سيقوم الدعم بالتواصل مع المستلم)"}</Text></Text>
                    <View style={styles.extra}><Text> التوصيل
                        ( + 0.00 ر.س )</Text></View>
                    <View style={styles.extra}><Text>
                        وسيلة الدفع : <Text style={{ fontWeight: "bold" }}>{item.source}</Text>
                    </Text></View>
                    {purchaseItem.formInfo?.cardText.length > 0 ? <View style={styles.extra}><Text> {OrderItemLocal['ar'].cardText}
                        <Text style={styles.boldTxt}>( + 6.00 ر.س )</Text></Text></View> : null}
                    {purchaseItem?.selectedCard?.price ? <View style={styles.extra}><Text> {OrderItemLocal['ar'].adds}
                        <Text style={styles.boldTxt}>( + {purchaseItem?.selectedCard?.price} ر.س )</Text></Text></View> : null}
                </View>
            </View>
        })}
        {isModalVisible && <ReviewModal isModalVisible={isModalVisible} toggleModal={toggleModal} id={item.purchaseBulk[0]?.id} />}
    </View>
}

export default OrderItem

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
        fontFamily: "CairoMed",
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
    orderInfo: {
        textAlign: "right",
        fontFamily: "CairoMed",
        fontSize: 11
    },
    boldTxt: {
        fontFamily: "CairoBold"
    },
    midTxt: {
        marginTop: 10,
        fontFamily: "CairoMed"
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        flexShrink: 1
    },
    orderStatus: {
        fontFamily: "CairoBold",
        fontSize: 15,
        textAlign: "center"
    },
    orderStatusContainer: {
        width: 150, height: 48,
        justifyContent: "center",
        borderRadius: 11,
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        borderRadius: 8
    },
    rateText: {
        color: "#5C71E5",
        fontFamily: "CairoMed"
    },
    screenContainer: {
        marginVertical: 10,
        minHeight: 300,
        borderBottomColor: "#F0F0F0",
        borderWidth: 2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    }
});
