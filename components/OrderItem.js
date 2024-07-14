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
            <Text style={{ fontFamily: "CairoMed" }}>
                الرقم المرجعي : <Text style={{ fontFamily: "CairoBold" }}>{item?._id}</Text>
            </Text>
            <Pressable style={styles.rate} onPress={openModal}>
                <Text style={{
                    color: "#5C71E5",
                    fontFamily: "CairoMed"
                }}>تقيم</Text>
            </Pressable>
            <Text style={{ marginTop: 10, fontFamily: "CairoMed" }}>
                التاريخ : <Text style={{ fontFamily: "CairoBold" }}>{item?.createdAt.split("T")[0]}</Text>
            </Text>
            <Text style={{ marginTop: 10, fontFamily: "CairoMed" }}>
                السعر : <Text style={{ fontFamily: "CairoBold" }}>{item?.amount / 100}رس</Text>
            </Text>
            <View style={{
                width: 150, height: 48, backgroundColor: item.orderStatus === 'DELEIVERD' ? "green" : "#faefe3",
                justifyContent: "center",
                borderRadius: 11
            }}>
                <Text style={{
                    fontFamily: "CairoBold",
                    fontSize: 15,
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
                    <Text style={{ textAlign: "right", fontFamily: "CairoMed", fontSize: 11 }}>الكمية : <Text style={{ fontFamily: "CairoBold" }}>{purchaseItem.quantity}</Text></Text>
                    <Text style={{ textAlign: "right", fontFamily: "CairoMed", fontSize: 11 }}>السعر : <Text style={{ fontFamily: "CairoBold" }}>{purchaseItem.price}رس</Text></Text>
                    <Text style={{ textAlign: "right", fontFamily: "CairoMed", fontSize: 11 }}>طريقة الشحن : <Text style={{ fontFamily: "CairoBold" }}>{item.ShippingType}</Text></Text>
                    <Text style={{ textAlign: "right", fontFamily: "CairoMed", fontSize: 11 }}>بيانات المستلم  : <Text style={{ fontFamily: "CairoBold" }}>
                        {purchaseItem?.formInfo?.sentTo || item.ShippingInfo?.name || user?.name || user?.email || ""}</Text></Text>
                    <Text style={{ textAlign: "right", fontFamily: "CairoMed", fontSize: 11 }}>عنوان الشحن : <Text style={{ fontFamily: "CairoBold" }}> {purchaseItem?.formInfo?.address ||
                        "لم يتم تحديد العنوان (سيقوم الدعم بالتواصل مع المستلم)"}</Text></Text>
                    <View style={styles.extra}><Text> التوصيل
                        ( + 0.00 ر.س )</Text></View>
                    <View style={styles.extra}><Text>
                        وسيلة الدفع : <Text style={{ fontWeight: "bold" }}>{item.source}</Text>
                    </Text></View>
                    {purchaseItem.formInfo?.cardText.length > 0 ? <View style={styles.extra}><Text> نص بطاقة
                        <Text style={{ fontFamily: "CairoBold" }}>( + 6.00 ر.س )</Text></Text></View> : null}
                    {purchaseItem?.selectedCard?.price ? <View style={styles.extra}><Text> اضافات الورود
                        <Text style={{ fontFamily: "CairoBold" }}>( + {purchaseItem?.selectedCard?.price} ر.س )</Text></Text></View> : null}
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
});
