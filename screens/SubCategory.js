import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { config } from "./config";
import Product from "../components/Product";
import Search from "../components/Search";

const SubCategorie = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const sectionRef = useRef();
  const sectionOneRef = useRef();
  const sectionTwoRef = useRef();
  const sectionThreeRef = useRef();

  const scrollToEnd = (ref) => {
    sectionRef.current.scrollToEnd({ animated: false });
    //   sectionOneRef.current.scrollToEnd({ animated: false });
    //   sectionTwoRef.current.scrollToEnd({ animated: false });
    //   sectionThreeRef.current.scrollToEnd({ animated: false });
  };
  const [products, setProducts] = useState([]);
  const [productLoaded, setProductLoaded] = useState(false);
  const [currentSubId, setCurrentSubId] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [imageHasError, setImageHasError] = useState(false);
  const [ctgInfo, setCtgInfo] = useState({});

  const [limit, setLimit] = useState(12);
  const requestMore = () => {
    setLimit((prev) => prev + 10);
  };
  const fetchCategoryAllProducts = async () => {
    const categoryId = await route.params?.item?._id;
    const response = await axios.get(
      `${config.backendUrl}/category/${categoryId}/all-products?limit=${limit}&channel=web`
    );
    let setObj = new Set(response.data.data.map(JSON.stringify));
    let output = Array.from(setObj).map(JSON.parse);
    let active = output.filter((item) => item.active);
    setProducts(active);
    setProductLoaded(true);
  };

  const fetchSubCategory = async () => {
    const categoryId = await route.params?.item?._id;
    const response = await axios.get(
      `${config.backendUrl}/subcategory?ctg=${categoryId}&limit=${limit}`
    );
    console.log("!!!");

    setSubCategories(response.data.data.reverse());
  };

  const fetchSubCategoryProducts = async () => {
    const subCategoryId = currentSubId;
    const response = await axios.get(
      `${config.backendUrl}/subcategory/${subCategoryId}?limit=${limit}`
    );
    setProducts(response.data.data.productList.reverse());
    setProductLoaded(true);
  };
  const handleRequestingProductsData = () => {
    if (!currentSubId) {
      fetchCategoryAllProducts();
    } else {
      console.log("this");
      fetchSubCategoryProducts();
    }
  };
  const handleSubCategorySelection = (id) => {
    setLimit(12);
    setCurrentSubId(id);
  };
  useEffect(() => {
    fetchSubCategory();
  }, []);
  useEffect(() => {
    handleRequestingProductsData();
  }, [currentSubId, limit]);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.item?.name,
    });
  }, [navigation]);

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

        <ScrollView
          style={{
            direction: "rtl",
            paddingTop: 60,
          }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 20,
              paddingBottom: 120,
            }}
          >
            {subCategories.length > 0 ? (
              <>
                {subCategories.length > 1 && (
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginTop: 5,
                      marginBottom: 10,
                      textAlign: "left",
                      paddingHorizontal: 10,
                    }}
                  >
                    التصنيفات الفرعية
                  </Text>
                )}

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                  onContentSizeChange={scrollToEnd}
                  ref={sectionRef}
                >
                  {subCategories.length > 1
                    ? subCategories.map((item) => {
                        if (
                          item?.name?.trim() === route?.params.item?.name.trim()
                        ) {
                          return null;
                        }
                        return (
                          <Pressable
                            style={{
                              ...styles.subCtgLabel,
                              backgroundColor:
                                currentSubId === item?._id
                                  ? "#55a8b9"
                                  : "white",
                              color:
                                currentSubId === item?._id ? "#fff" : "000",
                            }}
                            key={item?._id}
                            onPress={() =>
                              handleSubCategorySelection(item?._id)
                            }
                          >
                            <Text
                              style={{
                                color:
                                  currentSubId === item?._id ? "#fff" : "#000",
                              }}
                            >
                              {item.name}
                            </Text>
                          </Pressable>
                        );
                      })
                    : null}
                </ScrollView>
              </>
            ) : null}
            <View
              style={{
                flexDirection: "row-reverse",
                flexWrap: "wrap",
                justifyContent:
                  products.length == 0 ? "center" : "space-between",
                paddingTop: 10,
              }}
            >
              {products.length > 0 ? (
                products.map((item) => {
                  return (
                    <Product
                      item={item}
                      key={item?._id}
                      containerStyle={{ width: 160, height: 140 }}
                      twoCell={true}
                    />
                  );
                })
              ) : products.length === 0 && productLoaded ? (
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, marginTop: 40 }}
                >
                  لا يوجد منتجات حاليا
                </Text>
              ) : null}
            </View>
            {productLoaded && products.length >= 8 && (
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity style={styles.moreBtn} onPress={requestMore}>
                  <Text style={styles.moreText}>عرض المزيد</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SubCategorie;

const styles = StyleSheet.create({
  ctgContainer: {
    width: "60%",
    backgroundColor: "#f4f1df",
    borderRadius: 11,
    margin: 5,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  ctgName: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  subCtgLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: "#55a8b9",
    borderWidth: 3,
    borderRadius: 10,
  },
  moreBtn: {
    backgroundColor: "#55a8b9",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
    width: "40%",
  },
  moreText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
