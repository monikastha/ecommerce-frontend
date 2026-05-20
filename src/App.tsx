import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Authentication
import AdminRegister from "./pages/authentication/AdminRegister";
import BuyerSignUp from "./pages/authentication/BuyerSignUp";
import SellerRegister from "./pages/authentication/SellerRegister";
import LoginForALl from "./pages/authentication/LoginForAll";
import ConfirmCode from "./pages/authentication/ConfirmCode";
import SignupWay from "./pages/authentication/SignupWay";
import EmailVerifiedSuccess from "./pages/authentication/EmailVerifiedSuccess";

// Buyer Pages
import BuyerHome from "./pages/Buyer/home/BuyerHome";

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
import AdminUpdateCategory from "./pages/Admin/AdminUpdateCategory";
import AdminAddSubCategory from "./pages/Admin/AdminAddSubCategory";
import AdminUpdateSubCategory from "./pages/Admin/AdminUpdateSubCategory";
import AdminProduct from "./pages/Admin/AdminProduct";
import AdminOrder from "./pages/Admin/AdminOrder";
import AdminPromotion from "./pages/Admin/AdminPromotion";
import AdminAddPromotion from "./pages/Admin/AdminAddPromotion";
import AdminEarnings from "./pages/Admin/AdminEarnigns";
import AdminLocation from "./pages/Admin/AdminLocation";
import AdminAddLocation from "./pages/Admin/AdminAddLocation";
import AdminUpdateLocation from "./pages/Admin/AdminUpdateLocation";

// Assistant Pages
import AssistantDashboard from "./pages/Assistant/AssistantDashboard";
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
import SellerProfile from "./pages/Seller/SellerProfile";
import SellerLogout from "./pages/Seller/SellerLogout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BuyerHome />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginForALl />} />
        <Route path="/confirmcode" element={<ConfirmCode />} />
        <Route path="/signupway" element={<SignupWay />} />
        <Route path="/emailverified" element={<EmailVerifiedSuccess />} />

        {/* Buyer Routes */}
        <Route path="/buyer">
          <Route path="signup" element={<BuyerSignUp />} />
          <Route path="home" element={<BuyerHome />} />
        </Route>

        {/* Seller Routes */}
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

        {/* Admin Routes */}
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
          <Route path="category/update/:id" element={<AdminUpdateCategory />} />
          <Route path="subcategory/add" element={<AdminAddSubCategory />} />
          <Route path="subcategory/update/:id" element={<AdminUpdateSubCategory />} />
          <Route path="product" element={<AdminProduct />} />
          <Route path="order" element={<AdminOrder />} />
          <Route path="promotion" element={<AdminPromotion />} />
          <Route path="promotion/add" element={<AdminAddPromotion />} />
          <Route path="earnings" element={<AdminEarnings />} />
          <Route path="location" element={<AdminLocation />} />
          <Route path="location/add" element={<AdminAddLocation />} />
          <Route path="location/update/:id" element={<AdminUpdateLocation />} />
        </Route>

        {/* Assistant Routes */}
        <Route path="/assistant">
          <Route path="dashboard" element={<AssistantDashboard />} />
          <Route path="warehouse/staff" element={<AssistantWarehouseStaff />} />
          <Route path="product" element={<AssistantProductManagement />} />
          <Route path="order" element={<AssistantOrder />} />
          <Route path="seller" element={<AssistantSeller />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;