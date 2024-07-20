import { View, Pressable, Image, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { config } from "../screens/config";
import { useState } from "react";

const Product = ({ item, containerStyle, twoCell, handleAddToCart }) => {
  const navigation = useNavigation();
  const [imageHasError, setImageHasError] = useState(false);
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Info", {
          id: item.id,
          title: item.title,
          price: item?.price,
          carouselImages: item.carouselImages,
          color: item?.color,
          size: item?.size,
          oldPrice: item?.oldPrice,
          item: item,
        })
      }
      style={{
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: twoCell ? "2.5%" : 10,
        width: twoCell ? "45%" : "6%",
        minWidth: 120,
        maxWidth: 170,
      }}
    >
      <Image
        style={{
          width: "100%",
          height: containerStyle?.width || 120,
          resizeMode: "contain",
          borderRadius: 11,
          backgroundColor: "#ccaa91",
        }}
        source={{
          uri: imageHasError
            ? "https://picsum.photos/200/300"
            : `${config.assetsUrl}/${item?.image}`,
        }}
        onError={() => setImageHasError(true)}
      />
      <View style={{ minHeight: 50, alignItems: "flex-end" }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 12,
            fontFamily: "CairoMed",
            textAlign: "left",
          }}
        >
          {item.name.length > 35
            ? `${item.name.substring(0, 35)}...`
            : item.name}
        </Text>
      </View>
      <View>
        {item.priceBefore && (
          <Text style={{ fontSize: 9, fontFamily: "CairoMed" }}>
            سعر قبل الخصم :{" "}
            <Text
              style={{
                textDecorationLine: "line-through",
                textDecorationStyle: "solid",
                color: "#ff1111",
              }}
            >
              {item.priceBefore}
            </Text>
          </Text>
        )}
        <Text style={{ fontSize: 14, fontFamily: "CairoBold" }}>
          السعر : {item.price} ر.س
        </Text>
      </View>
      {item?.priceBefore && (
        <View
          style={{
            backgroundColor: "#FDFDFD",
            paddingVertical: 5,
            width: 100,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            borderRadius: 11,
            borderWidth: 1,
            borderColor: "#55a8b9",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#55a8b9",
              fontSize: 13,
              fontWeight: "bold",
            }}
          >
            خصم {100 - ((item.price / item.priceBefore) * 100).toFixed(0)} %
          </Text>
        </View>
      )}
      {
        handleAddToCart ? (
          <Pressable
            style={styles.mainBtn}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={{ color: "#fff", fontFamily: "CairoMed" }}>
              اضف الي السلة
            </Text>
          </Pressable>
        ) : null
        //  <Pressable style={styles.mainBtn} onPress={() => navigation.navigate("Info", {
        //     id: item.id,
        //     title: item.title,
        //     price: item?.price,
        //     carouselImages: item.carouselImages,
        //     color: item?.color,
        //     size: item?.size,
        //     oldPrice: item?.oldPrice,
        //     item: item,
        // })}>
        //     <Text style={{ color: "#fff", fontSize: 12, fontFamily: "CairoMed" }} >اضف الي السلة</Text>
        // </Pressable>
      }

      <View></View>
    </Pressable>
  );
};

export default Product;

const styles = StyleSheet.create({
  mainBtn: {
    backgroundColor: "#55a8b9",
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 6,
    marginTop: 10,
  },
});
