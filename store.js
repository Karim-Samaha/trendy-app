import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import userReducer from "./redux/userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root', // You can change this key to anything
    storage: AsyncStorage,
    whitelist: ['cart'], // Specify which slices of state to persist (e.g., cart)
};
const persistedReducer = persistReducer(persistConfig, CartReducer);

export const store = configureStore({
    reducer: {
        cart: persistedReducer,
        user: userReducer
    }
})
export const persistor = persistStore(store);
