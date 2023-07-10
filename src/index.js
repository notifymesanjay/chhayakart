import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./model/store";
// import {Persiststore} from './model/store';
// import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from "react-router-dom";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import 'bootstrap/dist/js/bootstrap.bundle.js'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "lazysizes";
// import a plugin
import "lazysizes/plugins/parent-fit/ls.parent-fit";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				{/* <PersistGate loading={null} persistor={Persiststore}> */}
				<App />
				{/* </PersistGate> */}
			</Provider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
