import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, I18nManager } from "react-native";
import { ModalPortal } from "react-native-modals";
import { Provider } from "react-redux";
import StackNavigator from "./navigation/StackNavigator";
import { store, persistor } from "./store";
import { UserContext } from "./UserContext";
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect, useState } from "react";

I18nManager.allowRTL(false)

export default function App() {
  const [layoutChanged, setLayoutChanged] = useState(false);  // Track if layout changed

  useEffect(() => {
    const forceLTR = true;  // Set to true for LTR, false for RTL

    // Check if the current direction matches the desired one
    if (forceLTR && I18nManager.isRTL) {
      I18nManager.forceRTL(false); 
      I18nManager.allowRTL(false)
      setLayoutChanged(true)

       // Force LTR if system is RTL
      // setLayoutChanged(true);  // Trigger re-render to apply new layout
    } else if (!forceLTR && !I18nManager.isRTL) {
      I18nManager.forceRTL(true);  // Force RTL if system is LTR
      setLayoutChanged(true);  // Trigger re-render to apply new layout
    }
  }, []);


  if (layoutChanged) {
    console.log({I18nManager})
    return null;  // Render null while layout direction is being set
  }
  
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
