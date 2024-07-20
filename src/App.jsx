import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/Home/Home.jsx';
import NavBar from './NavBar/NavBar.jsx';
import CustomTable from './CustomTable.jsx';
import Login from '../src/Login/Login.jsx';
import SignUp from './SignUp/Signup.jsx';
import UserHome from './UserHome/UserHome.jsx';
import Tables from '../src/Tables/Tables.jsx';

const App = () => {
  return (
   
    <Router>
      <div className='App'>
        <NavBar />
      </div>
      <div className='Content'>
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
        <Routes>
          <Route  path="/customtable" element={<CustomTable />} />
        </Routes>
        <Routes>
          <Route  path="/login" element={<Login />} />
        </Routes>
        <Routes>
          <Route  path="/signup" element={<SignUp />} />
        </Routes>
        <Routes>
          <Route  path="/userhome" element={<UserHome />} />
        </Routes>
        <Routes>
          <Route  path="/tables" element={<Tables />} />
        </Routes>
      </div>
    </Router>
 
  );
};

export default App;

// ReactDOM.createRoot(document.getElementById('root')).render(

// //  <React.StrictMode>
// <UploadButton setExtractedData={setExtractedData} />
// <CustomTable data={extractedData} />
// <Home />
// </React.StrictMode>