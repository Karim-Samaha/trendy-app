import { useEffect, useRef, useState } from "react";
import {
    View, Text, StyleSheet, Button, TextInput, Pressable,
} from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import AddToCartMessage from "./AddToCartMessage";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { SelectList } from 'react-native-dropdown-select-list'

const AddToCartForm = ({ formType, product }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimeVisible, setIsTimeVisible] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false)
    const dateRef = useRef()
    const timeRef = useRef()
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
        const formatedDate = new Date(date.nativeEvent.timestamp).toISOString().split("T")[0]
        console.warn("A date has been picked: ", formatedDate.split("T")[0]);
        setFormValue(prev => ({ ...prev, deliveryDate: formatedDate }))
        setDatePickerVisibility(false)
        dateRef.current.blur()
        setErrors((prev) => ({ ...prev, deliveryDate: false }));
    };
    const handleTimeConfirm = (date) => {
        const formatedDate = new Date(date.nativeEvent.timestamp)
        var hours = formatedDate.getHours();
        var minutes = formatedDate.getMinutes();
        var ampm = hours >= 12 ? 'م' : 'ص';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        setFormValue(prev => ({ ...prev, time: strTime }))
        setIsTimeVisible(false)
        timeRef.current.blur()
        setErrors((prev) => ({ ...prev, time: false }));
    };
    const dispatch = useDispatch()
    const addItemToCart = (item, formValue) => {
        const itemToBeAdded = {
            formInfo: { ...formValue, type: formType },
            selectedCard: {},
            ...item
            // id: item?._id
        }
        setAddedToCart(true);
        dispatch(addToCart(itemToBeAdded));
    };
    useEffect(() => {
        if (addedToCart) {
            setTimeout(() => {
                setAddedToCart(false);
            }, 3000);
        }
    }, [addedToCart])
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

    const data = [
        { key: '1', value: 'كروت اهداء' },
        { key: '2', value: 'شيكولاتة بلجيكية' },
        { key: '3', value: 'بالونات' },

    ]

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text>تاريخ التوصيل (متاح من 2 الظهر الي 11م)</Text>
                <TextInput style={styles.input} value={formValue.deliveryDate}
                    ref={dateRef}
                    onFocus={() => setDatePickerVisibility(true)} onBlur={() => setDatePickerVisibility(false)} />
                {errors.deliveryDate && <Text style={styles.error}>يجد تحديد تاريخ التوصيل</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text>وقت التوصيل ( من 2 الظهر الي 11م)</Text>
                <TextInput style={styles.input} value={formValue.time}
                    ref={timeRef}
                    onFocus={() => setIsTimeVisible(true)} onBlur={() => setIsTimeVisible(false)} />
                {errors.time && <Text style={styles.error}>يجد تحديد وقت التوصيل</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text>نص البطاقة - اكتب إهدائك هنا ( + 6.00 ر.س )</Text>
                <TextInput style={{ ...styles.input, height: 150 }} multiline={true}
                    value={formValue.cardText}
                    onChangeText={e => setFormValue(prev => ({ ...prev, cardText: e }))
                    } />
            </View>
            <View style={{ ...styles.inputContainer, ...styles.checkboxContainer }}>
                <Text style={{ marginHorizontal: 10, marginVertical: 10 }}>لا اريد نحديد العنوان (فريق الدعم سيتواصل مع المستلم)</Text>
                <Checkbox value={!formValue.addressSelected}
                    onValueChange={(e) => setFormValue(prev => ({ ...prev, addressSelected: !e }))}
                />
            </View>

            {formValue.addressSelected && <View style={styles.inputContainer}>
                <Text>العنوان</Text>
                <TextInput style={styles.input}
                    value={formValue.address}
                    onChangeText={e => {
                        setFormValue(prev => ({ ...prev, address: e }))
                        setErrors((prev) => ({ ...prev, address: false }));
                    }
                    } />
                {errors.address && formValue.addressSelected && < Text style={styles.error}>يجد تحديد العنوان</Text>}
            </View>}
            {formType === 'GIFT' && <View style={styles.inputContainer}>
                <Text>اضافات الورود</Text>
                <SelectList
                    setSelected={(val) => setGiftSelected(val)}
                    data={data}
                    save="value"
                    defaultOption={data[0]}
                    placeholder={" "}
                    search={false}
                />
                {(giftSelect === 'كروت اهداء' || giftSelect === '1') && <Pressable
                    onPress={() => null}
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
                        <Text style={{ color: "#fff" }}>اختيار كروت الاهداء</Text>
                    </View>
                </Pressable>}
                {giftSelect === 'شيكولاتة بلجيكية' && <Pressable
                    onPress={() => null}
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
                        <Text style={{ color: "#fff" }}>اختيار شيكولاتة</Text>
                    </View>
                </Pressable>}
                {giftSelect === 'بالونات' && <Pressable
                    onPress={() => null}
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
                        <Text style={{ color: "#fff" }}>اختيار بالونات</Text>
                    </View>
                </Pressable>}
            </View>}
            {formType === "NORMAL_ORDER" && <Pressable
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
                    <Text style={{ color: "#fff" }}>اضف الي السلة</Text>
                </View>
            </Pressable>
            }
            {
                formType === "GIFT" && <Pressable
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
                        <Text style={{ color: "#fff" }}>شراء كهديه</Text>
                    </View>
                </Pressable>
            }
            {
                isDatePickerVisible && <DateTimePicker
                    isVisible={isDatePickerVisible}
                    value={new Date()}
                    minimumDate={new Date(2024, 5, 1)}
                    mode="date"
                    locale="ar"
                    onChange={handleDateConfirm}
                    onCancel={hideDatePicker}
                />
            }

            {
                isTimeVisible && <DateTimePicker
                    isVisible={isTimeVisible}
                    value={new Date()}
                    mode="time"
                    onChange={handleTimeConfirm}
                    onCancel={hideTimePicker}
                />
            }
            {addedToCart && <AddToCartMessage product={product} />}
        </View >
    )
}

export default AddToCartForm

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
    },
    checkboxContainer: {
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row"
    },
    error: {
        color: "red",
        marginTop: -5,
        marginBottom: 5,
        marginHorizontal: 8,
        fontSize: 16,
        fontWeight: "bold",
    }
});
