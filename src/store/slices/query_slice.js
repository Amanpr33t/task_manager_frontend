import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   query:''
}

const QuerySlice = createSlice({
    name: 'Query',
    initialState: initialState,
    reducers: {
        setQuery(state, action) {
            state.query=action.payload
        }
    }
})

export default QuerySlice
export const QueryActions = QuerySlice.actions