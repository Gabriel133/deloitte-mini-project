import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.css";
import "react-datetime/css/react-datetime.css";
import "./scss/volt.scss";
// custom styles
import "./css/custom-style.css";

import HomePage from "./pages/HomePage";

ReactDOM.render(
  <HashRouter>
    <HomePage />
  </HashRouter>,
  document.getElementById("root")
);
