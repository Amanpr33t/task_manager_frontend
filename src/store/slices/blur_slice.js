import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isBlur:false
}

const BlurSlice = createSlice({
    name: 'Blur',
    initialState: initialState,
    reducers: {
        setBlur(state, action) {
            state.isBlur=action.payload
        }
    }
})

export default BlurSlice
export const BlurActions = BlurSlice.actions