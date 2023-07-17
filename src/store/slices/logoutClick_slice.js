import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isLogoutClick:false
}

const LogoutClickSlice = createSlice({
    name: 'LogoutClick',
    initialState: initialState,
    reducers: {
        setLogoutClick(state, action) {
            state.isLogoutClick=action.payload
        }
    }
})

export default LogoutClickSlice
export const LogoutClickActions = LogoutClickSlice.actions