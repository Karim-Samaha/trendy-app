import { View, StyleSheet, Text, Image, Pressable } from "react-native"
import { config } from "../screens/config"
import { useNavigation } from "@react-navigation/native"
const AddToCartMessage = ({ product }) => {
    const navigation = useNavigation()
    return <Pressable onPress={() => navigation.navigate("Cart")} style={styles.container}>
        <Text style={styles.header}>تم اضافة المنتج الي السلة</Text>
        <View style={styles.productContainer}>
            <Image
                style={styles.imgStyle}
                source={{ uri: `${config.assetsUrl}/${product.item.image}` }}
            />
            <Text style={{ fontFamily: "CairoMed" }}>{product.item?.name}</Text>
        </View>
    </Pressable>
}

export default AddToCartMessage

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 110,
        borderColor: "#55a8b9",
        borderWidth: 1,
        borderBottomEndRadius: 16,
        borderBottomStartRadius: 16,
        backgroundColor: "#fff",
        position: "absolute",
        top: 0,
        zIndex: 9999,
        right: "0%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    header: {
        borderColor: "silver",
        borderBottomWidth: 1,
        padding: 5,
        fontSize: 16,
        fontFamily: "CairoBold"
    },
    productContainer: {
        flexDirection: "row-reverse",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    imgStyle: {
        width: 50,
         height: 50,
         resizeMode: "cover", 
        borderRadius: 11,
         marginHorizontal: 10
    }
});


