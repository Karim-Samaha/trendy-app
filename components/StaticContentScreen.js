import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Button,
  Pressable,
  Platform,
} from "react-native";
import React from "react";

import _axios from "../Utils/axios";

const StaticContentScreen = ({
  title,
  content,
  secContent,
  linkUrlText,
  linkUrl,
}) => {
  const openWhatsApp = () => {
    let url = linkUrl;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          alert("WhatsApp is not installed on your device");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error occurred", err));
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image style={styles.logoImg} source={require("../assets/logo.png")} />
      </View>
      <View>
        <Text style={styles.headerText}>{title}</Text>
        <Text style={styles.contentText}>
          {content}
          {linkUrl && linkUrlText && (
            <Pressable onPress={() => openWhatsApp()}>
              <Text style={styles.whatsText}>{linkUrlText}</Text>
            </Pressable>
          )}
        </Text>
        {secContent && <Text style={styles.contentText}>{secContent}</Text>}
      </View>
    </ScrollView>
  );
};

export default StaticContentScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "white",
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
    fontFamily: "CairoBold",
    textAlign: Platform.OS === "ios" && "right",
  },
  contentText: {
    padding: 10,
    fontSize: 13,
    fontFamily: "CairoMed",
    textAlign: Platform.OS === "ios" && "right",
  },
  whatsText: {
    color: "green",
    fontFamily: "CairoBold",
    paddingHorizontal: Platform.OS === "ios" ? 0 : 15,
    marginVertical: Platform.OS === "ios" ? 10 : 0,
    textAlign: Platform.OS === "ios" && "right",
  },
});
