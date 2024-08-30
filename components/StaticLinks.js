import {

    Text,
    View,
    Pressable,
} from "react-native";
import React from "react";

import _axios from "../Utils/axios";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";
import { StaticLinksLocale } from "../constants/Locales";


const StaticLinks = ({ style }) => {
    const navigation = useNavigation();

    return <>

        <Pressable
            style={{
                padding: 10,
                borderColor: "#55a8b9",
                borderWidth: 1,
                borderRadius: 8,
                width: "95%",
                flex: 1,
                height: 50,
                justifyContent: "center"

            }}
            onPress={() => navigation.navigate("Terms")}

        >
            <View style={{ flexDirection: "row-reverse" }}>
                <MaterialIcons name="policy" size={24} color="#55a8b9" />
                <Text style={{  fontSize: 14, marginHorizontal: 10, fontFamily: "CairoBold" }}>{StaticLinksLocale['ar'].terms}</Text>
            </View>
        </Pressable>
        <Pressable
            style={{
                padding: 10,
                borderColor: "#55a8b9",
                borderWidth: 1,
                borderRadius: 8,
                width: "95%",
                flex: 1,
                height: 50,
                justifyContent: "center",
                ...style

            }}
            onPress={() => navigation.navigate("RefundPolicy")}
        >
            <View style={{ flexDirection: "row-reverse" }}>
                <MaterialCommunityIcons name="credit-card-refund-outline" size={24} color="#55a8b9" />
                <Text style={{  fontSize: 14, marginHorizontal: 10, fontFamily: "CairoBold" }}>{StaticLinksLocale['ar'].refund}</Text>
            </View>
        </Pressable>
        <Pressable
            style={{
                padding: 10,
                borderColor: "#55a8b9",
                borderWidth: 1,
                borderRadius: 8,
                width: "95%",
                flex: 1,
                height: 50,
                justifyContent: "center",
                ...style

            }}
            onPress={() => navigation.navigate("CustomerService")}
        >
            <View style={{ flexDirection: "row-reverse" }}>
                <AntDesign name="customerservice" size={24} color="#55a8b9" />
                <Text style={{  fontSize: 14, marginHorizontal: 10, fontFamily: "CairoBold" }}>{StaticLinksLocale['ar'].customerService}</Text>
            </View>
        </Pressable>
        <Pressable
            style={{
                padding: 10,
                borderColor: "#55a8b9",
                borderWidth: 1,
                borderRadius: 8,
                width: "95%",
                flex: 1,
                height: 50,
                justifyContent: "center",
                ...style

            }}
            onPress={() => navigation.navigate("Licence")}

        >
            <View style={{ flexDirection: "row-reverse" }}>
                <MaterialCommunityIcons name="license" size={24} color="#55a8b9" />
                <Text style={{ fontSize: 14, marginHorizontal: 10, fontFamily: "CairoBold" }}>{StaticLinksLocale['ar'].licences}</Text>
            </View>
        </Pressable>
    </>

}

export default StaticLinks