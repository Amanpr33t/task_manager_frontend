import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isFiltersApplied:false
}

const FiltersAppliedSlice = createSlice({
    name: 'FiltersApplied',
    initialState: initialState,
    reducers: {
        setFiltersApplied(state, action) {
            state.isFiltersApplied=action.payload
        }
    }
})

export default FiltersAppliedSlice
export const FiltersAppliedActions = FiltersAppliedSlice.actions