import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        isErrorModal: false,
        message: ''
}

const ErrorModalSlice = createSlice({
    name: 'ErrorModal',
    initialState: initialState,
    reducers: {
        setErrorModal(state, action) {
            state.isErrorModal = action.payload.isErrorModal
            state.message=action.payload.message
        }
    }
})

export default ErrorModalSlice
export const ErrorModalActions = ErrorModalSlice.actions