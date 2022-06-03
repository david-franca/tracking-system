import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <CookiesProvider>
        <Router>
          <App />
        </Router>
      </CookiesProvider>
    </ChakraProvider>
  </React.StrictMode>
);
