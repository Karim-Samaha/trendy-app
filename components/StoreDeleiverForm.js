import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Enable RTL layout direction

const StoreDeleiverForm = ({ storeDeleviryData, setStoreDeleviryData }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [errors, setErrors] = useState({
        deliveryDate: false,
        address: false,
        phone: false,
    });
    const handleDateConfirm = (date) => {
        const formatedDate = new Date(date.nativeEvent.timestamp).toISOString().split("T")[0]
        console.warn("A date has been picked: ", formatedDate.split("T")[0]);
        setStoreDeleviryData(prev => ({ ...prev, deliveryDate: formatedDate }))
        setErrors((prev) => ({ ...prev, deliveryDate: false }));
        setDatePickerVisibility(false)
        dateRef.current.blur()
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const dateRef = useRef()
    const validate = () => {
        let deliveryDate = true;
        let phone = true;
        let name = true;
        if (storeDeleviryData.deliveryDate.length <= 0) {
            setErrors((prev) => ({ ...prev, deliveryDate: true }));
            deliveryDate = false;
        }
        if (storeDeleviryData.name.length <= 0) {
            setErrors((prev) => ({ ...prev, name: true }));
            name = false;
        }
        if (storeDeleviryData.phone.length <= 0) {
            setErrors((prev) => ({ ...prev, phone: true }));
            phone = false;
        }
        if (deliveryDate && name && phone) {
            setStoreDeleviryData((prev) => ({ ...prev, valid: true }));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>الاسم</Text>
                <TextInput style={{ ...styles.input, backgroundColor: storeDeleviryData.valid ? "silver" : "#fff" }} placeholder="الاسم بالكامل" value={storeDeleviryData.name}
                    editable={!storeDeleviryData.valid}
                    onChangeText={(e) => {
                        setStoreDeleviryData(prev => ({ ...prev, name: e }))
                        setErrors((prev) => ({ ...prev, name: false }));
                    }} />
                {errors.name && <Text style={styles.error}>يجب ادخال الاسم</Text>}

            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>رقم الهاتف</Text>
                <TextInput style={{ ...styles.input, backgroundColor: storeDeleviryData.valid ? "silver" : "#fff" }} placeholder="966****" keyboardType="phone-pad"
                    value={storeDeleviryData.phone}
                    editable={!storeDeleviryData.valid}
                    onChangeText={(e) => {
                        setStoreDeleviryData(prev => ({ ...prev, phone: e }))
                        setErrors((prev) => ({ ...prev, phone: false }));
                        console.log("!")
                    }} />
                {errors.phone && <Text style={styles.error}>يجب ادخال رقم الهاتف</Text>}

            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>تاريخ الاستلام (متاح من 2 الظهر إلى 11 مساءً)</Text>
                <TextInput style={{ ...styles.input, backgroundColor: storeDeleviryData.valid ? "silver" : "#fff" }} placeholder="تاريخ الاستلام من المتجر"
                    editable={!storeDeleviryData.valid}
                    value={storeDeleviryData.deliveryDate}
                    onFocus={() => setDatePickerVisibility(true)} onBlur={() => setDatePickerVisibility(false)} />
                {errors.deliveryDate && <Text style={styles.error}>يجد تحديد تاريخ التوصيل</Text>}
            </View>
            {!storeDeleviryData.valid && <Pressable style={styles.button} onPress={validate} >
                <Text style={{ color: "#fff" }}>تأكيد البيانات</Text>
            </Pressable>}
            {storeDeleviryData.valid && <Pressable style={styles.button} onPress={() => setStoreDeleviryData((prev) => ({ ...prev, valid: false }))} >
                <Text style={{ color: "#fff" }}>تعديل البيانات</Text>
            </Pressable>}
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
        </View>
    );
};
export default StoreDeleiverForm

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlign: "right"
    },
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        width: '100%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#55a8b9',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    error: {
        color: "red",
        marginTop: 5,
        marginHorizontal: 8,
        fontSize: 16,
        fontWeight: "bold",
    },
});

