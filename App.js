import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, I18nManager } from "react-native";
import { ModalPortal } from "react-native-modals";
import { Provider } from "react-redux";
import StackNavigator from "./navigation/StackNavigator";
import store from "./store";
import { UserContext } from "./UserContext";

I18nManager.forceRTL(false);
export default function App() {
  return (
    <>
      <Provider store={store}>
        <StatusBar style="light" backgroundColor="#55a8b9" />
        <UserContext>
          <StackNavigator />
          <ModalPortal />
        </UserContext>
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
