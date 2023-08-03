import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppState } from "./context/index.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/tipsonwheels/admin">
    <AppState>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
      <Toaster />
    </AppState>
  </BrowserRouter>
);
