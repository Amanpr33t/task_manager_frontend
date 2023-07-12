import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isLogin:false
}

const LoginSlice = createSlice({
    name: 'Login',
    initialState: initialState,
    reducers: {
        setLogin(state, action) {
            state.isLogin=action.payload
        }
    }
})

export default LoginSlice
export const LoginActions = LoginSlice.actions