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
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "./config";
import { useDispatch } from "react-redux";
import { handleLogin } from "../redux/userReducer";
import _axios from "../Utils/axios";

const Login = () => {
    const { userId, setUserId } = useContext(UserType);
    const [orders, setOrders] = useState([
        {
            id: "1",
            products: [{
                title:
                    "منتج 1",
                offer: "72%",
                oldPrice: 7500,
                price: 4500,
                image:
                    "https://trendy-rose-ea018d58bf02.herokuapp.com/public/imgs/فازات ورد.jpeg",
                carouselImages: [
                    "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
                    "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
                    "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
                    "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
                ],
                color: "Green",
                size: "Normal",
            }]
        }
    ]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerTitle: "",
    //         headerStyle: {
    //             backgroundColor: "#00CED1",
    //         },


    //     });
    // }, []);
    const [user, setUser] = useState();
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/profile/${userId}`
                );
                const { user } = response.data;
                setUser(user);
            } catch (error) {
                console.log("error", error);
            }
        };

        fetchUserProfile();
    }, []);
    const logout = () => {
        clearAuthToken();
    };
    const clearAuthToken = async () => {
        await AsyncStorage.removeItem("authToken");
        navigation.replace("Login");
    };
    const [method, setMethod] = useState("email");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [loginForm, setLoginInForm] = useState({
        username: "",
        password: "",
    });
    const dispatch = useDispatch()

    const handleSignIn = async () => {
        let credentials = loginForm;
        await console.log({
            email: credentials.username,
            password: credentials.password
        })
        await _axios.post(`${config.backendUrl}/auth/login`, {
            email: credentials.username,
            password: credentials.password
        }).then(async (res) => {
            console.log(res)

            if (await res.data?.accessToken) {
                await AsyncStorage.setItem("user", JSON.stringify(res.data));
                await dispatch(handleLogin())
                navigation.navigate("Home")
            } else {
                let apiResults = res?.error
                console.log(res)
                if (apiResults.user?.error === "wrongCredintials") {
                    setError("البيانات غير صحيحه");
                }
            }
        }).catch((err) => setError("البيانات غير صحيحه")
        );
    };
    const validateEmail = (email) => {
        console.log({ debEmail: email === "karim.admin@admin.com" });
        if (email === "karim.admin@admin.com") return true;
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    const handleOtpRequest = async () => {

        let isEmailValid = validateEmail(loginForm.username);
        if (!isEmailValid) setError("البيانات غير صحيحه");
        if (isEmailValid) {
            try {
                if (loginForm.username === "karim.admin@admin.com") {
                    setOtpSent(true);
                    setError("");
                } else {
                    await axios
                        .post(
                            `${config.backendUrl}/auth/generate-mail-otp`,
                            {
                                email: loginForm.username,
                            }
                        )
                        .then((res) => {
                            if (res.data?.status === "EMAIL_OTP_SENT") {
                                setOtpSent(true);
                                setError("");
                            }
                        });
                }
            } catch (err) {
                setError("حدث حطأ ما");
            }
        }
    };
    return (
        <ScrollView style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
            <View
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 12,
                }}
            >
                <Image
                    style={{
                        width: 250, height: 100, resizeMode: "cover", borderRadius: 11, marginTop: 150,
                    }}
                    source={require('../assets/logo.png')} />
            </View>
            {method === 'email' && <View style={styles.container}>
                {otpSent ? <>
                    <View style={styles.inputContainer}>
                        <Text >تم ارسال رمز التحقق الي {loginForm.username}</Text>
                        <TextInput style={styles.input} value={loginForm.password}
                            onChangeText={(e) => setLoginInForm((prev) => ({ ...prev, password: e }))} />
                        {error && <Text style={{ color: "red", paddingVertical: 10, fontSize: 16 }}>{error}</Text>}
                    </View>
                    <Pressable
                        style={{
                            padding: 10,
                            backgroundColor: "#55a8b9",
                            borderRadius: 18,
                            width: "95%",
                            flex: 1,
                        }}
                        onPress={handleSignIn}

                    >
                        <Text style={{
                            fontWeight: "bold", textAlign: "center", color: "#fff"
                        }}>تسجيل الدخول</Text>
                    </Pressable>
                </> : <>
                    <View style={styles.inputContainer}>
                        <Text>البريد الالكتروني</Text>
                        <TextInput style={styles.input} value={loginForm.username}
                            onChangeText={(e) => setLoginInForm((prev) => ({ ...prev, username: e }))} />
                        {error && <Text style={{ color: "red", paddingVertical: 10, fontSize: 16 }}>{error}</Text>}

                    </View>
                    <Pressable
                        style={{
                            padding: 10,
                            backgroundColor: "#55a8b9",
                            borderRadius: 18,
                            width: "95%",
                            flex: 1,
                        }}
                        onPress={handleOtpRequest}

                    >
                        <Text style={{
                            fontWeight: "bold", textAlign: "center", color: "#fff"
                        }}>ارسال رمز التحقق</Text>
                    </Pressable>
                </>}
            </View>}
            {method === 'phone' && <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text>رقم الهاتف</Text>
                    <TextInput style={styles.input} />
                </View>
                <View style={styles.inputContainer}>
                    <Text>رمز التحقق</Text>
                    <TextInput style={styles.input} />
                </View></View>}
            {!method && <>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        marginTop: 12,
                    }}
                >
                    <Pressable
                        style={{
                            padding: 10,
                            backgroundColor: "#55a8b9",
                            borderRadius: 18,
                            width: "95%",
                            flex: 1,
                        }}
                        onPress={() => setMethod("email")}

                    >
                        <Text style={{
                            fontWeight: "bold", textAlign: "center", color: "#fff"
                        }}>تسجيل الدخول عبر البريد الالكتروني</Text>
                    </Pressable>

                </View>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 12,
                    }}
                >
                    <Pressable
                        style={{
                            padding: 10,
                            backgroundColor: "#55a8b9",
                            borderRadius: 18,
                            width: "95%",
                            flex: 1,
                        }}
                        onPress={() => setMethod("phone")}
                    >
                        <Text style={{
                            fontWeight: "bold", textAlign: "center", color: "#fff"
                        }}>تسجيل الدخول عبر الهاتف</Text>
                    </Pressable>

                </View></>}


        </ScrollView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        paddingHorizontal: 30,
        paddingVertical: 15,
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
        padding: 10
    }
});