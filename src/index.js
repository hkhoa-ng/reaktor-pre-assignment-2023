import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { PilotProvider } from "./context/PilotContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PilotProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </PilotProvider>
  </React.StrictMode>
);
