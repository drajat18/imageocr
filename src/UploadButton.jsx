// import React, {useState} from 'react';
// import { useDispatch } from 'react-redux';
// import axios from 'axios';
// import { setExtractedData } from './UploadButtonSlice';

// // function UploadButton(props) {
// //   const dispatch = useDispatch();
// //   // const dataForTable = useSelector((state) => state.uploadButton?.extractedData || []);
// //   // console.log("MI:", dataForTable); // Log the state data to verify
// //   // props.dataForTable = dataForTable;
// //   // const extractedDataHandler = (e) => {
// //   //   e.preventDefault()
// //   //   dispatch(extractedData)
// //   // }

// //   const handleFileChange = async (event) => {
// //     const file = event.target.files[0];

// //     try {
// //       const formData = new FormData();
// //       formData.append('image', file);

// //       const response = await axios.post('http://localhost:3001/extract-data', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });

// //       dispatch(setExtractedData(response.data.data));
// //       props.dataForTable = response.data.data;
// //       console.log("data:", response.data.data)
// //     } catch (error) {
// //       console.error('Error:', error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <label htmlFor="file-upload">Upload Image:</label>
// //       <input
// //         id="file-upload"
// //         type="file"
// //         accept="image/*"
// //         onChange={handleFileChange}
// //       />
// //     </div>
// //   );
// // }

// export default UploadButton;
import React from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setExtractedData } from './UploadButtonSlice';

function UploadButton({ setDataForTable }) {
  const dispatch = useDispatch();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('https://apiimageocr.ue.r.appspot.com/extract-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const extractedData = response.data.data;
      dispatch(setExtractedData(extractedData));
      setDataForTable(extractedData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload">Upload Image:</label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default UploadButton;
