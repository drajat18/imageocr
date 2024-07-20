import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    extractedData: [],
}

export const customTableSlice = createSlice({
    name: 'customeTable',
    initialState,
    reducers: {
        setExtractedData: (state, action) => {
            state.extractedData = action.payload;
        },
    }
});

export const { setExtractedData, extractedData } = customTableSlice.actions;
export default customTableSlice.reducer;