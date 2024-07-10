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
    return <WebView
        source={{ uri: `https://trendy-rose-backend-1d3339f8bb01.herokuapp.com/test?token=${route.params?.user?.accessToken}&amount=${route.params?.amount}&mobileSessionId=${route.params?.mobileSessionId}` }}
        // source={{ uri: `https://trendy-rose-ea018d58bf02.herokuapp.com/test-success?id=338b22b0-3121-48ed-8eb6-68b7d3b31f1f&status=paid&amount=1000&message=APPROVED` }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        style={{ marginTop: 0, height: 600 }}
        onLoadStart={() => {
            console.log({debUrl: `https://trendy-rose-backend-1d3339f8bb01.herokuapp.com/test?token=${route.params?.user?.accessToken}&amount=${route.params?.amount}&mobileSessionId=${route.params?.mobileSessionId}`})
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
            if (navState.url.includes('test-success') || navState.url.includes('message=APPROVED')) {
                // const Params = getQueryParams(navState.url, 'id');
                // const id = Params.id;
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
                const id = getQueryParam(navState.url, 'id');

                console.log({ id })
                // console.log({ Params })

                axios
                    .get(
                        `${config.backendUrl}/check-payment-status/${id}?source=app`
                    )
                    .then((response) => {
                        if (response.data?.data?.status === 'paid') {
                            navigation.navigate("OrderHistory")
                        }
                    })
                    .catch((err) => console.error(err));
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
