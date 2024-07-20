import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    uid: ''
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
        },
        uid: (state, action) => {
            state.uid = action.uid;
        }
    }
})

export const { login, logout, uid } = loginSlice.actions;
export default loginSlice.reducer;