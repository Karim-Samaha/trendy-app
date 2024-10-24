import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { config } from "../screens/config";
import { useContext, useState } from "react";
import ReviewModal from "./ReviewModal";
import { currency, OrderItemLocal } from "../constants/Locales";
import { LanguageContext } from "../context/langContext";
import { textAlign } from "../Utils/align";
import { removeArabicChars, renderEnglishName } from "../Utils/renderEnglishName";
const OrderItem = ({ item, user }) => {
  const { lang } = useContext(LanguageContext)
  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const toggleModal = () => {
    setModalVisible(false);
    console.log("!!!!!!!!!!!!!!!!!!");
  };
  const status = {
    PROCCESSING: lang === "en" ? "Processing" : "قيد التنفيذ",
    WORKING_ON_IT: lang === "en" ? "Working on it" : "جاري التجهيز",
    SCHEDULED: lang === "en" ? "Processing" : "قيد التنفيذ",
    ON_THE_WAY: lang === 'en' ? "On The Way" : "تم الشحن",
    DELEIVERD: lang === "en" ? "Delivered" : "تم التوصيل",
    RETURNED: lang === "en" ? "Returned" : "مسترجع",
    CANCELED: lang === "en" ? "Returned" : "مسترجع",
  };
  return (
    <View style={styles.screenContainer} key={item?._id}>
      <View style={styles.orderHeader}>
        <Text
          style={{
            fontFamily: "CairoMed",
            textAlign: textAlign(lang),
          }}
        >
          {OrderItemLocal[lang].refNum} :{" "}
          <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>{item?._id}</Text>
        </Text>
        <Pressable style={{ ...styles.rate, left: lang === "en" ? "90%" : 5 }} onPress={openModal}>
          <Text style={styles.rateText}>{OrderItemLocal[lang].rate}</Text>
        </Pressable>
        <Text style={{ ...styles.midTxt, textAlign: textAlign(lang) }}>
          {OrderItemLocal[lang].date} :{" "}
          <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>{item?.createdAt.split("T")[0]}</Text>
        </Text>
        <Text style={{ ...styles.midTxt, textAlign: textAlign(lang) }}>
          {OrderItemLocal[lang].price} :{" "}
          <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>{item?.amount / 100}{" "}{currency[lang]}</Text>
        </Text>
        <View
          style={{
            ...styles.orderStatusContainer,
            backgroundColor:
              item.orderStatus === "DELEIVERD" ? "green" : "#faefe3",
            marginLeft: lang === 'en' ? "auto" : 0
          }}
        >
          <Text
            style={{
              ...styles.orderStatus,
              color: item.orderStatus === "DELEIVERD" ? "#fff" : "#55a8b9",
            }}
          >
            {status[item.orderStatus]}
          </Text>
        </View>
      </View>
      {item.purchaseBulk.map((purchaseItem, index) => {
        return (
          <View style={styles.orderInfo} key={index}>
            <View style={{ ...styles.imageContainer, flexDirection: lang === 'en' ? "row" : "row-reverse" }}>
              <Image
                style={styles.image}
                source={{ uri: `${config.assetsUrl}/${purchaseItem?.image}` }}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: textAlign(lang),
                }}
              >
                {lang === "ar" ? purchaseItem.name : renderEnglishName(purchaseItem)}
              </Text>
              <Text style={{ ...styles.orderInfo, textAlign: textAlign(lang) }}>
                {OrderItemLocal[lang].qty} :{" "}
                <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>{purchaseItem.quantity}</Text>
              </Text>
              <Text style={{ ...styles.orderInfo, textAlign: textAlign(lang) }}>
                {OrderItemLocal[lang].price} :{" "}
                <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>{purchaseItem.price}{" "} {currency[lang]}</Text>
              </Text>
              <Text style={{ ...styles.orderInfo, textAlign: textAlign(lang) }}>
                {OrderItemLocal[lang].shipping} :{" "}
                <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>{lang === 'ar' ? item.ShippingType : removeArabicChars(item.ShippingType)}</Text>
              </Text>
              <Text style={{ ...styles.orderInfo, textAlign: textAlign(lang) }}>
                {OrderItemLocal[lang].reciverName} :{" "}
                <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>
                  {purchaseItem?.formInfo?.sentTo ||
                    item.ShippingInfo?.name ||
                    user?.name ||
                    user?.email ||
                    ""}
                </Text>
              </Text>
              <Text style={{ ...styles.orderInfo, textAlign: textAlign(lang) }}>
                {OrderItemLocal[lang].address} :{" "}
                <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>
                  {" "}
                  {purchaseItem?.formInfo?.address || lang === 'en' ? "No address were specified" :
                    "لم يتم تحديد العنوان (سيقوم الدعم بالتواصل مع المستلم)"}
                </Text>
              </Text>

              <View style={{ ...styles.extra, marginLeft: lang === 'en' ? "auto" : 0 }}>
                <Text> {OrderItemLocal[lang].delv} ( + 0.00 {currency[lang]})</Text>
              </View>
              <View style={{ ...styles.extra, marginLeft: lang === 'en' ? "auto" : 0 }}>
                <Text>
                  {OrderItemLocal[lang].method} :{" "}
                  <Text style={{ fontWeight: "bold" }}>{item.source}</Text>
                </Text>
              </View>
              {purchaseItem.formInfo?.cardText.length > 0 ? (
                <View style={{ ...styles.extra, marginLeft: lang === 'en' ? "auto" : 0 }}>
                  <Text>
                    {" "}
                    {OrderItemLocal[lang].cardText}
                    <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>( + 6.00 {currency[lang]} )</Text>
                  </Text>
                </View>
              ) : null}
              {purchaseItem?.selectedCard?.price ? (
                <View style={{ ...styles.extra, marginLeft: lang === 'en' ? "auto" : 0 }}>
                  <Text>
                    {" "}
                    {OrderItemLocal[lang].adds}
                    <Text style={{ ...styles.boldTxt, textAlign: textAlign(lang) }}>
                      ( + {purchaseItem?.selectedCard?.price} {currency[lang]} )
                    </Text>
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
      {isModalVisible && (
        <ReviewModal
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          id={item.purchaseBulk[0]?.id}
        />
      )}
    </View>
  );
};

export default OrderItem;

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
    position: "relative",
  },
  rate: {
    position: "absolute",
    top: 5,
    fontWeight: "bold",
  },
  orderInfo: {
    flexDirection: "row-reverse",
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
    fontSize: 11,
  },
  boldTxt: {
    fontFamily: "CairoBold",
  },
  midTxt: {
    marginTop: 10,
    fontFamily: "CairoMed",
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexShrink: 1,
  },
  orderStatus: {
    fontFamily: "CairoBold",
    fontSize: 15,
    textAlign: "center",
  },
  orderStatusContainer: {
    width: 150,
    height: 48,
    justifyContent: "center",
    borderRadius: 11,
  },
  imageContainer: {
    width: "100%",
    paddingVertical: 10,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    borderRadius: 8,
  },
  rateText: {
    color: "#5C71E5",
    fontFamily: "CairoMed",
  },
  screenContainer: {
    marginVertical: 10,
    minHeight: 300,
    borderBottomColor: "#F0F0F0",
    borderWidth: 2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,

  },
});
