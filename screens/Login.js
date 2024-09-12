import {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput
} from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "./config";
import { useDispatch } from "react-redux";
import { handleLogin } from "../redux/userReducer";
import _axios from "../Utils/axios";
import AntDesign from '@expo/vector-icons/AntDesign';
import StaticLinks from "../components/StaticLinks";
import { LoginLocal } from "../constants/Locales";
const Login = () => {
    const { userId, setUserId } = useContext(UserType);
    const route = useRoute()
    const navigation = useNavigation();
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
    const [method, setMethod] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [isNewRegester, setIsNewRegester] = useState(false);
    const [validResend, setValidResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [resended, setResended] = useState(false);
    const [loginForm, setLoginInForm] = useState({
        username: "",
        password: "",
        name: "",
        phone: "",
    });
    const switchMethod = (type) => {
        setOtpSent(false)
        setError("")
        setIsNewRegester(false)
        setValidResend(false)
        setResendTimer(0)
        setResended(false)
        setLoginInForm({
            username: "",
            password: "",
            name: "",
            phone: "",
        })
        setMethod(type)
    }
    const dispatch = useDispatch()
    useEffect(() => {
        if (!validResend) {
            setResendTimer(30);
            setTimeout(() => {
                setValidResend(true);
                setResended(false);
            }, 30000);
        }
    }, [validResend]);
    useEffect(() => {
        if (resendTimer > 0) {
            setTimeout(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
    }, [resendTimer]);
    const handleSignIn = async () => {
        let credentials = loginForm;

        let newUserNotValid =
            (isNewRegester && !credentials.name) ||
            (isNewRegester && method !== "phone" && !credentials.phone);
        if (newUserNotValid) {
            setError("يجد ادخال كل اليانات المطلوبة");
            return;
        }
        if (loginForm.username.substring(0, 1) === "0") {
            credentials.username = credentials.username.slice(1);
        }
        if (method === "phone" && loginForm.username.substring(0, 3) !== "966") {
            credentials.username = `966${credentials.username}`;
        }
        await _axios.post(`${config.backendUrl}/auth/login`, {
            email: credentials.username.toLocaleLowerCase(),
            password: credentials.password,
            name: credentials.name,
            phone: credentials.phone
        }).then(async (res) => {
            if (await res.data?.accessToken) {
                await AsyncStorage.setItem("user", JSON.stringify(res.data));
                await dispatch(handleLogin())
                if (route.params?.callbackScreen) {
                    navigation.navigate('Cart')
                } else {
                    navigation.navigate("Home")
                }
            } else {
                let apiResults = res?.error
                if (apiResults.user?.error === "wrongCredintials") {
                    setError(LoginLocal['ar'].wrongInput);
                }
            }
        }).catch((err) => setError(LoginLocal['ar'].wrongInput)

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
        if (method === "phone") {
            let phoneNum = loginForm.username;
            if (phoneNum.substring(0, 1) === "0") {
                phoneNum = phoneNum.slice(1);
            }
            await axios
                .post(
                    `${config.backendUrl}/auth/generate-phone-otp`,
                    {
                        phone: phoneNum,
                    }
                )
                .then((res) => {
                    setOtpSent(true);
                    if (res.data?.isNewRegester) {
                        setIsNewRegester(true);
                    }
                });
        } else {
            let isEmailValid = validateEmail(loginForm.username);
            if (!isEmailValid) setError(LoginLocal['ar'].wrongInput);

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
                                if (res.data?.isNewRegester) {
                                    setIsNewRegester(true);
                                }
                            });
                    }
                } catch (err) {
                    setError(LoginLocal['ar'].somthingWentWrong);
                }
            }
        }

    };
    return (
        <ScrollView style={styles.scrollView}>
            <View
                style={styles.headerView}
            >
                <Image
                    style={styles.logo}
                    source={require('../assets/logo.png')} />
            </View>

            {method === 'email' && <View style={styles.container}>
                {otpSent ? <>
                    <View style={styles.inputContainer}>
                        {/* <Pressable onPress={() => setMethod("")}>
                            <AntDesign name="back" size={24} color="black" />
                        </Pressable> */}
                        <Text style={styles.firstText}>{LoginLocal['ar'].otpSentText} {loginForm.username}</Text>
                        {isNewRegester && <>
                            <TextInput style={styles.input} value={loginForm.phone} placeholder={LoginLocal['ar'].phone}
                                onChangeText={(e) => setLoginInForm((prev) => ({ ...prev, phone: e }))} />
                            <TextInput style={styles.input} value={loginForm.name} placeholder={LoginLocal['ar'].name}
                                onChangeText={(e) => setLoginInForm((prev) => ({ ...prev, name: e }))} />
                        </>}
                        <TextInput style={styles.input} value={loginForm.password} placeholder={LoginLocal['ar'].otpPlaceHolder}
                            onChangeText={(e) => setLoginInForm((prev) => ({ ...prev, password: e }))} />

                        {error && <Text style={styles.error}>{error}</Text>}
                    </View>
                    <Pressable
                        style={styles.prymaryBtn}
                        onPress={handleSignIn}

                    >
                        <Text style={styles.btnTxt}>{LoginLocal['ar'].login}</Text>
                    </Pressable>
                    <Pressable
                        style={styles.secBtn}
                        onPress={() => switchMethod("phone")}
                    >
                        <Text style={styles.secBtnTxt}>{LoginLocal['ar'].loginViaPhone}</Text>
                    </Pressable>

                </> : <>
                    <View style={styles.inputContainer}>
                        {/* <Pressable onPress={() => setMethod("")}>
                            <AntDesign name="back" size={24} color="black" />
                        </Pressable> */}
                        <Text style={styles.firstText}>{LoginLocal['ar'].email}</Text>
                        <TextInput style={styles.input} value={loginForm.username}
                            onChangeText={(e) => {
                                setLoginInForm((prev) => ({ ...prev, username: e }))
                                setError("")
                            }} />
                        {error && <Text style={styles.error}>{error}</Text>}

                    </View>

                    <Pressable
                        style={styles.mainBtn}
                        onPress={handleOtpRequest}

                    >
                        <Text style={styles.btnTxt}>{LoginLocal['ar'].otpButton}</Text>
                    </Pressable>
                    <Pressable
                        style={styles.secBtn}
                        onPress={() => switchMethod("phone")}
                    >
                        <Text style={styles.secBtnTxt}>{LoginLocal['ar'].loginViaPhone}</Text>
                    </Pressable>
                </>}
            </View>}
            {method === 'phone' && <View style={styles.container}>
                {otpSent ? <>
                    <View style={styles.inputContainer}>
                        {/* <Pressable onPress={() => setMethod("")}>
                            <AntDesign name="back" size={24} color="black" />
                        </Pressable> */}
                        <Text style={styles.firstText}>{LoginLocal['ar'].codeHasBeenSent} {loginForm.username}</Text>
                        {isNewRegester && <>
                            <TextInput style={styles.input} value={loginForm.name} placeholder={LoginLocal['ar'].name}
                                onChangeText={(e) => setLoginInForm((prev) => ({ ...prev, name: e }))} />
                        </>}
                        <TextInput style={styles.input} value={loginForm.password} placeholder={LoginLocal['ar'].otpPlaceHolder}
                            onChangeText={(e) => {
                                setLoginInForm((prev) => ({ ...prev, password: e }))
                                setError("")
                            }} />
                        {error && <Text style={styles.error}>{error}</Text>}
                    </View>
                    <Pressable
                        style={styles.prymaryBtn}
                        onPress={handleSignIn}

                    >
                        <Text style={styles.btnTxt}>{LoginLocal['ar'].login}</Text>
                    </Pressable>
                    <Pressable
                        style={styles.secBtn}
                        onPress={() => switchMethod("email")}
                    >
                        <Text style={styles.secBtnTxt}>{LoginLocal['ar'].loginViaEmail}</Text>
                    </Pressable>

                </> : <>
                    <View style={styles.inputContainer}>
                        {/* <Pressable onPress={() => setMethod("")}>
                            <AntDesign name="back" size={24} color="black" />
                        </Pressable> */}
                        <Text>{LoginLocal['ar'].phone}</Text>
                        <TextInput style={styles.input} value={loginForm.username} placeholder="966"
                            onChangeText={(e) => {
                                setLoginInForm((prev) => ({ ...prev, username: e }))
                                setError("")
                            }} />
                        {error && <Text style={styles.error}>{error}</Text>}

                    </View>

                    <Pressable
                        style={styles.mainBtn}
                        onPress={handleOtpRequest}
                    >
                        <Text style={styles.btnTxt}>{LoginLocal['ar'].otpButton}</Text>
                    </Pressable>
                    <Pressable
                        style={styles.secBtn}
                        onPress={() => switchMethod("email")}
                    >
                        <Text style={styles.secBtnTxt}>{LoginLocal['ar'].loginViaEmail}</Text>
                    </Pressable>
                </>}
            </View>}
            {!method && <>
                <View
                    style={styles.secContainer}
                >
                    <Pressable
                        style={styles.prymaryBtn}
                        onPress={() => setMethod("email")}

                    >
                        <Text style={styles.loginTxt}>{LoginLocal['ar'].loginViaEmail}</Text>
                    </Pressable>

                </View>
                <View
                    style={styles.secContainer}
                >
                    <Pressable
                        style={styles.prymaryBtn}
                        onPress={() => setMethod("phone")}
                    >
                        <Text style={styles.btnTxt}>{LoginLocal['ar'].loginViaPhone}</Text>
                    </Pressable>


                </View>
                <View style={styles.staticLinksContainer}>
                    <StaticLinks style={{ marginTop: 10 }} />
                </View>
            </>}


        </ScrollView>
    );
};

export default Login;

const styles = StyleSheet.create({
    scrollView: {
        padding: 10,
        flex: 1,
        backgroundColor: "white"
    },
    headerView: {
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 250,
        height: 100,
        resizeMode: "cover",
        borderRadius: 11,
        marginTop: 100,
    },
    firstText: {
        fontFamily: "CairoMed",
        fontSize: 13
    },
    prymaryBtn: {
        padding: 10,
        backgroundColor: "#55a8b9",
        borderRadius: 18,
        width: "95%",
        flex: 1,
    },
    secBtn: {
        padding: 10,
        backgroundColor: "#fff",
        borderColor: "#55a8b9",
        borderWidth: 1,
        borderRadius: 18,
        width: "95%",
        flex: 1,
        marginTop: 10
    },
    secBtnTxt: {
        fontFamily: "CairoBold",
        fontSize: 13,
        textAlign: "center",
        color: "#55a8b9"
    },
    btnTxt: {
        fontFamily: "CairoBold",
        fontSize: 13,
        textAlign: "center",
        color: "#fff"
    },
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
        padding: 10,
        fontFamily: "CairoMed",
        fontSize: 13,
        textAlign: "right"
    },
    mainBtn: {
        padding: 10,
        backgroundColor: "#55a8b9",
        borderRadius: 18,
        width: "95%",
        flex: 1,
    },
    error: {
        color: "red",
        fontSize: 14,
        fontFamily: "CairoBold",
        marginBottom: 12
    },
    secContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 12,
    },
    loginTxt: {
        textAlign: "center",
        color: "#fff",
        fontFamily: "CairoBold",
        fontSize: 13
    },
    staticLinksContainer: {
        marginTop: 25,
        width: "100%",
        alignItems: "center"
    }
});