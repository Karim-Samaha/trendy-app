import { View, Pressable, Image, Text, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { config } from "../screens/config";
import { useState } from "react";
import { ProductLocal } from "../constants/Locales";

const Product = ({ item, containerStyle, twoCell, handleAddToCart }) => {
    const navigation = useNavigation();
    const [imageHasError, setImageHasError] = useState(false)
    return <Pressable
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
            ...styles.container, marginHorizontal: twoCell ? "2.5%" : 10,
            width: twoCell ? "45%" : "6%",
        }}
    >
        <Image
            style={{ ...styles.image, height: containerStyle?.width || 120 }}
            source={{
                uri: imageHasError ? "https://picsum.photos/200/300" :
                    `${config.assetsUrl}/${item?.image}`
            }}
            onError={() => setImageHasError(true)}

        />
        <View style={{ minHeight: 50 }}>
            <Text numberOfLines={2} style={styles.name}>
                {item.name.length > 35 ? `${item.name.substring(0, 35)}...` : item.name}</Text>
        </View>
        <View>
            {item.priceBefore && <Text style={styles.priceBefore}>{ProductLocal['ar'].priceBefore} : <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: "#ff1111" }}>{item.priceBefore}</Text></Text>
            }
            <Text style={styles.price}>{item.price} ر.س</Text>

        </View>
        {item?.priceBefore && <View
            style={styles.priceBeforeContainer}
        >
            <Text
                style={styles.precent}
            >
                {ProductLocal['ar'].discount} {100 - (item.price / item.priceBefore * 100).toFixed(0)} %
            </Text>
        </View>}
        {handleAddToCart ?
            <Pressable style={styles.mainBtn} onPress={() => handleAddToCart(item)}>
                <Text style={styles.addToCartText} >{ProductLocal['ar'].addToCart}</Text>
            </Pressable> : null

        }

        <View>

        </View>

    </Pressable>
}

export default Product


const styles = StyleSheet.create({
    mainBtn: {
        backgroundColor: "#55a8b9",
        width: "95%",
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        borderRadius: 6,
        marginTop: 10

    },
    container: {
        marginVertical: 10,
        alignItems: "flex-end",
        justifyContent: "center",
        minWidth: 120,
        maxWidth: 170
    },
    image: {
        width: "100%",
        resizeMode: "contain",
        borderRadius: 11,
        backgroundColor: "#ccaa91"
    },
    name: {
        fontSize: 12,
        fontFamily: "CairoMed"
    },
    priceBefore: {
        fontSize: 9,
        fontFamily: "CairoMed"
    },
    price: {
        fontSize: 14,
        fontFamily: "CairoBold",
        paddingHorizontal: 5
    },
    priceBeforeContainer: {
        backgroundColor: "#FDFDFD",
        paddingVertical: 5,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: "#55a8b9"
    },
    precent: {
        textAlign: "center",
        color: "#55a8b9",
        fontSize: 13,
        fontWeight: "bold",
    },
    addToCartText: {
        color: "#fff",
        fontFamily: "CairoMed"
    }
});


