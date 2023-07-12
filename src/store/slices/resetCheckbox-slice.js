import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isResetCheckbox:false
}

const ResetCheckboxSlice = createSlice({
    name: 'ResetCheckbox',
    initialState: initialState,
    reducers: {
        setResetCheckbox(state, action) {
            state.isResetCheckbox=action.payload
        }
    }
})

export default ResetCheckboxSlice
export const ResetCheckboxActions = ResetCheckboxSlice.actions