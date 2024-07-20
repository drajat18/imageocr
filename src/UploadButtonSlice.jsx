import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    extractedData: []
}

export const uploadButtonSlice = createSlice({
    name: 'uploadButton',
    initialState,
    reducers: {
        setExtractedData: (state, action) => {
            state.extractedData = action.payload;
        },
    }
});

export const { setExtractedData } = uploadButtonSlice.actions;
export default uploadButtonSlice.reducer;
