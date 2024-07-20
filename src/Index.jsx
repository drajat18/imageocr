import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from 'react-redux';
import store from '../src/redux/store';
import firebase from "firebase/compat/app";
// Required for side-effects
import "firebase/firestore";

const Index = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
   <Provider store={store}>
      <App />
      </Provider>

  );
};

Index();
export default Index;
