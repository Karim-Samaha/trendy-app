import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { UserType } from "../UserContext";
import _axios from "../Utils/axios";
import { config } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Search from "../components/Search";

const AccountInfo = () => {
    const navigation = useNavigation();
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
    });
    const [updated, setUpdated] = useState({});
    const [user, setUser] = useState({});

    const fetchUserInfo = async () => {
        const user = await AsyncStorage.getItem(("user"))
        if (user) {
            let parsedUser = JSON.parse(user)
            setUser(parsedUser)
            try {
                const response = await _axios.post(`${config.backendUrl}/user/get-user-info`,
                    {}, { parsedUser })
                setForm({
                    name: response.data.data?.name || "",
                    email: response.data.data?.email || "",
                    address: response.data.data?.address || "",
                    phone: response.data?.data.phone || "",
                });
                console.log({ response })
            } catch (err) {
                console.log(err)
            }
        }
    }
    useEffect(() => {
        fetchUserInfo()
    }, []);
    const handleSubmit = async () => {
        await _axios
            .post(
                `${config.backendUrl}/user/update-info`,
                form,
                //@ts-ignore
                { user }
            )
            .then((res) => {
                setUpdated(res.data);
            })
            .catch((err) => setErr(true));
    };


    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 0 }}>
            <Search />
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
                    بيانات الحساب
                    {`  `}
                    <FontAwesome5 name="info-circle" size={24} color="silver" />
                </Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <View style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
                            <MaterialCommunityIcons name="rename-box" size={24} color="silver" />
                            <Text style={{ marginHorizontal: 10 }}>الأسم</Text>
                        </View>
                        <TextInput style={styles.input} value={form.name}
                            onChangeText={(e) => setForm(prev => ({ ...prev, name: e }))}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
                            <MaterialIcons name="email" size={24} color="silver" />
                            <Text style={{ marginHorizontal: 10 }}>البريد الالكتروني</Text>
                        </View>
                        <TextInput style={styles.input} value={form.email}
                            onChangeText={(e) => setForm(prev => ({ ...prev, email: e }))}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
                            <Entypo name="address" size={24} color="silver" />
                            <Text style={{ marginHorizontal: 10 }}>العنوان</Text>
                        </View>
                        <TextInput style={styles.input} value={form.address}
                            onChangeText={(e) => setForm(prev => ({ ...prev, address: e }))}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
                            <AntDesign name="phone" size={24} color="silver" />
                            <Text style={{ marginHorizontal: 10 }}>الهاتف</Text>
                        </View>
                        <TextInput style={styles.input} value={form.phone}
                            onChangeText={(e) => setForm(prev => ({ ...prev, phone: e }))}

                        />
                    </View>
                </View>
                {updated?.status === "success" && <View style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse", marginVertical: 20 }}>
                    <AntDesign name="checkcircle" size={24} color="green" />
                    <Text style={{ marginHorizontal: 10, color: "green", fontWeight: "bold" }}>الهاتف</Text>
                </View>}
                <Pressable
                    onPress={handleSubmit}
                    style={{
                        backgroundColor: "#55a8b9",
                        padding: 10,
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: 10,
                        marginVertical: 10,
                    }}
                >
                    <View>
                        <Text style={{ color: "#fff" }}>حفظ</Text>
                    </View>
                </Pressable>

            </View>
        </ScrollView>
    );
};

export default AccountInfo;

const styles = StyleSheet.create({
    formContainer: {
        marginTop: 40
    },
    inputContainer: {
        width: "100%",

    },
    input: {
        width: "100%",
        height: 48,
        borderColor: "#55a8b9",
        borderWidth: 1,
        borderRadius: 11,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        textAlign: "right"
    },
});
