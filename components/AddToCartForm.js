import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { SelectList } from "react-native-dropdown-select-list";
import ProductAddsModal from "./ProductAddModal";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// import DropDownPicker from 'react-native-dropdown-picker';

const AddToCartForm = ({ formType, product, setAddedToCart }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [selectedAdds, setSelectedAdds] = useState([]);
  const dateRef = useRef();
  const timeRef = useRef();
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setIsTimeVisible(false);
  };

  const [formValue, setFormValue] = useState({
    type: formType,
    deliveryDate: "",
    time: "",
    cardText: "",
    addressSelected: true,
    address: "",
    giftAdd: "1",
    sentFrom: "",
    sentTo: "",
    giftLink: "",
  });
  const [errors, setErrors] = useState({
    deliveryDate: false,
    address: false,
    time: false,
  });
  const handleDateConfirm = (date) => {
    const formatedDate = new Date(date.nativeEvent.timestamp)
      .toISOString()
      .split("T")[0];
    console.warn("A date has been picked: ", formatedDate.split("T")[0]);
    setFormValue((prev) => ({ ...prev, deliveryDate: formatedDate }));
    setDatePickerVisibility(false);
    dateRef.current.blur();
    setErrors((prev) => ({ ...prev, deliveryDate: false }));
  };
  const handleTimeConfirm = (date) => {
    const formatedDate = new Date(date.nativeEvent.timestamp);
    var hours = formatedDate.getHours();
    var minutes = formatedDate.getMinutes();
    var ampm = hours >= 12 ? "م" : "ص";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    setFormValue((prev) => ({ ...prev, time: strTime }));
    setIsTimeVisible(false);
    timeRef.current.blur();
    setErrors((prev) => ({ ...prev, time: false }));
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
    if (formValue.deliveryDate.length <= 0) {
      setErrors((prev) => ({ ...prev, deliveryDate: true }));
      deliveryDate = false;
    }
    if (formValue.addressSelected && formValue.address.length <= 0) {
      setErrors((prev) => ({ ...prev, address: true }));
      address = false;
    }
    if (formValue.time.length <= 0) {
      setErrors((prev) => ({ ...prev, time: true }));
      address = false;
    }
    return deliveryDate && address;
  };
  const validateAndAddToCart = async (item, formValue) => {
    let isValid = validate();
    if (isValid) addItemToCart(item, formValue);
  };
  const [giftSelect, setGiftSelected] = useState("كروت اهداء");
  const [giftsModal, setGiftsModal] = useState(false);
  const handleSelectAdd = (item) => {
    const isIncluded = selectedAdds.find((prev) => prev?._id === item?._id);
    if (isIncluded?._id) return null;
    setSelectedAdds((prev) => [...prev, { ...item, quantity: 1 }]);
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
  const data = [
    { key: "1", value: "كروت اهداء" },
    { key: "2", value: "شيكولاتة بلجيكية" },
    { key: "3", value: "بالونات" },
  ];

  return (
    <View style={styles.container}>
      {formType === "GIFT" && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>اسم المرسل</Text>
          <TextInput
            style={styles.input}
            value={formValue.sentFrom}
            onChangeText={(e) => {
              setFormValue((prev) => ({ ...prev, sentFrom: e }));
            }}
          />
        </View>
      )}
      {formType === "GIFT" && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>اسم المرسل اليه</Text>
          <TextInput
            style={styles.input}
            value={formValue.sentTo}
            onChangeText={(e) => {
              setFormValue((prev) => ({ ...prev, sentTo: e }));
            }}
          />
        </View>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          تاريخ التوصيل (متاح من 2 الظهر الي 11م)
        </Text>
        <TextInput
          style={styles.input}
          value={formValue.deliveryDate}
          ref={dateRef}
          //   onFocus={() => setDatePickerVisibility(true)}
          //   onBlur={() => setDatePickerVisibility(false)}
          onChangeText={(e) => {
            setFormValue((prev) => ({ ...prev, deliveryDate: e }));
          }}
        />
        {errors.deliveryDate && (
          <Text style={styles.error}>يجد تحديد تاريخ التوصيل</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>وقت التوصيل ( من 2 الظهر الي 11م)</Text>
        <TextInput
          style={styles.input}
          value={formValue.time}
          ref={timeRef}
          onFocus={() => setIsTimeVisible(true)}
          onBlur={() => setIsTimeVisible(false)}
          onChangeText={(e) => {
            setFormValue((prev) => ({ ...prev, time: e }));
          }}
        />
        {errors.time && <Text style={styles.error}>يجد تحديد وقت التوصيل</Text>}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          نص البطاقة - اكتب إهدائك هنا ( + 6.00 ر.س )
        </Text>
        <TextInput
          style={{ ...styles.input, height: 150, textAlignVertical: "top" }}
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
            fontSize: 12,
          }}
        >
          لا اريد نحديد العنوان (فريق الدعم سيتواصل مع المستلم)
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
          <Text style={styles.label}>العنوان</Text>
          <TextInput
            style={styles.input}
            value={formValue.address}
            onChangeText={(e) => {
              setFormValue((prev) => ({ ...prev, address: e }));
              setErrors((prev) => ({ ...prev, address: false }));
            }}
          />
          {errors.address && formValue.addressSelected && (
            <Text style={styles.error}>يجد تحديد العنوان</Text>
          )}
        </View>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>اضافات الورود</Text>
        <SelectList
          setSelected={(val) => setGiftSelected(val)}
          data={data}
          save="value"
          defaultOption={data[0]}
          placeholder={" "}
          search={false}
          boxStyles={{ flexDirection: "row-reverse", fontFamily: "CairoMed" }}
        />
        {formType === "GIFT" && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ارفاق رابط (فيديو او صوت)</Text>
            <TextInput
              style={styles.input}
              value={formValue.giftLink}
              onChangeText={(e) => {
                setFormValue((prev) => ({ ...prev, giftLink: e }));
              }}
            />
          </View>
        )}
        {(giftSelect === "كروت اهداء" || giftSelect === "1") && (
          <Pressable
            onPress={() => setGiftsModal(true)}
            style={{
              backgroundColor: "#55a8b9",
              padding: 10,
              borderRadius: 10,
              width: 150,
              marginLeft: "auto",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <View>
              <Text style={{ color: "#fff", ...styles.label }}>
                اختيار كروت الاهداء
              </Text>
            </View>
          </Pressable>
        )}
        {giftSelect === "شيكولاتة بلجيكية" && (
          <Pressable
            onPress={() => setGiftsModal(true)}
            style={{
              backgroundColor: "#55a8b9",
              padding: 10,
              borderRadius: 10,
              width: 150,
              marginLeft: "auto",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <View>
              <Text style={{ color: "#fff", ...styles.label }}>
                اختيار شيكولاتة
              </Text>
            </View>
          </Pressable>
        )}
        {giftSelect === "بالونات" && (
          <Pressable
            onPress={() => setGiftsModal(true)}
            style={{
              backgroundColor: "#55a8b9",
              padding: 10,
              borderRadius: 10,
              width: 150,
              marginLeft: "auto",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <View>
              <Text style={{ color: "#fff", ...styles.label }}>
                اختيار بالونات
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
                <View style={styles.addsItem} key={item?._id}>
                  <Text style={{ ...styles.label, fontSize: 12 }}>
                    {item?.name}
                  </Text>
                  <View style={styles.addsController}>
                    <Pressable
                      style={{ marginHorizontal: 10 }}
                      onPress={() => handleSelectAddQty(item?._id, "add")}
                    >
                      <Feather name="plus" size={24} color="black" />
                    </Pressable>
                    <Text style={styles.label}>{item?.quantity}</Text>
                    <Pressable
                      style={{ marginHorizontal: 10 }}
                      onPress={() => handleSelectAddQty(item?._id, "deduct")}
                    >
                      <AntDesign name="minus" size={24} color="black" />
                    </Pressable>
                  </View>
                  <Pressable onPress={() => deleteAdd(item?._id)}>
                    <Text style={{ color: "red", ...styles.label }}>مسح</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
      {formType === "NORMAL_ORDER" && (
        <Pressable
          onPress={() => validateAndAddToCart(product, formValue)}
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
            <Text style={{ color: "#fff", ...styles.label }}>
              اضف الي السلة
            </Text>
          </View>
        </Pressable>
      )}
      {formType === "GIFT" && (
        <Pressable
          onPress={() => validateAndAddToCart(product, formValue)}
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
            <Text style={{ color: "#fff", ...styles.label }}>شراء كهديه</Text>
          </View>
        </Pressable>
      )}
      {isDatePickerVisible && (
        <DateTimePicker
          isVisible={isDatePickerVisible}
          value={new Date()}
          minimumDate={new Date(2024, 5, 1)}
          mode="date"
          locale="ar"
          onChange={handleDateConfirm}
          onCancel={hideDatePicker}
        />
      )}
      {isTimeVisible && (
        <DateTimePicker
          isVisible={isTimeVisible}
          value={new Date()}
          mode="time"
          onChange={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
      )}
    </View>
  );
};

export default AddToCartForm;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-end",
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
    textAlign: "right",
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
});
