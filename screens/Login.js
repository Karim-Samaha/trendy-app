import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
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
import AntDesign from "@expo/vector-icons/AntDesign";
import StaticLinks from "../components/StaticLinks";

const Login = () => {
  const { userId, setUserId } = useContext(UserType);
  AntDesign;
  const route = useRoute();
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
  const [loginForm, setLoginInForm] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    let credentials = loginForm;
    await console.log({
      email: credentials.username,
      password: credentials.password,
    });
    await _axios
      .post(`${config.backendUrl}/auth/login`, {
        email: credentials.username.toLocaleLowerCase(),
        password: credentials.password,
      })
      .then(async (res) => {
        if (await res.data?.accessToken) {
          await AsyncStorage.setItem("user", JSON.stringify(res.data));
          await dispatch(handleLogin());
          if (route.params?.callbackScreen) {
            navigation.navigate("Cart");
          } else {
            navigation.navigate("Home");
          }
        } else {
          let apiResults = res?.error;
          console.log(res);
          if (apiResults.user?.error === "wrongCredintials") {
            setError("البيانات غير صحيحه");
          }
        }
      })
      .catch((err) => setError("البيانات غير صحيحه"));
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
            .post(`${config.backendUrl}/auth/generate-mail-otp`, {
              email: loginForm.username,
            })
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{
            width: 250,
            height: 100,
            resizeMode: "cover",
            borderRadius: 11,
            marginTop: 100,
          }}
          source={require("../assets/logo.png")}
        />
      </View>

      {method === "email" && (
        <View style={styles.container}>
          {otpSent ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={{ fontFamily: "CairoMed", fontSize: 13 }}>
                  تم ارسال رمز التحقق الي {loginForm.username}
                </Text>
                <TextInput
                  style={styles.input}
                  value={loginForm.password}
                  onChangeText={(e) =>
                    setLoginInForm((prev) => ({ ...prev, password: e }))
                  }
                />
                {error && <Text style={styles.error}>{error}</Text>}
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
                <Text
                  style={{
                    fontFamily: "CairoBold",
                    fontSize: 13,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  تسجيل الدخول
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                {/* <Pressable onPress={() => setMethod("")}>
                  <AntDesign name="back" size={24} color="black" />
                </Pressable> */}
                <Text style={{ fontFamily: "CairoMed", fontSize: 13 }}>
                  البريد الالكتروني
                </Text>
                <TextInput
                  style={styles.input}
                  value={loginForm.username}
                  onChangeText={(e) => {
                    setLoginInForm((prev) => ({ ...prev, username: e }));
                    setError("");
                  }}
                />
                {error && <Text style={styles.error}>{error}</Text>}
              </View>

              <Pressable style={styles.mainBtn} onPress={handleOtpRequest}>
                <Text
                  style={{
                    fontFamily: "CairoBold",
                    fontSize: 13,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  ارسال رمز التحقق
                </Text>
              </Pressable>
            </>
          )}
        </View>
      )}
      {method === "phone" && (
        <View style={styles.container}>
          {otpSent ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={{ fontFamily: "CairoMed", fontSize: 13 }}>
                  تم ارسال رمز التحقق الي {loginForm.username}
                </Text>
                <TextInput
                  style={styles.input}
                  value={loginForm.password}
                  onChangeText={(e) => {
                    setLoginInForm((prev) => ({ ...prev, password: e }));
                    setError("");
                  }}
                />
                {error && <Text style={styles.error}>{error}</Text>}
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
                <Text
                  style={{
                    fontFamily: "CairoBold",
                    fontSize: 13,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  تسجيل الدخول
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                {/* <Pressable onPress={() => setMethod("")}>
                  <AntDesign name="back" size={24} color="black" />
                </Pressable> */}
                <Text>رقم الجوال</Text>
                <TextInput
                  style={styles.input}
                  value={loginForm.username}
                  placeholder="966"
                  onChangeText={(e) => {
                    setLoginInForm((prev) => ({ ...prev, username: e }));
                    setError("");
                  }}
                />
                {error && <Text style={styles.error}>{error}</Text>}
              </View>

              <Pressable style={styles.mainBtn} onPress={handleOtpRequest}>
                <Text
                  style={{
                    fontFamily: "CairoBold",
                    fontSize: 13,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  ارسال رمز التحقق
                </Text>
              </Pressable>
            </>
          )}
        </View>
      )}
      {!method && (
        <>
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
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontFamily: "CairoBold",
                  fontSize: 13,
                }}
              >
                تسجيل الدخول عبر البريد الالكتروني
              </Text>
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
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 13,
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                تسجيل الدخول عبر الهاتف
              </Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 25, width: "100%", alignItems: "center" }}>
            <StaticLinks style={{ marginTop: 10 }} />
          </View>
        </>
      )}
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
    alignItems: "flex-end",
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
    marginBottom: 12,
  },
});
