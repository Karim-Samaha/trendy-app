import {

    View,

    Pressable,
    TextInput,

} from "react-native";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { AntDesign } from "@expo/vector-icons";

const Search = () => {
    return <View
        style={{
            backgroundColor: "#55a8b9",
            height: 80,
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            direction: "rtl",
            flexDirection: "row-reverse",
            
        }}
    >
        <Pressable
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 7,
                backgroundColor: "white",
                borderRadius: 10,
                marginTop: "auto",
                height: 38,
                flex: 1,
                direction: "rtl",
                flexDirection: "row-reverse",
                position: "relative"
            }}
        >

            <TextInput placeholder="ابحث عن منتجك" style={{
                paddingHorizontal: 10
            }}
            />
            <AntDesign
                style={{
                    position: "absolute", right: 5,
                    top: 8,
                }} name="search1"
                size={22}
                color="black" />
        </Pressable>

    </View>
}

export default Search;