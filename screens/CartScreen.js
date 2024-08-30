import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
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
import PaymentDialog from "../components/CheckoutModal";
import { adjustNames, getUser, renderTotalPrice_ } from "../Utils/helpers";
import _axios from "../Utils/axios";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StoreDeleiverForm from "../components/StoreDeleiverForm";
import { CartLocales } from "../constants/Locales";
const CartScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  const [checkoutModal, setCheckoutModal] = useState(false)
  const [coupon, setCoupon] = useState("");
  const [couponResponse, setCouponResponse] = useState({});
  const [selectedOption, setSelectedOption] = useState('1');
  const [user, setUser] = useState();
  const [storeDeleviryData, setStoreDeleviryData] = useState({
    name: "",
    phone: "",
    deliveryDate: "",
    valid: false,
  });
  const getUserDataFun = async () => {
    const userData = await getUser()
    setUser(userData)
  }
  const renderTotalPrice = renderTotalPrice_(cart, couponResponse?.precent);
  const dispatch = useDispatch();
  const increaseQuantity = (item) => {
    dispatch(incementQuantity(item));
  };
  const decreaseQuantity = (item) => {
    dispatch(decrementQuantity(item));
  };
  const deleteItem = (item) => {
    dispatch(removeFromCart(item));
  };
  const navigation = useNavigation();
  const validateCoupon = async () => {
    const user = await getUser()
    const renderTotalPrice = renderTotalPrice_(cart, null);
    await _axios
      .post(
        `${config.backendUrl}/coupon-redeem`,
        {
          code: coupon.trim(),
          amount: +renderTotalPrice.fintalTotal,
        },
        { user }
      )
      .then((res) => {
        console.log({ res })
        setCouponResponse({ ...res.data, code: coupon.trim() });
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getUserDataFun()
  }, [])
  const options = [
    { id: '1', text: 'من خلال Trendy Rose داخل الرياض' },
    { id: '2', text: 'من خلال Bosta خارج الرياض' },
    { id: '3', text: 'استلام من المتجر' },
  ];
  if (cart.length === 0) {
    return (
      <ScrollView style={styles.screenScrollView}>
        <View
          style={styles.noProductsContainer}>
          <Text style={{ fontSize: 18, marginBottom: 30, fontFamily: "CairoBold" }}
          >
            {CartLocales['ar'].noProducts}
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Home")}
            style={styles.homeBtn}
          >
            <View>
              <Text style={styles.homeBtnText}>
                {CartLocales['ar'].shopping}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    )
  }
  return (
    <ScrollView style={styles.cartScrollView}>
      <View style={{ marginHorizontal: 10 }}>
        {cart?.map((item, index) => (
          <View
            style={styles.cartProductContainer}
            key={index}
          >
            <Pressable
              style={styles.singleProductContainer}
            >

              <View style={{ width: "40%" }} >
                <Image
                  style={styles.productImg}
                  source={{ uri: `${config.assetsUrl}/${item?.item?.image}` }}
                />
              </View>
              <View style={{ marginRight: "5%", width: "50%" }} >
                <Text numberOfLines={3} style={styles.productNameText}>
                  {item?.item?.name}
                </Text>

                <Text style={styles.productPrice}>
                  {item?.price}رس
                </Text>
                {item?.selectedCard.length > 0 ? item?.selectedCard.map((add) => {
                  return <View style={styles.productAddsContainer} key={item?._id}>
                    <Text style={styles.extraPurchaseHeader}>اضافات الورود</Text>
                    <Text style={styles.productAddText}>
                      {adjustNames(add?.name)}
                    </Text>
                    <Text style={{ ...styles.productAddText, fontFamily: "CairoBold" }}>

                      {add.price} رس
                    </Text>
                  </View>
                }) : null}
              </View>
            </Pressable>
            <Pressable
              style={styles.itemPressable}
            >
              <View
                style={styles.itemView}
              >
                <Pressable
                  onPress={() => increaseQuantity(item)}
                  style={styles.increase}
                >
                  <Feather name="plus" size={24} color="#fff" />
                </Pressable>
                <Pressable
                  style={styles.whitePress}
                >
                  <Text style={styles.qty}>{item?.quantity}</Text>
                </Pressable>
                {item?.quantity > 1 ? (
                  <Pressable
                    onPress={() => decreaseQuantity(item)}
                    style={styles.decrease}
                  >
                    <AntDesign name="minus" size={24} color="#fff" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => deleteItem(item)}
                    style={styles.delete}
                  >
                    <AntDesign name="delete" size={24} color="red" />
                  </Pressable>
                )}
              </View>
              <Pressable
                onPress={() => deleteItem(item)}
                style={styles.secDelete}
              >
                <Text style={styles.deleteTxt}>
                  {CartLocales['ar'].delete}
                </Text>
              </Pressable>
            </Pressable>
          </View>
        ))}
      </View>
      <View style={styles.container}>

        {couponResponse?.redeemed ?
          <View style={styles.couponHeader}>
            <Feather name="check-circle" size={24} color="green" style={{ marginTop: 12 }} />
            <Text style={styles.couponSuccess}>{CartLocales['ar'].couponActivated} {couponResponse?.precent}%</Text>
          </View> : <>
            <Text style={styles.label}>{CartLocales['ar'].couponTitle}</Text>
            <View style={styles.inputContainer}>
              <Pressable style={styles.button} onPress={validateCoupon}>
                <Text style={styles.buttonText}>تفعيل</Text>
              </Pressable>
              <TextInput style={styles.input} placeholder={CartLocales['ar'].couponPlaceHolder} value={coupon} onChangeText={(e) => setCoupon(e)} />
            </View>
            {couponResponse?.valid === false &&
              !couponResponse?.minimumAmount ?
              <View style={styles.couponHeader}>
                <MaterialIcons name="error-outline" size={24} color="red" style={{ marginTop: 12 }} />
                <Text style={styles.couponErr}>{CartLocales['ar'].wrongCoupon}</Text>
              </View>
              : couponResponse?.valid === false &&
                couponResponse?.minimumAmount ?
                <View style={{ alignItems: "center", flexDirection: "row-reverse" }}>
                  <MaterialIcons name="error-outline" size={24} color="red" style={{ marginTop: 12 }} />
                  <Text style={styles.couponErr}>{CartLocales['ar'].minimumAmount}{" "}
                    {couponResponse?.minimumAmount} رس</Text>
                </View>
                : null}

          </>}
      </View>
      <View style={styles.cartInfoRow}>
        <Text style={styles.lightBoldTxt}>{CartLocales['ar'].totalNoVat} : </Text>
        <Text style={styles.boldTxt}>{renderTotalPrice.totalBeforeVat} رس</Text>
      </View>
      {couponResponse?.precent &&
        <View style={styles.cartInfoRow}>
          <Text style={styles.lightBoldTxt}>{CartLocales['ar'].discount} {couponResponse.precent}% : </Text>
          <Text style={styles.boldTxt}>{renderTotalPrice.deductedAmount} رس</Text>
        </View>
      }
      <View style={styles.cartInfoRow}>
        <Text style={styles.seclightBoldTxt}>{CartLocales['ar'].totalToApplyVat} : </Text>
        <Text style={styles.secboldTxt}>{renderTotalPrice.totalBeforeVat} رس</Text>
      </View>
      <View style={styles.cartInfoRow}>
        <Text style={styles.seclightBoldTxt}>{CartLocales['ar'].vatText} (15%) : </Text>
        <Text style={styles.secboldTxt}>{renderTotalPrice.vat} رس</Text>
      </View>
      <View style={styles.cartInfoRow}>
        <Text style={styles.seclightBoldTxt}>{CartLocales['ar'].shippingCost} : </Text>
        <Text style={styles.secboldTxt}>0 رس</Text>
      </View>
      <View style={styles.cartInfoRow}>
        <Text style={styles.seclightBoldTxt}>{CartLocales['ar'].totalPlusVat}  : </Text>
        <Text style={styles.secboldTxt}>{renderTotalPrice.fintalTotal} رس</Text>
      </View>
      <View style={styles.cartInfoRow}>
        <Text style={styles.seclightBoldTxt}>{CartLocales['ar'].total}  : </Text>
        <Text style={styles.secboldTxt}>{renderTotalPrice.fintalTotal} رس</Text>
      </View>
      {checkoutModal && <PaymentDialog show={true}
        close={() => setCheckoutModal(false)}
        amount={renderTotalPrice.fintalTotal}
        vat={renderTotalPrice.vat}
        couponResponse={couponResponse}
        ShippingType={options.find((item) => item.id === selectedOption)?.text}
        ShippingInfo={storeDeleviryData}
      />}

      <View style={styles.shippingContainer}>
        <Text style={styles.header}>{CartLocales['ar'].shippingHeader} </Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selectedOption === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(option.id)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option.id && styles.selectedOptionText,
              ]}
            >
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
        {selectedOption === '3' && <StoreDeleiverForm storeDeleviryData={storeDeleviryData} setStoreDeleviryData={setStoreDeleviryData} />}
      </View>
      {user ?
        (selectedOption !== '3' || selectedOption === '3' && storeDeleviryData.valid) &&
        <Pressable
          // onPress={() => navigation.navigate("Confirm")}
          style={styles.checkoutBtn}
          onPress={() => setCheckoutModal(true)}
        >
          <Text style={styles.checkoutBtnTxt}>{CartLocales['ar'].completePayment} </Text>
        </Pressable> : <Pressable
          // onPress={() => navigation.navigate("Confirm")}
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate("Profile", {
            callbackScreen: 'Cart'
          })}
        >
          <Text style={{
            ...styles.checkoutBtnTxt, fontSize: 13
          }}>{CartLocales['ar'].loginForPayment} </Text>
        </Pressable>}

      <Text
        style={styles.selTxt}
      />

    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  cartProductContainer: {
    backgroundColor: "white",
    marginVertical: 10,
    borderBottomColor: "#F0F0F0",
    borderWidth: 2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  singleProductContainer: {
    marginVertical: 10,
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  productImg: {
    width: '100%',
    height: 140,
    resizeMode: "contain",
    borderRadius: 10
  },
  productPrice: {
    fontSize: 17,
    fontWeight: "bold",
    padding: 0, marginTop: 6,
    borderWidth: 1,
    borderColor: "#55a8b9",
    textAlign: "center",
    color: "#55a8b9",
    borderRadius: 10,
    fontFamily: "CairoMed"
  },
  label: {
    textAlign: 'right', // Align text to the right
    marginBottom: 8,
    fontSize: 13,
    fontFamily: "CairoBold",
    color: '#333', // Adjust color as needed
  },
  inputContainer: {
    flexDirection: 'row', // Ensure the button is on the right
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#55a8b9',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: "CairoBold"
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontFamily: "CairoMed",
    textAlign: 'right', // Ensure text input is RTL
  },
  couponSuccess: {
    color: "green",
    textAlign: "right",
    fontFamily: "CairoBold",
    fontSize: 14,
    marginTop: 10,
    marginHorizontal: 8
  },
  couponErr: {
    color: "red",
    textAlign: "right",
    fontFamily: "CairoBold",
    fontSize: 14,
    marginTop: 10,
    marginHorizontal: 8
  },
  shippingContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  header: {
    marginBottom: 16,
    fontSize: 14,
    fontFamily: "CairoBold",
    textAlign: 'right',
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: '#26a69a',
  },
  optionText: {
    textAlign: 'right',
    fontSize: 14,
    fontFamily: "CairoMed",
  },
  selectedOptionText: {
    color: '#26a69a',
    fontFamily: "CairoBold",
  },
  productAddsContainer: {
    fontWeight: "bold",
    padding: 0, marginTop: 6,
    borderWidth: 1,
    borderColor: "#55a8b9",
    backgroundColor: "#f8fafc",
    textAlign: "center",
    color: "#55a8b9",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  productAddText: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "CairoMed"
  },
  cartInfoRow: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    flexDirection: "row-reverse"
  },
  screenScrollView: {
    marginTop: 0,
    flex: 1,
    backgroundColor: "white"
  },
  noProductsContainer: {
    justifyContent: "center",
    width: "100%",
    height: 600,
    justifyContent: "center",
    alignItems: "center",
  },
  homeBtn: {
    backgroundColor: "#55a8b9",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    width: "60%",
  },
  homeBtnText: {
    color: "#fff",
    fontFamily: "CairoMed"
  },
  cartScrollView: {
    marginTop: 0,
    flex: 1,
    backgroundColor: "white"
  },
  productNameText: {
    textAlign: "right",
    fontFamily: "CairoBold",
    fontSize: 11
  },
  extraPurchaseHeader: {
    fontFamily: "CairoBold",
    fontSize: 11
  },
  itemPressable: {
    marginTop: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
  },
  increase: {
    backgroundColor: "#55a8b9",
    padding: 7,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  whitePress: {
    backgroundColor: "white",
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  qty: {
    fontFamily: "CairoBold",
    marginBottom: 5
  },
  decrease: {
    backgroundColor: "#55a8b9",
    padding: 7,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  delete: {
    backgroundColor: "#D8D8D8",
    padding: 7,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  secDelete: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "#C0C0C0",
    borderWidth: 0.6,
  },
  deleteTxt: {
    fontFamily: "CairoMed",
    fontSize: 12
  },
  couponHeader: {
    alignItems: "center",
    flexDirection: "row-reverse"
  },
  boldTxt: {
    fontSize: 16,
    fontWeight: "bold"
  },
  lightBoldTxt: {
    fontSize: 14,
    fontFamily: "CairoMed"
  },
  secboldTxt: {
    fontSize: 14,
    fontFamily: "CairoBold"
  },
  seclightBoldTxt: {
    fontSize: 14,
    fontFamily: "CairoMed"
  },
  checkoutBtn: {
    backgroundColor: "#55a8b9",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  checkoutBtnTxt: {
    color: "#fff",
    fontFamily: "CairoMed"
  },
  selTxt: {
    height: 1,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 16,
  }
});
