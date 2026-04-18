import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/common/Home';
import AdminRegister from './pages/authentication/AdminRegister';

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin/register' element={<AdminRegister />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App