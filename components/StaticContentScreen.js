import {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput
} from "react-native";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";

import _axios from "../Utils/axios";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const StaticContentScreen = ({ title, content, secContent }) => {
    return <ScrollView style={styles.container}>
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Image
                style={styles.logoImg}
                source={require('../assets/logo.png')} />
        </View>
        <View>
            <Text style={styles.headerText}>{title}</Text>
            <Text style={styles.contentText}>{content}</Text>
            {secContent && <Text style={styles.contentText}>{secContent}</Text>}
        </View>
    </ScrollView>

}

export default StaticContentScreen

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: "white"
    },
    logoImg: {
        width: 250,
        height: 100,
        resizeMode: "cover",
        borderRadius: 11,
        marginTop: 100,
    },
    headerText: {
        fontSize: 22,
        marginTop: 25,
        fontFamily: "CairoBold"
    },
    contentText: {
        padding: 10,
        fontSize: 13,
        fontFamily: "CairoMed"
    }
});
