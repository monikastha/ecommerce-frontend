import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/common/Home";
import AdminRegister from "./pages/authentication/AdminRegister";
import LoginPage from "./pages/authentication/LoginPage";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminStaff from "./pages/Admin/AdminStaff";
import AdminAddStaff from "./pages/Admin/AdminAddStaff";

import AdminSeller from "./pages/Admin/AdminSeller";
import AdminBuyer from "./pages/Admin/AdminBuyer";

import AdminDelivery from "./pages/Admin/AdminDelivery";
import AdminAddDelivery from "./pages/Admin/AdminAddDelivery";

import AdminCategory from "./pages/Admin/AdminCategory";
import AdminAddCategory from "./pages/Admin/AdminAddCategory";
import AdminAddSubCategory from "./pages/Admin/AdminAddSubCategory";

import AdminProduct from "./pages/Admin/AdminProduct";

import AdminPromotion from "./pages/Admin/AdminPromotion";
import AdminAddPromotion from "./pages/Admin/AdminAddPromotion";

import AdminLocation from "./pages/Admin/AdminLocation";
import AdminAddLocation from "./pages/Admin/AdminAddLocation";

import BuyerHome from "./pages/Buyer/home/BuyerHome";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<LoginPage />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/staff/add" element={<AdminAddStaff />} />

        <Route path="/admin/seller" element={<AdminSeller />} />
        <Route path="/admin/buyer" element={<AdminBuyer />} />

        <Route path="/admin/delivery" element={<AdminDelivery />} />
        <Route path="/admin/delivery/add" element={<AdminAddDelivery />} />

        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/admin/category/add" element={<AdminAddCategory />} />
        <Route path="/admin/subcategory/add" element={<AdminAddSubCategory />} />

        <Route path="/admin/product" element={<AdminProduct />} />

        <Route path="/admin/promotion" element={<AdminPromotion />} />
        <Route path="/admin/promotion/add" element={<AdminAddPromotion />} />

        <Route path="/admin/location" element={<AdminLocation />} />
        <Route path="/admin/location/add" element={<AdminAddLocation />} />
        <Route path="/home/BuyerHome" element={<BuyerHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;