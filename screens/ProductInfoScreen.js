import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  I18nManager,
  Share
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
import AddToCartMessage from "../components/AddToCartMessage";
import RenderHTML from "react-native-render-html";
import { ProductLocal, TrendyBenfLocal } from "../constants/Locales";

const ProductInfoScreen = () => {
  const tagsStyles = {
    ol: {
      direction: "rtl"
    },
    li: {
      direction: "rtl",
      textAlign: "right"


    },
    h2: {
      direction: "rtl",
      flexDirection: "row-reverse",
      fontSize: 15,
    },
    ul: {

      flexDirection: "row-reverse",
      flexWrap: 'wrap',
      listStyleType: 'none',

    },
    p: {
      flexDirection: "row-reverse",
      direction: "rtl",
      fontSize: 15,
    },
    span: {
      flexDirection: "row-reverse",
      textAlign: "right",
    },
    div: {
      flexDirection: "row-reverse",
      textAlign: "right",


    }


  };

  const route = useRoute();
  const { width } = Dimensions.get("window");
  const height = (width * 100) / 100;
  const [formType, setFormType] = useState("")
  const [addedToFav, setAddedToFav] = useState(false);
  const [reviews, setReviews] = useState(null);
  const reviewRef = useRef();
  const [addedToCart, setAddedToCart] = useState(false)
  const scrollToEnd = () => {
    reviewRef.current?.scrollToEnd({ animated: false });
  };
  const onShare = async () => {
    const link = `https://www.cadeaumoi.com/product-detail/${route.params.item?._id}/${route.params.item?.name}`
    try {
      const result = await Share.share({
        message: link,
        url: link, // Add your content URL here
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing content:', error.message);
    }
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
  useEffect(() => {
    if (addedToCart) {
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  }, [addedToCart])
  return (
    <View style={styles.screenContainer}>
      {addedToCart && <AddToCartMessage product={route.params} />}
      <ScrollView
        style={styles.mainScrollView}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ImageBackground
            style={{ ...styles.imageStyle, width, height }}
            source={{ uri: `${config.assetsUrl}/${route.params.item.image}` }}
          >
            <View
              style={styles.infoContainer}
            >

              {route.params.item?.priceBefore &&
                <View
                  style={styles.priceBeforeContainer}
                >
                  <Text
                    style={styles.priceBeforeText}
                  >
                    {(100 - (route.params.item?.price / route.params.item?.priceBefore) * 100).toFixed(0)}% {ProductLocal['ar'].discount}
                  </Text>
                </View>
              }

              <Pressable
                style={styles.share}
                onPress={onShare}
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
                ...styles.fav, backgroundColor: addedToFav ? "red" : "#E0E0E0",
              }}
              onPress={handleFav}
            >
              <AntDesign name="hearto" size={24} color={addedToFav ? '#fff' : "black"} />
            </Pressable>
          </ImageBackground>
        </ScrollView>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {route?.params?.title}
          </Text>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{route?.params.item?.name}</Text>
          </View>
          <View>
            {route?.params?.item?.priceBefore &&
              <Text style={styles.beforeText}>
                {ProductLocal['ar'].priceBefore} :
                <Text style={styles.beforeValue}>
                  {route?.params.item.priceBefore} رس
                </Text>
              </Text>
            }
            <View style={styles.priceContainerView}>
              <Text style={styles.priceText}>{ProductLocal['ar'].price} :</Text>
              <View style={styles.priceViewContainerTwo}>
                <Text style={styles.priceViewContainerTwoText}>{route?.params.price} رس</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.line} />
        <View style={{ ...styles.feature, backgroundColor: "#FDF2F2" }}>
          <FontAwesome5 name="shipping-fast" size={24} color="black" />
          <Text style={styles.infoText}>
            {TrendyBenfLocal['ar'].header1}
          </Text>
        </View>
        <View style={{ ...styles.feature, backgroundColor: "#F0F9FF" }}>
          <Entypo name="address" size={24} color="black" />
          <Text style={styles.infoText}>
            {TrendyBenfLocal['ar'].header2}
          </Text>
        </View>
        <View style={{ ...styles.feature, backgroundColor: "#EFFBF4" }}>
          <AntDesign name="earth" size={24} color="black" />
          <Text style={styles.infoText}>
            {TrendyBenfLocal['ar'].header3}
          </Text>
        </View>
        <View style={{ ...styles.feature, backgroundColor: "#FFFBEB" }}>
          <FontAwesome6 name="money-bill-transfer" size={24} color="black" />
          <Text style={styles.infoText}>
            {TrendyBenfLocal['ar'].header4}
          </Text>
        </View>
        <View style={styles.descHeader}>
          <FontAwesome5 name="info-circle" size={24} color="silver" style={{ marginHorizontal: 10 }} />
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>عن المنتج:</Text>
        </View>
        <View style={{ ...styles.descContent, }}>
          <RenderHTML contentWidth={"100%"} source={{ html: route.params.item?.description }} tagsStyles={tagsStyles}
          />
        </View>

        {formType !== "NORMAL_ORDER" && <Pressable
          // onPress={() => addItemToCart(route?.params?.item)}
          onPress={() => setFormType("NORMAL_ORDER")}
          style={styles.mainBtn}
        >
          <View>
            <Text style={styles.addToCartText}>{ProductLocal['ar'].addToCart}</Text>
          </View>
        </Pressable>}

        {formType !== "GIFT" && <Pressable
          onPress={() => setFormType("GIFT")}

          style={styles.mainBtn}
        >
          <Text style={styles.addToCartText}>{ProductLocal['ar'].butAsGift}</Text>
        </Pressable>}
        {formType && <AddToCartForm formType={formType} product={route.params} setAddedToCart={setAddedToCart} />}

        {reviews && reviews.length > 0 ?
          <View style={styles.revContainer}>
            <View style={styles.revHeader}>
              <MaterialIcons name="reviews" size={24} color="gold" style={{ marginHorizontal: 10 }} />
              <Text style={styles.revHeaderText}>{ProductLocal['ar'].ourRviews}:</Text>
            </View>
            <View style={styles.reviewsContainer}>
              <ScrollView horizontal inverted showsHorizontalScrollIndicator={false} contentContainerStyle={{
                flexDirection: "row-reverse",
              }}
                ref={reviewRef}
                onContentSizeChange={scrollToEnd}
              >
                {reviews.map((item) => {
                  return <View key={item?._id} style={styles.reviewsItem}>
                    <FontAwesome name="user" size={24} color="#55a8b9" />
                    <Text style={styles.reviewItemText}>
                      {item?.name}
                    </Text>
                    <Text style={{ ...styles.reviewItemText, marginVertical: 10 }}>
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
              <Text style={styles.ourReviewsText}>{ProductLocal['ar'].ourRviews}:</Text>
            </View>
            <View style={styles.reviewContent}>
              <Text style={styles.noReviewsText}>
                {ProductLocal['ar'].noReviews}
              </Text>
            </View>
          </> : null}
      </ScrollView>
    </View>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({
  screenContainer: {
    width: "100%",
    height: "100%"
  },
  mainScrollView: {
    marginTop: 0,
    flex: 1,
    backgroundColor: "white"
  },
  imageStyle: {

    marginTop: 0,
    resizeMode: "contain",
    backgroundColor: "#ccaa91"
  },
  infoContainer: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
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
    marginVertical: 10
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
  },
  priceBeforeContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#55a8b9",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  priceBeforeText: {
    color: "white",
    textAlign: "center",
    fontSize: 7,
    fontFamily: "CairoBold"
  },
  share: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  fav: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: "auto",
    marginLeft: 20,
    marginBottom: 20,
  },
  titleContainer: {
    padding: 10
  },
  title: {
    fontSize: 15,
    fontWeight: "500"
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    alignItems: "center",
    marginBottom: 10
  },
  nameText: {
    fontSize: 14,
    fontFamily: "CairoBold"
  },
  beforeText: {
    fontFamily: "CairoBold",
    fontSize: 13,
    marginVertical: 8
  },
  beforeValue: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: "red",
    fontFamily: "CairoMed"
  },
  priceContainerView: {
    flexDirection: 'row-reverse',
    alignItems: "center"
  },
  priceText: {
    fontFamily: "CairoBold",
    fontSize: 13
  },
  priceViewContainerTwo: {
    borderWidth: 2,
    borderColor: "#55a8b9",
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    borderRadius: 10
  },
  priceViewContainerTwoText: {
    color: "#55a8b9",
    fontFamily: "CairoMed"
  },
  line: {
    height: 1,
    borderColor: "#D0D0D0",
    borderWidth: 1
  },
  infoText: {
    color: "#000",
    marginHorizontal: 10,
    fontFamily: "CairoMed",
    fontSize: 12
  },
  addToCartText: {
    color: "#fff",
    fontFamily: "CairoMed"
  },
  revContainer: {
    backgroundColor: "#55a8b9",
    marginTop: 10
  },
  revHeaderText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "CairoMed"
  },
  reviewsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  reviewItemText: {
    fontFamily: "CairoMed",
    fontSize: 10
  },
  ourReviewsText: {
    fontFamily: "CairoBold",
    fontSize: 14
  },
  noReviewsText: {
    fontSize: 15,
    color: "#55A8B9",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "CairoMed"
  }
}); 
