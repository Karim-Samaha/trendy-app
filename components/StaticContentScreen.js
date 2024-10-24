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
import React, { useContext } from "react";

import _axios from "../Utils/axios";
import { textAlign } from "../Utils/align";
import { LanguageContext } from "../context/langContext";

const StaticContentScreen = ({
  title,
  content,
  secContent,
  linkUrlText,
  linkUrl,
}) => {
  const { lang } = useContext(LanguageContext)

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
        <Text style={{...styles.headerText, textAlign: textAlign(lang)}}>{title}</Text>
        <Text style={{...styles.contentText, textAlign: textAlign(lang)}}>
          {content}
          {linkUrl && linkUrlText && (
            <Pressable onPress={() => openWhatsApp()}>
              <Text style={{...styles.whatsText, textAlign: textAlign(lang)}}>{linkUrlText}</Text>
            </Pressable>
          )}
        </Text>
        {secContent && <Text style={{...styles.contentText, textAlign: textAlign(lang)}}>{secContent}</Text>}
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
  },
  contentText: {
    padding: 10,
    fontSize: 13,
    fontFamily: "CairoMed",
  },
  whatsText: {
    color: "green",
    fontFamily: "CairoBold",
    paddingHorizontal: Platform.OS === "ios" ? 0 : 15,
    marginVertical: Platform.OS === "ios" ? 10 : 0,
  },
});
