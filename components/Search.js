import {
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { textAlign } from "../Utils/align";
import { LanguageContext } from "../context/langContext";

const Search = () => {
  const route = useRoute();
  const [search, setSearch] = useState(route?.params?.search || "");
  const navigation = useNavigation();
  const { lang } = useContext(LanguageContext)

  const handleSearch = () => {
    if (search.length > 3) {
      navigation.navigate("Search", {
        search: search,
      });
    }
  };
  return (
    <View
      style={{
        backgroundColor: "#55a8b9",
        height: 80,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        direction: "rtl",
        flexDirection: "row-reverse",
        position: "absolute",
        zIndex: 999,
        left: 0,
        width: "100%",
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
          direction: Platform.OS === "ios" ? "ltr" : "rtl",
          flexDirection: lang === 'en'? "row" : "row-reverse",
          position: "relative",
        }}
      >
        <TextInput
          placeholder={lang === 'en' ? "Search for Product" : "ابحث عن منتجك"}
          style={{
            paddingHorizontal: 5,
            fontFamily: "CairoMed",
            width: 300,
            height: 40,
            textAlign: textAlign(lang),
          }}
          value={search}
          onChangeText={(e) => setSearch(e)}
          onSubmitEditing={search.length > 3 && handleSearch}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 5,
            top: 8,
          }}
          onPress={handleSearch}
        >
          <AntDesign name="search1" size={22} color="black" />
        </TouchableOpacity>
      </Pressable>
    </View>
  );
};

export default Search;
