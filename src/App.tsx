import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Common & Auth
import Home from "./pages/common/Home";
import LoginForAll from "./pages/authentication/LoginForAll";
import AdminRegister from "./pages/authentication/AdminRegister";
import BuyerSignUp from "./pages/authentication/BuyerSignUp";
import SellerRegister from "./pages/authentication/SellerRegister";
import ConfirmCode from "./pages/authentication/ConfirmCode";
import SignupWay from "./pages/authentication/SignupWay";
import EmailVerifiedSuccess from "./pages/authentication/EmailVerifiedSuccess";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminStaff from "./pages/Admin/AdminStaff";
import AdminAddStaff from "./pages/Admin/AdminAddStaff";
import AdminUpdateStaff from "./pages/Admin/AdminUpdateStaff";
import AdminSeller from "./pages/Admin/AdminSeller";
import AdminBuyer from "./pages/Admin/AdminBuyer";
import AdminDelivery from "./pages/Admin/AdminDelivery";
import AdminAddDelivery from "./pages/Admin/AdminAddDelivery";
import AdminCategory from "./pages/Admin/AdminCategory";
import AdminAddCategory from "./pages/Admin/AdminAddCategory";
import AdminAddSubCategory from "./pages/Admin/AdminAddSubCategory";
import AdminProduct from "./pages/Admin/AdminProduct";
import AdminOrder from "./pages/Admin/AdminOrder";
import AdminPromotion from "./pages/Admin/AdminPromotion";
import AdminEarnings from "./pages/Admin/AdminEarnigns"; // Fixed typo reference in logic
import AdminAddPromotion from "./pages/Admin/AdminAddPromotion";
import AdminLocation from "./pages/Admin/AdminLocation";
import AdminAddLocation from "./pages/Admin/AdminAddLocation";

// Assistant Pages
import AssistantDashboard from "./pages/Assistant/AssistantDashboard";
import AssistantCategory from "./pages/Assistant/AssistantCategory";
import AssistantAddCategory from "./pages/Assistant/AssistantAddCategory";
import AssistantAddSubCategory from "./pages/Assistant/AssistantAddSubCategory";
import AssistantWarehouseStaff from "./pages/Assistant/AssistantWarehouseStaff";
import AssistantProductManagement from "./pages/Assistant/AssistantProductManagement";
import AssistantOrder from "./pages/Assistant/AssistantOrder";
import AssistantSeller from "./pages/Assistant/AssistantSeller";

// Seller Pages
import SellerDashboards from "./pages/Seller/SellerDashboards";
import SellerManageProduct from "./pages/Seller/SellerManageProduct";
import SellerEditProduct from "./pages/Seller/SellerEditProduct";
import SellerAddProduct from "./pages/Seller/SellerAddProduct";
import SellerPublishProduct from "./pages/Seller/SellerPublishProduct";
import SellerUnpublishProduct from "./pages/Seller/SellerUnpublishProduct";
import SellerOrders from "./pages/Seller/SellerOrders";
import SellerManageOrders from "./pages/Seller/SellerManageOrders";
import SellerReviews from "./pages/Seller/SellerReviews";
import SellerLogout from "./pages/Seller/SellerLogout";
import SellerProfile from "./pages/Seller/SellerProfile";

// Buyer Pages
import BuyerHome from "./pages/Buyer/home/BuyerHome";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForAll />} />
        <Route path="/signupway" element={<SignupWay />} />
        <Route path="/confirmcode" element={<ConfirmCode />} />
        <Route path="/emailverified" element={<EmailVerifiedSuccess />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin">
          <Route path="register" element={<AdminRegister />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="staff/add" element={<AdminAddStaff />} />
          <Route path="staff/update/:id" element={<AdminUpdateStaff />} />
          <Route path="seller" element={<AdminSeller />} />
          <Route path="buyer" element={<AdminBuyer />} />
          <Route path="delivery" element={<AdminDelivery />} />
          <Route path="delivery/add" element={<AdminAddDelivery />} />
          <Route path="category" element={<AdminCategory />} />
          <Route path="category/add" element={<AdminAddCategory />} />
          <Route path="subcategory/add" element={<AdminAddSubCategory />} />
          <Route path="product" element={<AdminProduct />} />
          <Route path="earnings" element={<AdminEarnings />} />
          <Route path="promotion" element={<AdminPromotion />} />
          <Route path="promotion/add" element={<AdminAddPromotion />} />
          <Route path="order" element={<AdminOrder />} />
          <Route path="location" element={<AdminLocation />} />
          <Route path="location/add" element={<AdminAddLocation />} />
        </Route>

        {/* --- ASSISTANT ROUTES --- */}
        <Route path="/assistant">
          <Route path="dashboard" element={<AssistantDashboard />} />
          <Route path="category" element={<AssistantCategory />} />
          <Route path="category/add" element={<AssistantAddCategory />} />
          <Route path="subcategory/add" element={<AssistantAddSubCategory />} />
          <Route path="warehouse/staff" element={<AssistantWarehouseStaff />} />
          <Route path="product" element={<AssistantProductManagement />} />
          <Route path="order" element={<AssistantOrder />} />
          <Route path="seller" element={<AssistantSeller />} />
        </Route>

        {/* --- SELLER ROUTES --- */}
        <Route path="/seller">
          <Route path="signup" element={<SellerRegister />} />
          <Route path="dashboards" element={<SellerDashboards />} />
          <Route path="manageproduct" element={<SellerManageProduct />} />
          <Route path="editproduct" element={<SellerEditProduct />} />
          <Route path="addproduct" element={<SellerAddProduct />} />
          <Route path="publishproduct" element={<SellerPublishProduct />} />
          <Route path="unpublishproduct" element={<SellerUnpublishProduct />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="manageorders" element={<SellerManageOrders />} />
          <Route path="reviews" element={<SellerReviews />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="logout" element={<SellerLogout />} />
        </Route>

        {/* --- BUYER ROUTES --- */}
        <Route path="/buyer">
          <Route path="signup" element={<BuyerSignUp />} />
          <Route path="home" element={<BuyerHome />} />
        </Route>
        
        {/* Redirect for redundant buyer home path */}
        <Route path="/home/BuyerHome" element={<Navigate to="/buyer/home" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;