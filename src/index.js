import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/index.css";
import 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'react-app-polyfill/stable';
import React from "react";
import ReactDOM from "react-dom";
import { FirebaseAppProvider } from 'reactfire';
import App from './App';
import firebaseConfig from './firebaseConfig';

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
    <App />
  </FirebaseAppProvider>,
  document.getElementById("root")
);
