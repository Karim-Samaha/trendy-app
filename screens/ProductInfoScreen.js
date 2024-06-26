import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  I18nManager
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import AddToCartForm from "../components/AddToCartForm";
import { config } from "./config";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getUser } from "../Utils/helpers";
import _axios from "../Utils/axios";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from "axios";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ProductInfoScreen = () => {

  const route = useRoute();
  const { width } = Dimensions.get("window");
  const height = (width * 100) / 100;
  const [formType, setFormType] = useState("")
  const [addedToFav, setAddedToFav] = useState(false);
  const [reviews, setReviews] = useState(null);
  const reviewRef = useRef();
  const scrollToEnd = () => {
    reviewRef.current?.scrollToEnd({ animated: false });
  };
  const handleFav = async () => {
    const user = await getUser();
    _axios
      .post(
        `${config.backendUrl}/favorite/${route.params.item?._id}`,
        { type: addedToFav ? "remove" : "add" },
        { user }
      )
      .then((res) => setAddedToFav(!addedToFav))
      .catch((err) => console.log(err));
  }
  const getFav = async () => {
    const user = await getUser();
    _axios
      .post(
        `${config.backendUrl}/favorite?id=true`,
        {},
        //@ts-ignore
        { user }
      )
      .then((res) => {
        if (res.data.data.includes(route.params.item?._id)) {
          setAddedToFav(true)
        }
      })
      .catch((err) => console.log(err));
  }
  const getReview = async () => {
    axios
      .get(`${config.backendUrl}/reviews/${route.params.item?._id}`)
      .then((res) => setReviews(res.data.data))
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    getFav()
    getReview()
  }, [])
  return (
    <ScrollView
      style={{ marginTop: 0, flex: 1, backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ImageBackground
          style={{ width, height, marginTop: 0, resizeMode: "contain" }}
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

            {route.params.item?.priceBefore &&
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: "#55a8b9",
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
                  {(100 - (route.params.item?.price / route.params.item?.priceBefore) * 100).toFixed(0)}% خصم
                </Text>
              </View>
            }

            <Pressable
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
            </Pressable>
          </View>

          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: addedToFav ? "red" : "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginTop: "auto",
              marginLeft: 20,
              marginBottom: 20,
            }}
            onPress={handleFav}
          >
            <AntDesign name="hearto" size={24} color={addedToFav ? '#fff' : "black"} />
          </Pressable>
        </ImageBackground>
      </ScrollView>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>
          {route?.params?.title}
        </Text>

        <View>
          {route?.params?.item?.priceBefore &&
            <Text style={{ fontWeight: "bold", fontSize: 16, marginVertical: 8 }}>
              سعر قبل الخصم :
              <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: "red" }}>
                {route?.params.item.priceBefore} رس
              </Text>
            </Text>
          }
          <View style={{ flexDirection: 'row-reverse', alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>السعر :</Text>
            <View style={{
              borderWidth: 2, borderColor: "#55a8b9", paddingVertical: 5, paddingHorizontal: 15,
              marginHorizontal: 10, borderRadius: 10
            }}>
              <Text style={{ fontWeight: "bold", color: "#55a8b9" }}>{route?.params.price} رس</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />
      <View style={{ ...styles.feature, backgroundColor: "#FDF2F2" }}>
        <FontAwesome5 name="shipping-fast" size={24} color="black" />
        <Text style={{ color: "#000", marginHorizontal: 10 }}>
          شحن مجاني داخل الرياض
        </Text>
      </View>
      <View style={{ ...styles.feature, backgroundColor: "#F0F9FF" }}>
        <Entypo name="address" size={24} color="black" />
        <Text style={{ color: "#000", marginHorizontal: 10 }}>
          لست بحاجة لمعرفة العنوان
          (فريقنا سيفعل ذلك نيابة عنك)
        </Text>
      </View>
      <View style={{ ...styles.feature, backgroundColor: "#EFFBF4" }}>
        <AntDesign name="earth" size={24} color="black" />
        <Text style={{ color: "#000", marginHorizontal: 10 }}>
          أجود أنواع الزهور
        </Text>
      </View>
      <View style={{ ...styles.feature, backgroundColor: "#FFFBEB" }}>
        <FontAwesome6 name="money-bill-transfer" size={24} color="black" />
        <Text style={{ color: "#000", marginHorizontal: 10 }}>
          اشتري الان و اربح نقاط ترندي
        </Text>
      </View>

      {formType !== "NORMAL_ORDER" && <Pressable
        // onPress={() => addItemToCart(route?.params?.item)}
        onPress={() => setFormType("NORMAL_ORDER")}
        style={styles.mainBtn}
      >
        <View>
          <Text style={{ color: "#fff" }}>اضف الي السلة</Text>
        </View>
      </Pressable>}

      {formType !== "GIFT" && <Pressable
        onPress={() => setFormType("GIFT")}

        style={styles.mainBtn}
      >
        <Text style={{ color: "#fff" }}>شراء كهديه</Text>
      </Pressable>}
      {formType && <AddToCartForm formType={formType} product={route.params} />}
      <View style={styles.descHeader}>
        <FontAwesome5 name="info-circle" size={24} color="silver" style={{ marginHorizontal: 10 }} />
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>عن المنتج:</Text>
      </View>
      <View style={styles.descContent}>
        <Text style={{ fontSize: 15 }}>{route.params.item?.description}</Text>
      </View>
      {reviews && reviews.length > 0 ?
        <View style={{
          backgroundColor: "#55a8b9",
          marginTop: 10
        }}>
          <View style={styles.revHeader}>
            <MaterialIcons name="reviews" size={24} color="gold" style={{ marginHorizontal: 10 }} />
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>تقيمات عملائنا:</Text>
          </View>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10
          }}>
            <ScrollView horizontal inverted showsHorizontalScrollIndicator={false} contentContainerStyle={{
              flexDirection: "row-reverse",
            }}
              ref={reviewRef}
              onContentSizeChange={scrollToEnd}
            >
              {reviews.map((item) => {
                return <View key={item?._id} style={styles.reviewsItem}>
                  <FontAwesome name="user" size={24} color="#55a8b9" />
                  <Text>
                    {item?.name}
                  </Text>
                  <Text style={{ fontWeight: "bold", marginVertical: 10 }}>
                    {item?.productReview}
                  </Text>
                </View>
              })}
            </ScrollView>
          </View>

        </View>
        : reviews && reviews.length === 0 ? <>
          <View style={styles.revHeader}>
            <MaterialIcons name="reviews" size={24} color="gold" style={{ marginHorizontal: 10 }} />
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>تقيمات عملائنا:</Text>
          </View>
          <View style={styles.reviewContent}>
            <Text style={{ fontSize: 15, color: "#55A8B9", textAlign: "center", marginVertical: 20, fontWeight: "bold" }}>لا يوجد تقييمات حتى اللحظة</Text>
          </View>
        </> : null}

    </ScrollView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({
  mainBtn: {
    backgroundColor: "#55a8b9",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  descHeader: {
    flexDirection: "row-reverse",
    marginTop: 10
  },
  revHeader: {
    flexDirection: "row-reverse",
    marginTop: 10
  },
  descContent: {
    marginHorizontal: 13,
    marginTop: 10
  },
  feature: {
    padding: 10,
    marginHorizontal: 10,
    flexDirection: 'row-reverse',
    marginTop: 10,
    borderRadius: 10
  },
  reviewsItem: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginEnd: 10,
    borderRadius: 10
  }
}); 
