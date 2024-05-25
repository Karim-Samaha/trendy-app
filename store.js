import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import userReducer from "./redux/userReducer";
export default configureStore({
    reducer: {
        cart: CartReducer,
        user: userReducer
    }
})