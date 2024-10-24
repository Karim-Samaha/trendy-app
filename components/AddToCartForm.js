import { useContext, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { SelectList } from "react-native-dropdown-select-list";
import ProductAddsModal from "./ProductAddModal";
import { ProductForm } from "../constants/Locales";
import AddsItem from "./AddsItem";
import { LanguageContext } from "../context/langContext";
import { textAlign } from "../Utils/align";

// import DropDownPicker from 'react-native-dropdown-picker';

const AddToCartForm = ({ formType, product, setAddedToCart }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [selectedAdds, setSelectedAdds] = useState([]);
  const [dateVal, setDateVal] = useState(new Date());
  const [timeVal, setTimeVal] = useState(new Date());
  const dateRef = useRef();
  const timeRef = useRef();
  const [options, setOptions] = useState({
    color: "",
    text: "",
  });
  const colors = [
    { val: "red", text: "احمر" },
    { val: "white", text: "ابيض" },
    { val: "brown", text: "بني" },
    { val: "yellow", text: "اصفر" },
    { val: "rgba(0,0,0,0.5)", text: "شفاف" },
    { val: "green", text: "اخضر" },
    { val: "blue", text: "ازرق" },
    { val: "#0066CC", text: "كحلي" },
    { val: "#000", text: "اسود" },
    { val: "pink", text: "زهري" },
    { val: "silver", text: "فضي" },
    { val: "#FFD700", text: "ذهبي" },
  ];
  const [addressInputHeight, setAddressInputHeight] = useState(48);
  const [formValue, setFormValue] = useState({
    type: formType,
    deliveryDate: "",
    time: "",
    cardText: "",
    addressSelected: false,
    phone: "",
    address: "",
    giftAdd: "1",
    sentFrom: "",
    sentTo: "",
    giftLink: "",
  });

  function isTimeInFuture(timeString, dateString) {
    // Parse the time string
    const [period, time] = timeString.split(":");
    const [hours, minutes] = [parseInt(time, 10), parseInt(time.slice(-2), 10)];

    // Parse the date string
    const [year, month, day] = dateString.split("-").map(Number);

    // Create a Date object for the provided date
    const futureTime = new Date(year, month - 1, day);

    if (period === "AM") {
      futureTime.setHours(hours % 12, minutes, 0, 0);
    } else if (period === "PM") {
      futureTime.setHours((hours % 12) + 12, minutes, 0, 0);
    }

    // Get the current date and time
    const now = new Date();
    return futureTime > now;
  }
  const [errors, setErrors] = useState({
    deliveryDate: false,
    address: false,
    time: false,
    unvalidTime: false,
    phone: false,
    withGiftRequred: false,
  });
  const handleDateConfirm = async (date) => {
    setDatePickerVisibility(false);
    const formatedDate = new Date(date.nativeEvent.timestamp)
      .toISOString()
      .split("T")[0];
    setDateVal(new Date(date.nativeEvent.timestamp));
    setFormValue((prev) => ({ ...prev, deliveryDate: formatedDate }));
    setErrors((prev) => ({ ...prev, deliveryDate: false }));
  };
  const handleHoursToBecomeTwoDigits = (hourNum) => {
    if (!hourNum) return;
    let hourStr = `${hourNum}`;
    if (hourStr.length < 2) {
      hourStr = `0${hourNum}`;
    }
    return hourStr;
  };
  const handleTimeConfirm = (date) => {
    setIsTimeVisible(false);
    const formatedDate = new Date(date.nativeEvent.timestamp);
    var hours = formatedDate.getHours();
    var minutes = formatedDate.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime =
      ampm + ":" + handleHoursToBecomeTwoDigits(hours) + ":" + minutes;
    setFormValue((prev) => ({ ...prev, time: strTime }));
    setErrors((prev) => ({ ...prev, time: false, unvalidTime: false }));
  };
  const dispatch = useDispatch();
  const addItemToCart = (item, formValue) => {
    const itemToBeAdded = {
      formInfo: { ...formValue, type: formType },
      selectedCard: [...selectedAdds],
      ...item,
      // id: item?._id
    };
    setAddedToCart(true);
    dispatch(addToCart(itemToBeAdded));
  };

  const validate = () => {
    let deliveryDate = true;
    let address = true;
    let phone = true;
    let unvalidTime = true;
    let withGiftRequred = true;
    if (formValue.deliveryDate.length <= 0) {
      setErrors((prev) => ({ ...prev, deliveryDate: true }));
      deliveryDate = false;
    }
    if (formValue.phone.length <= 0) {
      setErrors((prev) => ({ ...prev, phone: true }));
      phone = false;
    }
    if (formValue.addressSelected && formValue.address.length <= 0) {
      setErrors((prev) => ({ ...prev, address: true }));
      address = false;
    }
    if (formValue.time.length <= 0) {
      setErrors((prev) => ({ ...prev, time: true }));
      address = false;
    }
    if (giftSelect !== "1" && selectedAdds.length === 0) {
      setErrors((prev) => ({ ...prev, withGiftRequred: true }));
      withGiftRequred = false;
    }
    {
      console.log({ test: formValue.giftAdd });
    }
    if (!isTimeInFuture(formValue.time, formValue.deliveryDate)) {
      setErrors((prev) => ({ ...prev, unvalidTime: true }));
      unvalidTime = false;
    }
    return deliveryDate && phone && address && withGiftRequred && unvalidTime;
  };
  const validateAndAddToCart = async (item, formValue) => {
    let isValid = validate();
    if (isValid) addItemToCart(item, formValue);
  };
  const [giftSelect, setGiftSelected] = useState("بدون اضافات");
  const [giftsModal, setGiftsModal] = useState(false);
  function randomNum() {
    let digits = "0123456789";
    let OTP = "";
    let len = digits.length;
    for (let i = 0; i < 5; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }

    return OTP;
  }
  const handleSelectAdd = (item) => {
    const isIncluded = selectedAdds.find((prev) => prev?._id === item?._id);
    // if (isIncluded?._id) return null
    let num = randomNum();
    setSelectedAdds((prev) => [
      ...prev,
      {
        ...item,
        _id: `${num}-${item?._id}`,
        cartId: `${num}-${item?._id}`,
        quantity: 1,
      },
    ]);
    setGiftsModal(false);
  };

  const handleSelectAddQty = (id, type) => {
    let item = selectedAdds.find((prev) => prev?._id === id);
    let quantity = item.quantity;
    if (type === "add") {
      quantity += 1;
      console.log("111");
    } else if (type === "deduct" && item.quantity > 1) {
      quantity -= 1;
    }
    item.quantity = quantity;
    const newSetOfAdds = selectedAdds.map((prev) => {
      if (prev?._id === id) return item;
      return prev;
    });
    setSelectedAdds(newSetOfAdds);
  };
  const deleteAdd = (id) => {
    const newAdds = selectedAdds.filter((item) => item._id !== id);
    setSelectedAdds(newAdds);
  };
  const handleSlectedGiftOptions = (id, option, val) => {
    let item = selectedAdds?.find((item) => item?.cartId === id);
    item[option] = val;
    const newItems = selectedAdds?.map((prevItem) => {
      if (item?.cartId === prevItem?.cartId) {
        return item;
      } else {
        return prevItem;
      }
    });
    setSelectedAdds(newItems);
  };
  const data = [
    { key: "1", value: "بدون اضافات" },
    { key: "2", value: "كروت اهداء" },
    { key: "3", value: "شوكولاته بلجيكية" },
    { key: "4", value: "بالونات" },
    { key: "5", value: "تغريسات" },
    { key: "6", value: "قسائم شرائية" },
  ];
  const { lang } = useContext(LanguageContext)

  return (
    <View style={styles.container}>
      {formType === "GIFT" && (
        <View style={styles.inputContainer}>
          <Text style={{...styles.label, textAlign: textAlign(lang)}}>{ProductForm[lang].senderName}</Text>
          <TextInput
            style={{...styles.input, textAlign: textAlign(lang)}}
            value={formValue.sentFrom}
            onChangeText={(e) => {
              setFormValue((prev) => ({ ...prev, sentFrom: e }));
            }}
          />
        </View>
      )}
      {formType === "GIFT" && (
        <View style={styles.inputContainer}>
          <Text style={{...styles.label, textAlign: textAlign(lang)}}>{ProductForm[lang].reciverName}</Text>
          <TextInput
            style={{...styles.input, textAlign: textAlign(lang)}}
            value={formValue.sentTo}
            onChangeText={(e) => {
              setFormValue((prev) => ({ ...prev, sentTo: e }));
            }}
          />
        </View>
      )}
      <View style={styles.inputContainer}>
        <Text style={{...styles.label, textAlign: textAlign(lang)}}>{ProductForm[lang].date}</Text>
        {Platform.OS === "ios" ? (
          <>
            <Pressable
              onPress={() => setDatePickerVisibility(true)}
              style={{...styles.input, textAlign: textAlign(lang)}}
            >
              <Text style={styles.dateVal}>{formValue.deliveryDate}</Text>
            </Pressable>
            {isDatePickerVisible && (
              <View
                style={{
                  width: "100%",
                }}
              >
                <DateTimePicker
                  value={dateVal}
                  mode="date"
                  locale="ar"
                  onChange={handleDateConfirm}
                  display="inline"
                  minimumDate={new Date()}
                />
              </View>
            )}
          </>
        ) : (
          <Pressable
            onPress={() => setDatePickerVisibility(true)}
            style={{...styles.input, textAlign: textAlign(lang)}}
          >
            <Text style={styles.dateVal}>{formValue.deliveryDate}</Text>
          </Pressable>
        )}
        {errors.deliveryDate && (
          <Text style={{...styles.error, textAlign: textAlign(lang)}}>{ProductForm[lang].dateError}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={{...styles.label, textAlign: textAlign(lang)}}>{ProductForm[lang].time}</Text>

        {Platform.OS === "ios" ? (
          <>
            <Pressable
              onPress={() => setIsTimeVisible(true)}
              style={{...styles.input, textAlign: textAlign(lang)}}
            >
              <Text style={styles.dateVal}>{formValue.time}</Text>
            </Pressable>
            {isTimeVisible && (
              <DateTimePicker
                isVisible={timeVal}
                value={new Date()}
                mode="time"
                display="spinner"
                minimumDate={new Date()}
                onChange={handleTimeConfirm}
              />
            )}
          </>
        ) : (
          <Pressable
            onPress={() => setIsTimeVisible(true)}
            style={{...styles.input, textAlign: textAlign(lang)}}
          >
            <Text style={styles.dateVal}>{formValue.time}</Text>
          </Pressable>
        )}
      </View>
      {errors.time && (
        <Text style={{...styles.error, textAlign: textAlign(lang)}}>{ProductForm[lang].timeError}</Text>
      )}
      {errors.unvalidTime && (
        <Text style={{...styles.error, textAlign: textAlign(lang)}}>{ProductForm[lang].unvalidTimeError}</Text>
      )}
      <View style={styles.inputContainer}>
        <Text style={{...styles.label, textAlign: textAlign(lang)}}>{ProductForm[lang].phone}</Text>
        <TextInput
          style={{ ...styles.input, textAlignVertical: "top", textAlign: textAlign(lang) }}
          multiline={true}
          value={formValue.phone}
          keyboardType="numeric"
          onChangeText={(e) => {
            setErrors((prev) => ({ ...prev, phone: false }));
            setFormValue((prev) => ({ ...prev, phone: e }));
          }}
          placeholder={lang === "en" ? "Mobile Number" : "رقم الجوال"}
        />
        {errors.phone && (
          <Text style={{...styles.error, textAlign: textAlign(lang)}}>{ProductForm[lang].phoneError}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={{...styles.label, textAlign: textAlign(lang)}}>{ProductForm[lang].cardText}</Text>
        <TextInput
          style={{ ...styles.input, height: 150, textAlignVertical: "top", textAlign: textAlign(lang) }}
          multiline={true}
          value={formValue.cardText}
          onChangeText={(e) =>
            setFormValue((prev) => ({ ...prev, cardText: e }))
          }
          numberOfLines={10}
        />
      </View>
      <View style={{ ...styles.inputContainer, ...styles.checkboxContainer }}>
        <Text
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
            ...styles.label,
            textAlign: textAlign(lang),
            fontSize: 12,
          }}
        >
          {ProductForm[lang].noAddressSelect}
        </Text>
        <Checkbox
          value={!formValue.addressSelected}
          onValueChange={(e) =>
            setFormValue((prev) => ({ ...prev, addressSelected: !e }))
          }
        />
      </View>

      {formValue.addressSelected && (
        <View style={styles.inputContainer}>
          <Text style={{...styles.label, textAlign: textAlign(lang)}}>{ProductForm[lang].address}</Text>
          <TextInput
            style={{
              ...styles.input,
              height: addressInputHeight,
              textAlignVertical: "top",
              minHeight: 48,
              maxHeight: 150,
              marginBottom: Platform.OS === "ios" ? 30: 0,
              textAlign: textAlign(lang)
            }}
            value={formValue.address}
            onChangeText={(e) => {
              setFormValue((prev) => ({ ...prev, address: e }));
              setErrors((prev) => ({ ...prev, address: false }));
            }}
            numberOfLines={10}
            multiline={true}
            onContentSizeChange={(event) =>
              setAddressInputHeight(event.nativeEvent.contentSize.height)
            }
            placeholder={"يفضل كتابة العنوان مختصر"}
          />
          {errors.address && formValue.addressSelected && (
            <Text style={{...styles.error, textAlign: textAlign(lang)}}>{ProductForm[lang].addressError}</Text>
          )}
        </View>
      )}
      <View style={styles.inputContainer}>
        <Text style={{...styles.label, textAlign: textAlign(lang)}}>{ProductForm[lang].productAdds}</Text>
        <SelectList
          setSelected={(val) => {
            setErrors((prev) => ({ ...prev, withGiftRequred: false }));
            setGiftSelected(val);
          }}
          data={data}
          save="value"
          defaultOption={data[0]}
          placeholder={" "}
          search={false}
          boxStyles={{
            flexDirection: "row-reverse",
            fontFamily: "CairoMed",
          }}
          dropdownTextStyles={{
            textAlign: "right",
          }}
        />
        {errors.withGiftRequred && (
          <Text style={{ ...styles.error, marginTop: 10, textAlign: textAlign(lang) }}>
            {ProductForm[lang].giftRequiredError}
          </Text>
        )}
        {formType === "GIFT" && (
          <View style={styles.inputContainer}>
            <Text style={{...styles.label, textAlign: textAlign(lang)}}>{ProductForm[lang].video}</Text>
            <TextInput
              style={{...styles.input, textAlign: textAlign(lang)}}
              value={formValue.giftLink}
              onChangeText={(e) => {
                setFormValue((prev) => ({ ...prev, giftLink: e }));
              }}
            />
          </View>
        )}
        {giftSelect === "كروت اهداء" && (
          <Pressable
            onPress={() => setGiftsModal(true)}
            style={styles.extraPurchaseBtn}
          >
            <View>
              <Text style={{ color: "#fff", ...styles.label, textAlign: textAlign(lang) }}>
                {ProductForm[lang].cardsSelect}
              </Text>
            </View>
          </Pressable>
        )}
        {giftSelect === "شوكولاته بلجيكية" && (
          <Pressable
            onPress={() => setGiftsModal(true)}
            style={styles.extraPurchaseBtn}
          >
            <View>
              <Text style={{ color: "#fff", ...styles.label, textAlign: textAlign(lang) }}>
                {ProductForm[lang].cheoSelect}
              </Text>
            </View>
          </Pressable>
        )}
        {giftSelect === "بالونات" && (
          <Pressable
            onPress={() => setGiftsModal(true)}
            style={styles.extraPurchaseBtn}
          >
            <View>
              <Text style={{ color: "#fff", ...styles.label, textAlign: textAlign(lang) }}>
                {ProductForm[lang].ballonsSelect}
              </Text>
            </View>
          </Pressable>
        )}
        {giftSelect === "تغريسات" && (
          <Pressable
            onPress={() => setGiftsModal(true)}
            style={styles.extraPurchaseBtn}
          >
            <View>
              <Text style={{ color: "#fff", ...styles.label , textAlign: textAlign(lang)}}>
                {ProductForm[lang].sticksSelect}
              </Text>
            </View>
          </Pressable>
        )}
        {giftSelect === "قسائم شرائية" && (
          <Pressable
            onPress={() => setGiftsModal(true)}
            style={styles.extraPurchaseBtn}
          >
            <View>
              <Text style={{ color: "#fff", ...styles.label, textAlign: textAlign(lang) }}>
                {ProductForm[lang].giftCardSelect}
              </Text>
            </View>
          </Pressable>
        )}
        <ProductAddsModal
          show={giftsModal}
          close={() => setGiftsModal(false)}
          category={giftSelect}
          handleSelectAdd={handleSelectAdd}
        />
        {selectedAdds.length > 0 ? (
          <View style={styles.addsContainer}>
            {selectedAdds.map((item) => {
              return (
                <AddsItem
                  key={item?._id}
                  item={item}
                  handleSelectAddQty={handleSelectAddQty}
                  deleteAdd={deleteAdd}
                  handleSlectedGiftOptions={handleSlectedGiftOptions}
                />
              );
            })}
          </View>
        ) : null}
      </View>
      {formType === "NORMAL_ORDER" && (
        <Pressable
          onPress={() => validateAndAddToCart(product, formValue)}
          style={styles.extraPurchaseBtn}
        >
          <View>
            <Text style={{ color: "#fff", ...styles.label, textAlign: textAlign(lang)  }}>
              {ProductForm[lang].addToCart}
            </Text>
          </View>
        </Pressable>
      )}
      {formType === "GIFT" && (
        <Pressable
          onPress={() => validateAndAddToCart(product, formValue)}
          style={styles.extraPurchaseBtn}
        >
          <View>
            <Text style={{ color: "#fff", ...styles.label, textAlign: textAlign(lang)  }}>
              {ProductForm[lang].giftAdd}
            </Text>
          </View>
        </Pressable>
      )}

      {isDatePickerVisible && (
        <DateTimePicker
          value={dateVal}
          mode="date"
          locale="ar"
          onChange={handleDateConfirm}
          minimumDate={new Date()}
        />
      )}

      {isTimeVisible && (
        <DateTimePicker
          isVisible={timeVal}
          value={new Date()}
          mode="time"
          minimumDate={new Date()}
          onChange={handleTimeConfirm}
        />
      )}
    </View>
  );
};

export default AddToCartForm;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  inputContainer: {
    width: "100%",
    direction: "ltr",
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
  },
  checkboxContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  label: {
    fontFamily: "CairoMed",
  },
  error: {
    color: "red",
    marginTop: -5,
    marginBottom: 5,
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  addsContainer: {},
  addsItem: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#55a8b9",
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
    marginBottom: 5,
  },
  addsController: {
    flexDirection: "row-reverse",
    marginVertical: 10,
  },
  extraPurchaseBtn: {
    backgroundColor: "#55a8b9",
    padding: 10,
    borderRadius: 10,
    width: 150,
    marginLeft: "auto",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  editTimes: {
    position: "absolute",
    backgroundColor: "#55a8b9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: "41%",
    height: 48,
    paddingHorizontal: 20,
    borderTopStartRadius: 11,
    borderBottomStartRadius: 11,
  },
  editText: {
    fontFamily: "CairoBold",
    color: "#fff",
  },
  dateVal: {
    fontFamily: "CairoBold",
    color: "#000",
    textAlign: "right",
  },
});
