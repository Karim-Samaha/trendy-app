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
import { config } from "./config";

const ProductInfoScreen = () => {
  const route = useRoute();
  const { width } = Dimensions.get("window");
  const height = (width * 100) / 100;

  const [formType, setFormType] = useState("")

  return (
    <ScrollView
      style={{ marginTop: 10, flex: 1, backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >


      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ImageBackground
          style={{ width, height, marginTop: 25, resizeMode: "contain" }}
          source={{ uri: `${config.assetsUrl}/${route.params.item.image}` }}
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
      </ScrollView>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>
          {route?.params?.title}
        </Text>

        <View>
          <Text style={{ fontWeight: "bold", fontSize: 11, marginVertical: 8 }}>سعر قبل الخصم : <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: "red" }}>{route?.params.item.priceBefore}</Text></Text>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>السعر : {route?.params.price}</Text>
        </View>
      </View>
      <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />
      <View style={{ padding: 10 }}>
        <Text style={{ color: "#00CED1" }}>
          شحن مجاني داخل الرياض
        </Text>
      </View>



      {formType !== "NORMAL_ORDER" && <Pressable
        // onPress={() => addItemToCart(route?.params?.item)}
        onPress={() => setFormType("NORMAL_ORDER")}
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
      {formType && <AddToCartForm formType={formType} product={route.params} />}
    </ScrollView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({});
