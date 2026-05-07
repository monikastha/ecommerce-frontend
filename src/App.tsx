import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/common/Home';
import AdminRegister from './pages/authentication/AdminRegister';
import LoginPage from './pages/authentication/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin/register' element={<AdminRegister />} />
          <Route path='/admin/login' element={<LoginPage />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App