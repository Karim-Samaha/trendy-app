import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
  I18nManager
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { config } from "./config";
import PaymentDialog from "../components/CheckoutModal";
import { adjustNames, getUser, renderTotalPrice_ } from "../Utils/helpers";
import Search from "../components/Search";
import _axios from "../Utils/axios";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StoreDeleiverForm from "../components/StoreDeleiverForm";

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
  const route = useRoute();
  // useEffect(() => {
  //   setCheckoutModal(false)
  // }, [route])
  console.log({ checkoutModal })
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
  if (cart.length <= 0) {
    return (
      <ScrollView style={{ marginTop: 0, flex: 1, backgroundColor: "white" }}>
        <Search />
        <View
          style={{
            justifyContent: "center", width: "100%", height: 600,
            justifyContent: "center", alignItems: "center",
          }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 30 }}
          >لا يوجد منتجات في عربة التسوق
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Home")}
            style={{
              backgroundColor: "#55a8b9",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 10,
              width: "60%",
            }}
          >
            <View>
              <Text style={{ color: "#fff" }}>التسوق</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    )
  }
  return (
    <ScrollView style={{ marginTop: 0, flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>

        {couponResponse?.redeemed ?
          <View style={{ alignItems: "center", flexDirection: "row-reverse" }}>
            <Feather name="check-circle" size={24} color="green" style={{ marginTop: 12 }} />
            <Text style={styles.couponSuccess}>تم تفيعل كوبون خصم {couponResponse?.precent}%</Text>
          </View> : <>
            <Text style={styles.label}>هل لديك كوبون خصم؟</Text>
            <View style={styles.inputContainer}>
              <Pressable style={styles.button} onPress={validateCoupon}>
                <Text style={styles.buttonText}>تفعيل</Text>
              </Pressable>
              <TextInput style={styles.input} placeholder="كوبون خصم" value={coupon} onChangeText={(e) => setCoupon(e)} />
            </View>
            {couponResponse?.valid === false &&
              !couponResponse?.minimumAmount ?
              <View style={{ alignItems: "center", flexDirection: "row-reverse" }}>
                <MaterialIcons name="error-outline" size={24} color="red" style={{ marginTop: 12 }} />
                <Text style={styles.couponErr}>الكود خاطئ</Text>
              </View>
              : couponResponse?.valid === false &&
                couponResponse?.minimumAmount ?
                <View style={{ alignItems: "center", flexDirection: "row-reverse" }}>
                  <MaterialIcons name="error-outline" size={24} color="red" style={{ marginTop: 12 }} />
                  <Text style={styles.couponErr}>الحد الادني لاستخدام الكوبون{" "}
                    {couponResponse?.minimumAmount} رس</Text>
                </View>
                : null}

          </>}
      </View>
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center", flexDirection: "row-reverse" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>المجموع غير شامل الضريبة : </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{renderTotalPrice.total} رس</Text>
      </View>
      {couponResponse?.precent &&
        <View style={{ padding: 10, flexDirection: "row", alignItems: "center", flexDirection: "row-reverse" }}>
          <Text style={{ fontSize: 16, fontWeight: "400" }}>قسيمة التخفيض {couponResponse.precent}% : </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{renderTotalPrice.deductedAmount} رس</Text>
        </View>
      }
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center", flexDirection: "row-reverse" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>المجموع الخاضع للضريبة : </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{renderTotalPrice.amountToApplyVatInReceipt} رس</Text>
      </View>
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center", flexDirection: "row-reverse" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>ضريبة القيمة المضافة (15%) : </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{renderTotalPrice.vat} رس</Text>
      </View>
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center", flexDirection: "row-reverse" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>تكاليف الشحن : </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>0 رس</Text>
      </View>
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center", flexDirection: "row-reverse" }}>
        <Text style={{ fontSize: 14, fontWeight: "400" }}>مجموع المنتجات شامل ضريبة القيمة المضافة : </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{renderTotalPrice.fintalTotal} رس</Text>
      </View>
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center", flexDirection: "row-reverse" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>مجموع الكلي : </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{renderTotalPrice.fintalTotal} رس</Text>
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
        <Text style={styles.header}>اختيار شركة الشحن</Text>
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
          style={{
            backgroundColor: "#55a8b9",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
          onPress={() => setCheckoutModal(true)}
        >
          <Text style={{
            color: "#fff",
          }}>اتمام الدفع</Text>
        </Pressable> : <Pressable
          // onPress={() => navigation.navigate("Confirm")}
          style={{
            backgroundColor: "#55a8b9",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
          onPress={() => navigation.navigate("Profile", {
            callbackScreen: 'Cart'
          })}
        >
          <Text style={{
            color: "#fff",
          }}>تسجيل الدخول لاتمام الدفع</Text>
        </Pressable>}

      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
          marginTop: 16,
        }}
      />

      <View style={{ marginHorizontal: 10 }}>
        {cart?.map((item, index) => (
          <View
            style={{
              backgroundColor: "white",
              marginVertical: 10,
              borderBottomColor: "#F0F0F0",
              borderWidth: 2,
              borderLeftWidth: 0,
              borderTopWidth: 0,
              borderRightWidth: 0,
            }}
            key={index}
          >
            <Pressable
              style={{
                marginVertical: 10,
                flexDirection: "row-reverse",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexWrap: "wrap"
              }}
            >

              <View >
                <Image
                  style={{ width: 140, height: 140, resizeMode: "contain", borderRadius: 10 }}
                  source={{ uri: `${config.assetsUrl}/${item?.item?.image}` }}
                />
              </View>
              <View style={{ marginRight: 20, width: 200 }} >
                <Text numberOfLines={3} style={{
                  marginTop: 10, fontWeight: "bold", textAlign: "right"

                }}>
                  {item?.item?.name}
                </Text>

                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    padding: 0, marginTop: 6,
                    borderWidth: 1,
                    borderColor: "#55a8b9",
                    textAlign: "center",
                    color: "#55a8b9",
                    borderRadius: 10
                  }}
                >
                  {item?.price}رس
                </Text>
                {item?.selectedCard.length > 0 ? item?.selectedCard.map((add) => {
                  return <View style={{
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
                    alignItems: "center"
                  }} key={item?._id}>
                    <Text style={{ fontWeight: "bold" }}>اضافات الورود</Text>
                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: "center",

                      }}
                    >
                      {adjustNames(add?.name)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: "center",
                        fontWeight: "bold"
                      }}
                    >
                      {add.price} رس
                    </Text>
                  </View>
                }) : null}


              </View>

            </Pressable>

            <Pressable
              style={{
                marginTop: 15,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 7,
                }}
              >
                {item?.quantity > 1 ? (
                  <Pressable
                    onPress={() => decreaseQuantity(item)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="minus" size={24} color="black" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => deleteItem(item)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="delete" size={24} color="black" />
                  </Pressable>
                )}

                <Pressable
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 18,
                    paddingVertical: 6,
                  }}
                >
                  <Text>{item?.quantity}</Text>
                </Pressable>

                <Pressable
                  onPress={() => increaseQuantity(item)}
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Feather name="plus" size={24} color="black" />
                </Pressable>
              </View>
              <Pressable
                onPress={() => deleteItem(item)}
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>مسح</Text>
              </Pressable>
            </Pressable>

            {/* <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 15,
              }}
            >
              <Pressable
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>اضف الي قائمتي</Text>
              </Pressable>

              <Pressable
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>منتجات مشابهة</Text>
              </Pressable>
            </Pressable> */}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    textAlign: 'right', // Align text to the right
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "bold",
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
    fontSize: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    textAlign: 'right', // Ensure text input is RTL
  },
  couponSuccess: {
    color: "green",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    marginHorizontal: 8
  },
  couponErr: {
    color: "red",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#26a69a',
    fontWeight: "bold"
  },

});
