import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import { config } from "./config";
import Product from "../components/Product";
import Search from "../components/Search";
import { HomeLocales } from "../constants/Locales";


const HomeScreen = () => {

  const [sections, setSections] = useState({})
  const [images, setImages] = useState({
    banners: [],
    heros: []
  })
  const categoryRef = useRef();
  const sectionOneRef = useRef();
  const sectionTwoRef = useRef();
  const sectionThreeRef = useRef();
  const sectionFourRef = useRef();
  const sectionFiveRef = useRef();

  const scrollToEnd = (ref) => {
    categoryRef.current?.scrollToEnd({ animated: false });
    sectionOneRef.current?.scrollToEnd({ animated: false });
    sectionTwoRef.current?.scrollToEnd({ animated: false });
    sectionThreeRef.current?.scrollToEnd({ animated: false });
    sectionFourRef.current?.scrollToEnd({ animated: false });
    sectionFiveRef.current?.scrollToEnd({ animated: false });
  };
  const [list, setList] = useState([])
  const [listImgError, setListImgError] = useState([])
  const navigation = useNavigation();
  const [, setAddresses] = useState([]);
  const { userId, } = useContext(UserType);



  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/category`);
      setList(response.data.data.filter((item) => item?.active));
    } catch (error) {
      console.log("error message", error);
    }
  };
  const fetchSections = async (order, count, name) => {
    try {
      const response = await axios.get(`${config.backendUrl}/homepage-sections?order=${order}`);
      setSections(prev => ({ ...prev, [count]: { productsList: response.data.data.subCategories[0]?.productList.filter((item) => item?.active), categoryName: name } }));
    } catch (error) {
      console.log("error message", error);
    }
  };
  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/banners`);
      setImages((prev) => ({
        ...prev, banners: response.data.data.filter((item) => item.type === 'BANNER'),
        heros: response.data.data.filter((item) => item.type === 'HERO_IMG' && item.active),
      }))
      console.log("!!!!!!!!!")
      console.log(response.data)
    } catch (error) {
      console.log("error message", error);
    }
  }
  async function getHomePageSectionsSettings() {
    const sectionsSettings = await axios
      .get(`${config.backendUrl}/homepage-sections-settings`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const sectionsCount = await sectionsSettings?.data?.homePageSettings.sectionsCount || 3
    const sectionsInfo = await sectionsSettings?.cateoriesInfo;
    console.log({ sectionsInfo })
    Promise.all([sectionsInfo.map((section, i) => fetchSections(section?._id, i + 1, section?.name))])
    if (!res) {
      throw new Error("Failed to fetch data");
    }

    return res;
  }
  useEffect(() => {
  }, [images])
  useEffect(() => {
    Promise.all([fetchCategory(),
    // fetchSections(1),
    // fetchSections(2),
    // fetchSections(3),
    getHomePageSectionsSettings(),
    fetchBanners(),])
  }, []);

  useEffect(() => {
    console.log("!!!!!")
    console.log({ sections })
  }, [sections])


  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/addresses/${userId}`
      );
      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleBannersLinks = (route) => {
    const categoryId = route.split("/")[2]
    navigation.navigate("SubCategories", {
      item: { _id: categoryId, name: "التصنيفات" },

    })
  }
  const scrollViewStyle = (list) => {
    if (list.length > 3) {
      return { flexDirection: "row-reverse" }
    } else {
      return { flexDirection: "row-reverse", minWidth: "100%" }
    }
  }

  return (
    <>
      <SafeAreaView
        style={{
          paddinTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <Search />
        <ScrollView style={styles.scrollView}>
          {images?.heros.length > 0 ? <SliderBox
            images={images.heros.map((item) => `${config.backendBase}${item?.imageSrc}`)}
            onCurrentImagePressed={i => handleBannersLinks(images.heros[i]?.route)}
            autoPlay
            circleLoop
            dotColor={"#13274F"}
            inactiveDotColor="#90A4AE"
            ImageComponentStyle={{ width: "94%", borderRadius: 11, height: 180 }}
          /> : null}
          <View style={{ direction: "rtl" }}>
            <Text style={styles.ctgHeader}>
              {HomeLocales['ar'].categoires}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
              flexDirection: "row-reverse",
            }}
              onContentSizeChange={scrollToEnd}
              ref={categoryRef}
            >

              {list.length > 0 ? list.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.categoryContainer}
                  onPress={() => navigation.navigate("SubCategories", {
                    id: item?.id,
                    title: item?.title,
                    price: item?.price,
                    carouselImages: item?.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })}
                >
                  <Image
                    style={{ width: 100, height: 100, resizeMode: "cover", borderRadius: 11 }}
                    source={{
                      uri: listImgError.includes(item?._id) ? "https://picsum.photos/200/300"
                        : `${config.backendBase}${item.image}`
                    }}
                    onError={() => setListImgError((prev) => ([...prev, item?._id]))}
                  />

                  <Text
                    style={styles.categoryContainer}
                  >
                    {item?.name}
                  </Text>
                </Pressable>
              )) : null}
            </ScrollView>
          </View>
          <Text
            style={styles.sectionTitle}
          />
          <View>
            {sections["1"]?.productsList?.length > 0 ? <>
              <Text style={styles.ctgHeader}>
                {sections["1"]?.categoryName}
              </Text>

              <ScrollView horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={scrollViewStyle(sections["1"]?.productsList)}
                onContentSizeChange={scrollToEnd}
                ref={sectionOneRef}

              >
                {sections["1"]?.productsList?.map((item, index) => (
                  <Product item={item} key={item.id} />
                ))}
              </ScrollView>
            </> : null}

            {images?.banners.length > 0 &&
              <>
                <Pressable onPress={() => handleBannersLinks(images?.banners[0]?.route)}>
                  <Image src={`${config.backendBase}${images?.banners[0].imageSrc}`}
                    style={styles.bannerImg} />
                </Pressable>
              </>
            }
          </View>
          <View>
            {sections["2"]?.productsList?.length > 0 ? <>
              <Text style={styles.ctgHeader}>
                {sections["2"]?.categoryName}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={scrollViewStyle(sections["2"]?.productsList)}
                onContentSizeChange={scrollToEnd}
                ref={sectionTwoRef}>
                {sections["2"]?.productsList?.map((item, index) => (
                  <Product item={item} key={item.id} />
                ))}
              </ScrollView>
            </> : null}
            {images?.banners.length > 1 &&
              <>
                <Pressable onPress={() => handleBannersLinks(images?.banners[1]?.route)}>
                  <Image src={`${config.backendBase}${images?.banners[1].imageSrc}`}
                    style={styles.bannerImg} />
                </Pressable>
              </>
            }
          </View>
          <View style={{ paddingBottom: 80 }}>
            {sections["3"]?.productsList?.length > 0 ? <>
              <Text style={styles.ctgHeader}>
                {sections["3"]?.categoryName}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={scrollViewStyle(sections["3"]?.productsList)}
                onContentSizeChange={scrollToEnd}
                ref={sectionThreeRef}>
                {sections["3"]?.productsList?.map((item, index) => (
                  <Product item={item} key={item.id} />
                ))}
              </ScrollView>
            </> : null}
          </View>
          {sections["4"]?.productsList?.length > 0 ? <>
            <View style={{ marginTop: -80 }}>
              <Text style={styles.ctgHeader}>
                {sections["4"]?.categoryName}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={scrollViewStyle(sections["4"]?.productsList)}
                onContentSizeChange={scrollToEnd}
                ref={sectionFourRef}>
                {sections["4"]?.productsList?.map((item, index) => (
                  <Product item={item} key={item.id} />
                ))}
              </ScrollView>
            </View>
          </> : null}
          {sections["5"]?.productsList?.length > 0 ? <>
            <View style={{ paddingBottom: 80 }}>
              <Text style={styles.ctgHeader}>
                {sections["5"]?.categoryName}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={scrollViewStyle(sections["5"]?.productsList)}
                onContentSizeChange={scrollToEnd}
                ref={sectionFiveRef}>
                {sections["5"]?.productsList?.map((item, index) => (
                  <Product item={item} key={item.id} />
                ))}
              </ScrollView>

            </View>
          </> : null}
        </ScrollView>
      </SafeAreaView >


    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  bannerImg: {
    width: "96%",
    height: 170,
    marginVertical: 15,
    marginHorizontal: "2%",
    borderRadius: 11
  },
  ctgHeader: {
    paddingBottom: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    fontSize: 20,
    fontFamily: "CairoBold",
    color: "#55a8b9",
  },
  scrollView: {
    direction: "rtl",
    paddingVertical: 80,
    marginTop: 10
  },
  categoryContainer: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF9E7",
    padding: 10,
    borderRadius: 10
  },
  categoryName: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "CairoMed",
    marginTop: 5,
  },
  sectionTitle: {
    height: 1,
    borderColor: "#D0D0D0",
    borderWidth: 2,
    marginTop: 15,
  }
});
