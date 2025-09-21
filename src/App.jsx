import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Headercomponents } from "./components/headercomponents/Headercomponents";
import "./styles/global.scss";

function App() {
  return (
    <BrowserRouter>
      <Headercomponents />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
