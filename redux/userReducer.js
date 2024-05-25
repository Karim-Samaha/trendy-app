import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "cart",
    initialState: {
        login: false,
        user: {},
    },
    reducers: {
        handleLogin: (state) => {
            state.login = true
        },
        handleLogout: (state) => {
            state.login = false
        }
    },
});


export const { handleLogin, handleLogout } = userSlice.actions;

export default userSlice.reducer