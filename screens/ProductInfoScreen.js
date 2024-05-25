import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import AddToCartForm from "../components/AddToCartForm";
import { handleLogout } from "../redux/userReducer";

const ProductInfoScreen = () => {
  const route = useRoute();
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const height = (width * 100) / 100;
  const dispatch = useDispatch();
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };
  const cart = useSelector((state) => state.cart.cart);
  const [formType, setFormType] = useState("")

  return (
    <ScrollView
      style={{ marginTop: 10, flex: 1, backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >


      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {route.params.carouselImages.map((item, index) => (
          <ImageBackground
            style={{ width, height, marginTop: 25, resizeMode: "contain" }}
            source={{ uri: "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg" }}
            key={index}
          >
            <View
              style={{
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#C60C30",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: 12,
                  }}
                >
                  20% خصم
                </Text>
              </View>

              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E0E0E0",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={24}
                  color="black"
                />
              </View>
            </View>

            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#E0E0E0",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "auto",
                marginLeft: 20,
                marginBottom: 20,
              }}
            >
              <AntDesign name="hearto" size={24} color="black" />
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>
          {route?.params?.title}
        </Text>

        <View>
          <Text style={{ fontWeight: "bold", fontSize: 11, }}>سعر قبل الخصم : <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{route?.params.oldPrice}</Text></Text>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>السعر : {route?.params.price}</Text>
        </View>
      </View>

      <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

      {/* <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Text>Color: </Text>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {route?.params?.color}
        </Text>
      </View> */}

      {/* <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Text>Size: </Text>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {route?.params?.size}
        </Text>
      </View> */}

      {/* <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} /> */}

      <View style={{ padding: 10 }}>
        {/* <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
          Total : ₹{route.params.price}
        </Text> */}
        <Text style={{ color: "#00CED1" }}>
          شحن مجاني داخل الرياض
        </Text>

      </View>



      {formType !== "NORMAL" && <Pressable
        // onPress={() => addItemToCart(route?.params?.item)}
        onPress={() => setFormType("NORMAL")}
        style={{
          backgroundColor: "#55a8b9",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <View>
          <Text style={{ color: "#fff" }}>اضف الي السلة</Text>
        </View>
      </Pressable>}

      {formType !== "GIFT" && <Pressable
        onPress={() => setFormType("GIFT")}

        style={{
          backgroundColor: "#55a8b9",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "#fff" }}>شراء كهديه</Text>
      </Pressable>}
      {formType && <AddToCartForm formType={formType} />}
    </ScrollView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({});
