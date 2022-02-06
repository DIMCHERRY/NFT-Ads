import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";

const SERVER_URL = "https://hhltxx40gmhl.usemoralis.com:2053/server";
const APP_ID = "E0uod8AJfsetWFHYNpkNM0DoOEQGqgMoYXcwgl7e";

Moralis.start({ SERVER_URL, APP_ID });

ReactDOM.render(
  <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
    <App />
  </MoralisProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
