import { View, StyleSheet, Text, Image } from "react-native"
import { config } from "../screens/config"
const AddToCartMessage = ({ product }) => {
    console.log({product})
    return <View style={styles.container}>
        <Text style={styles.header}>تم اضافة المنتج الي السلة</Text>
        <View style={styles.productContainer}>
            <Image
                style={{ width: 50, height: 50, resizeMode: "cover", borderRadius: 11, marginHorizontal: 10 }}
                source={{ uri: `${config.assetsUrl}/${product.item.image}` }}
            />
            <Text>{product.item?.name}</Text>
        </View>
    </View>
}

export default AddToCartMessage

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 110,
        borderColor: "#55a8b9",
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: "#fff",
        position: "absolute",
        top: 0,
        right: "5%",
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
        fontWeight: "bold",
        fontSize: 18
    },
    productContainer: {
        flexDirection: "row-reverse",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
    }
});


