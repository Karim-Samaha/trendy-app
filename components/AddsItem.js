import { Text, View, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { ProductForm } from "../constants/Locales";
import { SelectList } from 'react-native-dropdown-select-list'

const AddsItem = ({ item, handleSelectAddQty, deleteAdd, handleSlectedGiftOptions }) => {
    const [options, setOptions] = useState({
        color: item?.colors?.length > 0 ? item?.colors[0] : null,
        text: item?.textArr?.length > 0 ? item?.textArr[0] : null,
    });
    const colors = [
        { val: "red", text: "احمر" },
        { val: "white", text: "ابيض" },
        { val: "brown", text: "بني" },
        { val: "yellow", text: "اصفر" },
        { val: "rgba(0,0,0,0.5)", text: "شفاف" },
        { val: "green", text: "اخضر" },
        { val: "blue", text: "ازرق" },
        { val: "#0066CC", text: "كحلي" },
        { val: "#000", text: "اسود" },
        { val: "pink", text: "زهري" },
        { val: "silver", text: "فضي" },
        { val: "#FFD700", text: "ذهبي" },
    ];
    return <View style={styles.addsItem} key={item?._id}>
        <Text style={{ ...styles.label, fontSize: 12 }}>{item?.name}</Text>
        <View style={styles.addsController}>
            <Pressable style={{ marginHorizontal: 10 }} onPress={() => handleSelectAddQty(item?._id, "add")}>
                <Feather name="plus" size={24} color="black" />
            </Pressable>
            <Text style={styles.label}>{item?.quantity}</Text>
            <Pressable style={{ marginHorizontal: 10 }} onPress={() => handleSelectAddQty(item?._id, "deduct")}>
                <AntDesign name="minus" size={24} color="black" />
            </Pressable>
        </View>
        <Pressable onPress={() => deleteAdd(item?._id)}>
            <Text style={{ color: "red", ...styles.label }}>{ProductForm['ar'].delete}</Text>
        </Pressable>
        {item?.colors.length > 0 ? <View style={{ marginTop: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
            <View style={{ width: "100%" }}>
                <Text>{ProductForm['ar'].color} : {colors.find((colorItem) => colorItem.val === item?.color)?.text}</Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
                {item?.colors?.map((color) => {
                    return <Pressable
                        key={color}
                        style={{
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            marginHorizontal: 2,
                            backgroundColor:

                                color === "blue"
                                    ? "#0000f9"
                                    : color === "#0066CC"
                                        ? "#0655a5"
                                        : color,
                            borderWidth:
                                options.color === color
                                    ? 3
                                    : 1,
                            borderColor: options.color === color
                                ? "#55a8b9"
                                : "black",
                            cursor: "pointer",
                            // backgroundImage:
                            //     color === "rgba(0,0,0,0.5)" ? `url(${bgImage.src})` : ``,
                            // backgroundSize: "cover",
                        }}
                        onPress={() => {
                            setOptions((prev) => ({ ...prev, color: color }));
                            handleSlectedGiftOptions(item?.cartId, "color", color);
                        }}
                    >
                    </Pressable>
                })}
            </View>

        </View> : null}
        {item?.textArr?.length > 0 ? (
            <View style={{ width: "100%", marginTop: 10 }}>

                <Text style={{ marginVertical: 10 }}>{ProductForm['ar'].productOptions} : {options?.text}</Text>
                <View style={{ alignItems: "flex-end" }}>
                    {/* <select
                            value={options.text}
                            onChange={(e) => {
                                setOptions((prev) => ({ ...prev, text: e.target.value }));
                                handleSlectedGiftOptions(item?.cartId, "text", e.target.value);
                            }}
                        >
                            {item?.textArr.map((option: string) => {
                                return <option key={option}>{option}</option>;
                            })}
                        </select> */}
                    <SelectList
                        setSelected={(e) => {
                            setOptions((prev) => ({ ...prev, text: e }));
                            handleSlectedGiftOptions(item?.cartId, "text", e);
                        }}
                        save="value"
                        search={false}
                        data={item?.textArr}
                        placeholder={"خيارت المنتج"}
                        boxStyles={{ flexDirection: "row-reverse", fontFamily: "CairoMed", width: 250, }} />


                </View>
            </View>
        ) : null}

    </View>
}

const styles = StyleSheet.create({
    addsItem: {
        width: "100%",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#55a8b9",
        paddingVertical: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 9,
        marginBottom: 5
    },
    label: {
        fontFamily: "CairoMed"
    },
    addsController: {
        flexDirection: "row-reverse",
        marginVertical: 10
    },
})

export default AddsItem