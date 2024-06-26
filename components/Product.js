import { View, Pressable, Image, Text, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { config } from "../screens/config";
import { useState } from "react";

const Product = ({ item }) => {
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
            marginVertical: 10,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 10
        }}
    >
        <Image
            style={{ width: 120, height: 120, resizeMode: "contain", borderRadius: 11 }}
            source={{
                uri: imageHasError ? "https://picsum.photos/200/300" :
                    `${config.assetsUrl}/${item?.image}`
            }}
            onError={() => setImageHasError(true)}

        />
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name.length > 20 ? `${item.name.substring(0, 19)}...` : item.name}</Text>
        <View>
            {item.priceBefore && <Text style={{ fontWeight: "bold", fontSize: 11, }}>سعر قبل الخصم : <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: "#ff1111" }}>{item.priceBefore}</Text></Text>
            }
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>السعر : {item.price} ر.س</Text>

        </View>
        {item.priceBefore && <View
            style={{
                backgroundColor: "#FDFDFD",
                paddingVertical: 5,
                width: 100,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                borderRadius: 11,
                borderWidth: 1,
                borderColor: "#55a8b9"
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
                خصم {100 - (item.price / item.priceBefore * 100).toFixed(0)} %
            </Text>
        </View>}
        <Pressable style={styles.mainBtn} onPress={() => navigation.navigate("Info", {
            id: item.id,
            title: item.title,
            price: item?.price,
            carouselImages: item.carouselImages,
            color: item?.color,
            size: item?.size,
            oldPrice: item?.oldPrice,
            item: item,
        })}>
            <Text style={{ color: "#fff" }} >اضف الي السلة</Text>
        </Pressable>
        <View>

        </View>

    </Pressable>
}

export default Product


const styles = StyleSheet.create({
    mainBtn: {

        backgroundColor: "#55a8b9",
        width: 120,
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        borderRadius: 6,
        marginTop: 10

    }
});
