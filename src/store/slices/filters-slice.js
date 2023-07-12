import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters:{
        sort:null,
        year:null,
        month:null,
        date:null,
        status:null
    }
}

const FiltersSlice = createSlice({
    name: 'Filters',
    initialState: initialState,
    reducers: {
        setFilters(state, action) {
            state.filters=action.payload
        }
    }
})

export default FiltersSlice
export const FiltersActions = FiltersSlice.actions