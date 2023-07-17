import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isAddTask:false
}

const AddTaskSlice = createSlice({
    name: 'AddTask',
    initialState: initialState,
    reducers: {
        setAddTask(state, action) {
            state.isAddTask=action.payload
        }
    }
})

export default AddTaskSlice
export const AddTaskActions = AddTaskSlice.actions