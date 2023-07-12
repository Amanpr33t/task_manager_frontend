import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isDeleteTasks:false
}

const DeleteTasksSlice = createSlice({
    name: 'DeleteTasks',
    initialState: initialState,
    reducers: {
        setDeleteTasks(state, action) {
            state.isDeleteTasks=action.payload
        }
    }
})

export default DeleteTasksSlice
export const DeleteTasksActions = DeleteTasksSlice.actions