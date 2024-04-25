import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./index.css";
import 'react-responsive-modal/styles.css';
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";


const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>      
      <BrowserRouter>
        <ChakraProvider theme={theme}>         
            <App />       
        </ChakraProvider>
      </BrowserRouter>   
    </React.StrictMode>
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
