import { useState } from "react";
import {
    View, Text, StyleSheet, Button, TextInput, Pressable
} from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const AddToCartForm = ({ formType }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimeVisible, setIsTimeVisible] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const hideTimePicker = () => {
        setIsTimeVisible(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };
    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: new Date(),
            handleConfirm,
            mode: currentMode,
            is24Hour: true,
        });
    };


    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text>تاريخ التوصيل (متاح من 2 الظهر الي 11م)</Text>
                <TextInput style={styles.input} onFocus={() => setDatePickerVisibility(true)} onBlur={() => setDatePickerVisibility(false)} />
            </View>
            <View style={styles.inputContainer}>
                <Text>وقت التوصيل ( من 2 الظهر الي 11م)</Text>
                <TextInput style={styles.input} onFocus={() => setIsTimeVisible(true)} onBlur={() => setIsTimeVisible(false)} />
            </View>
            <View style={styles.inputContainer}>
                <Text>نص البطاقة - اكتب إهدائك هنا ( + 6.00 ر.س )</Text>
                <TextInput style={{ ...styles.input, height: 150 }} multiline={true} />
            </View>
            <View style={styles.inputContainer}>
                <Text>العنوان</Text>
                <TextInput style={styles.input} />
            </View>
            {formType === "NORMAL" && <Pressable
                // onPress={() => addItemToCart(route?.params?.item)}
                onPress={() => null}
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
            </Pressable>}
            {formType === "GIFT" && <Pressable
                // onPress={() => addItemToCart(route?.params?.item)}
                onPress={() => null}
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
            </Pressable>}
            {console.log({deb: new Date()})}
            {isDatePickerVisible && <DateTimePicker
                isVisible={isDatePickerVisible}
                value={new Date()}
                minimumDate={new Date(2024, 5, 1)}
                mode="date"
                locale="ar" 
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />}

            {isTimeVisible && <DateTimePicker
                isVisible={isTimeVisible}
                value={new Date()}
                mode="time"
                onCancel={hideTimePicker}
            />
            }


        </View>
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
    }
});
