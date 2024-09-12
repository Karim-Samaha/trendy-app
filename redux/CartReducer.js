import { createSlice } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    tabbyId: ""
  },
  reducers: {
    addToCart: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    adjustItem: (state, action) => {
      const itemToBeAdjusted = state.cart.find((item) => item?._id === action.payload?._id)
      const newCart = state.cart.filter((item) => item._id !== action.payload?._id)
      newCart.push(action.payload)
      state.cart = newCart
    },
    removeFromCart: (state, action) => {
      const removeItem = state.cart.filter(
        (item) => item.id !== action.payload.id
      );
      state.cart = removeItem;
    },
    incementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      itemPresent.quantity++;
    },
    decrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (itemPresent.quantity === 1) {
        itemPresent.quantity = 0;
        const removeItem = state.cart.filter(
          (item) => item.id !== action.payload.id
        );
        state.cart = removeItem;
      } else {
        itemPresent.quantity--;
      }
    },
    cleanCart: (state) => {
      state.cart = [];
    },
    saveTabbyId: (state, action) => {
      state.tabbyId = action.payload.tabbyId
    }
  },
});


export const { addToCart, removeFromCart, incementQuantity, decrementQuantity, cleanCart, saveTabbyId } = CartSlice.actions;

export default CartSlice.reducer