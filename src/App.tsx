import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/common/Home";
import AdminRegister from "./pages/authentication/AdminRegister";
import LoginPage from "./pages/authentication/LoginPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import BuyerHome from "./pages/Buyer/home/BuyerHome";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<Home />} />

        {/* Admin Routes */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Buyer Route */}
        <Route path="/home/BuyerHome" element={<BuyerHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;