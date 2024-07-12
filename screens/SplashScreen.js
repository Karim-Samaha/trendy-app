import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation()
    useEffect(() => {
        // Simulate a loading process
        setTimeout(() => {
            navigation.navigate('Login'); // Replace 'Home' with your main screen name
        }, 3000); // Change the timeout duration as needed
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* <LottieView
                source={require('../assets/Animation - 1720513700623.json')} // Adjust the path to your animation file
                autoPlay
                loop
            /> */}
            <Image style={styles.imgContainer} source={require("../assets/spash-2.gif")} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff', // Adjust background color as needed
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    imgContainer: {
        backgroundColor: "red",
        backgroundColor: '#fff', // Adjust background color as needed
        width: "100%",
        height: "100%"
    },
});

export default SplashScreen;
