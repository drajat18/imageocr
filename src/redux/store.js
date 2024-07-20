import {configureStore} from '@reduxjs/toolkit'
import loginReducer from '../Login/LoginSlice';
import uploadButtonReducer from '../UploadButtonSlice';
import customTableReducer from '../CustomTableSlice';

 const store = configureStore({
    reducer: loginReducer,
    uploadButton: uploadButtonReducer,
    customTable: customTableReducer,
})

export default store;