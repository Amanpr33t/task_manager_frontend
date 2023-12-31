import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEdit: false,
    title: null,
    content: null,
    completionDate: null,
    taskId: null
}

const EditSlice = createSlice({
    name: 'Edit',
    initialState: initialState,
    reducers: {
        setEdit(state, action) {
            state.isEdit = action.payload.isEdit
            state.title = action.payload.title
            state.content = action.payload.content
            state.completionDate = action.payload.completionDate
            state.taskId = action.payload.taskId
        }
    }
})

export default EditSlice
export const EditActions = EditSlice.actions