import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, I18nManager } from "react-native";
import { ModalPortal } from "react-native-modals";
import { Provider } from "react-redux";
import StackNavigator from "./navigation/StackNavigator";
import {store, persistor} from "./store";
import { UserContext } from "./UserContext";
import { PersistGate } from 'redux-persist/integration/react';


I18nManager.forceRTL(false);
export default function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar style="light" backgroundColor="#55a8b9" />
          <UserContext>
            <StackNavigator />
            <ModalPortal />
          </UserContext>
        </PersistGate>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
