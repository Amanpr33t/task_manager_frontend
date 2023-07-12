import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isTaskData:false
}

const TaskDataSlice = createSlice({
    name: 'TaskData',
    initialState: initialState,
    reducers: {
        setTaskData(state, action) {
            state.isTaskData=action.payload
        }
    }
})

export default TaskDataSlice
export const TaskDataActions = TaskDataSlice.actions