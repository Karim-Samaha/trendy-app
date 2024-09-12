import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { WebView } from 'react-native-webview';
import { config } from "./config";
// import { getQueryParam } from "../Utils/getQueryParams";

const Payment = () => {
    const navigation = useNavigation();
    const route = useRoute();
    // console.log({deb: route.params.})
    const getPaymentWebviewUrl = () => {
        if (route?.params?.paymentUrl) {
            // Gateway WebView URL
            return route?.params?.paymentUrl
        } else {
            // Moysar Widget
            return `${config.backendBase}/payment?token=${route.params?.user?.accessToken}&amount=${route.params?.amount}&mobileSessionId=${route.params?.mobileSessionId}`
        }
    }
    const getQueryParam = (url, param) => {
        const queryString = url.split('?')[1];
        if (!queryString) return null;
        const params = queryString.split('&');
        for (let i = 0; i < params.length; i++) {
            const pair = params[i].split('=');
            if (pair[0] === param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    };
    const checkPaymentFromGateway = async (navState) => {
        if (route.params?.method === "CC") {
            const id = getQueryParam(navState.url, 'id');
            await axios
                .get(
                    `${config.backendUrl}/check-payment-status/${id}?source=app`
                )
                .then((response) => {
                    if (response.data?.data?.status === 'paid') {
                        navigation.navigate("OrderHistory", { callback: "purchase" })
                    }
                })
                .catch((err) => console.error(err));
        } else if (route.params?.method === 'TABBY') {
            const tabbyId = getQueryParam(navState.url, 'payment_id');
            const tabbySessionId = route?.params?.tabbySessionId
            await axios
                .get(
                    `${config.backendUrl}/check-tabby-status/${tabbyId}?session=${tabbySessionId}&source=app`
                )
                .then((response) => {
                    let isPaid = response.data?.data?.status === 'paid' ||
                        response.data?.data?.status === "CREATED" ||
                        response.data?.data?.status === "AUTHORIZED" ||
                        response.data?.data?.status === "CLOSED";
                    if (isPaid) {
                        navigation.navigate("OrderHistory", { callback: "purchase" })
                    }

                })
                .catch((err) => console.error(err));
        } else if (route.params?.method === 'TAMARA') {
            await axios
            .get(
                `${config.backendUrl}/check-tamara-status/${tamaraId}/${route?.params?.tamaraSessionId}`
            )
            .then((response) => {
                let isPaid = response.data?.data?.status === 'paid' ||
                    response.data?.data?.status === "CREATED" ||
                    response.data?.data?.status === "AUTHORIZED" ||
                    response.data?.data?.status === "CLOSED";
                if (isPaid) {
                    navigation.navigate("OrderHistory", { callback: "purchase" })
                }

            })
            .catch((err) => console.error(err));
        }
    }
    return <WebView
        source={{ uri: getPaymentWebviewUrl() }}
        // source={{uri: "https://checkout.tabby.ai/?sessionId=4b4d8e9c-addc-47bd-b8c0-ba771f1c3cbf&apiKey=pk_43ff431d-8dcb-4649-880a-97db91e1b5b7&product=installments&merchantCode=zid_sa"}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        style={{ marginTop: 0, height: 600 }}
        onLoadStart={() => {
            console.log({ debUrl: `https://trendy-rose-backend-1d3339f8bb01.herokuapp.com/test?token=${route.params?.user?.accessToken}&amount=${route.params?.amount}&mobileSessionId=${route.params?.mobileSessionId}` })
        }}
        onLoadEnd={() => console.log('Loading finished')}
        ignoreSslError={true}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1"

        renderLoading={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )}
        onNavigationStateChange={(navState) => {
            if (navState.url.includes('payment-success') || navState.url.includes('message=APPROVED')) {
                // const Params = getQueryParams(navState.url, 'id');
                // const id = Params.id;
                console.log({navState})
                checkPaymentFromGateway(navState)
            }
        }}
        onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
        }}
        onMessage={(event) => {
            console.log('Message from webview: ', event.nativeEvent.data);
        }}

    />

}

export default Payment

const styles = StyleSheet.create({
    container: {
        marginTop: 50
    }
});
