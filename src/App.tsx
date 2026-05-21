import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// ====================== COMMON & AUTH ======================
import Home from "./pages/common/Home";
import LoginForAll from "./pages/authentication/LoginForAll";
import AdminRegister from "./pages/authentication/AdminRegister";
import BuyerSignUp from "./pages/authentication/BuyerSignUp";
import SellerRegister from "./pages/authentication/SellerRegister";
import ConfirmCode from "./pages/authentication/ConfirmCode";
import SignupWay from "./pages/authentication/SignupWay";
import EmailVerifiedSuccess from "./pages/authentication/EmailVerifiedSuccess";

// ====================== ADMIN PAGES ======================
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
import AdminProduct from "./pages/Admin/AdminProduct";
import AdminOrder from "./pages/Admin/AdminOrder";
import AdminPromotion from "./pages/Admin/AdminPromotion";
// import AdminEarnings from "./pages/Admin/AdminEarnings";
import AdminAddPromotion from "./pages/Admin/AdminAddPromotion";
import AdminLocation from "./pages/Admin/AdminLocation";
import AdminUpdatePromotion from "./pages/Admin/AdminUpdatePromotion";
import AdminAddLocation from "./pages/Admin/AdminAddLocation";
import AdminUpdateLocation from "./pages/Admin/AdminUpdateLocation";

// ====================== ASSISTANT PAGES ======================
import AssistantDashboard from "./pages/Assistant/AssistantDashboard";
import AssistantCategory from "./pages/Assistant/AssistantCategory";
import AssistantAddCategory from "./pages/Assistant/AssistantAddCategory";
import AssistantAddSubCategory from "./pages/Assistant/AssistantAddSubCategory";
import AssistantWarehouseStaff from "./pages/Assistant/AssistantWarehouseStaff";
import AssistantUpdateWarehouseStaff from "./pages/Assistant/AssistantUpdateWarehouseStaff";
import AssistantProductManagement from "./pages/Assistant/AssistantProductManagement";
import AssistantEmergencyOrders from "./pages/Assistant/AssistantEmergencyOrders";
import AssistantOrder from "./pages/Assistant/AssistantOrder";
import AssistantSeller from "./pages/Assistant/AssistantSeller";

// ====================== SELLER PAGES ======================
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

// ====================== BUYER PAGES ======================
import BuyerHome from "./pages/Buyer/home/BuyerHome";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ====================== PUBLIC ROUTES ====================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForAll />} />
        <Route path="/signupway" element={<SignupWay />} />
        <Route path="/confirmcode" element={<ConfirmCode />} />
        <Route path="/emailverified" element={<EmailVerifiedSuccess />} />

        {/* ====================== ADMIN ROUTES ====================== */}
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

          <Route path="product" element={<AdminProduct />} />
          <Route path="order" element={<AdminOrder />} />

          <Route path="promotion" element={<AdminPromotion />} />
          <Route path="promotion/add" element={<AdminAddPromotion />} />
          <Route path="/admin/promotion/edit/:id" element={<AdminUpdatePromotion />} />
          {/* <Route path="earnings" element={<AdminEarnings />} /> */}

          <Route path="location" element={<AdminLocation />} />
          <Route path="location/add" element={<AdminAddLocation />} />
          <Route path="location/update/:id" element={<AdminUpdateLocation />} />
        </Route>

        {/* ====================== ASSISTANT ROUTES ====================== */}
        <Route path="/assistant">
          <Route path="dashboard" element={<AssistantDashboard />} />
          <Route path="category" element={<AssistantCategory />} />
          <Route path="category/add" element={<AssistantAddCategory />} />
          <Route path="subcategory/add" element={<AssistantAddSubCategory />} />

          <Route path="warehouse/staff" element={<AssistantWarehouseStaff />} />
          <Route path="warehouse/staff/update/:id" element={<AssistantUpdateWarehouseStaff />} />

          <Route path="product" element={<AssistantProductManagement />} />
          <Route path="order" element={<AssistantOrder />} />
          <Route path="seller" element={<AssistantSeller />} />
          <Route path="emergency-orders" element={<AssistantEmergencyOrders />} />
        </Route>

        {/* ====================== SELLER ROUTES ====================== */}
        <Route path="/seller">
          <Route path="signup" element={<SellerRegister />} />
          <Route path="dashboards" element={<SellerDashboards />} />

          <Route path="manageproduct" element={<SellerManageProduct />} />
          <Route path="addproduct" element={<SellerAddProduct />} />
          <Route path="editproduct/:id?" element={<SellerEditProduct />} />

          <Route path="publishproduct" element={<SellerPublishProduct />} />
          <Route path="unpublishproduct" element={<SellerUnpublishProduct />} />

          <Route path="orders" element={<SellerOrders />} />
          <Route path="manageorders" element={<SellerManageOrders />} />
          <Route path="reviews" element={<SellerReviews />} />

          <Route path="profile" element={<SellerProfile />} />
          <Route path="logout" element={<SellerLogout />} />
        </Route>

        {/* ====================== BUYER ROUTES ====================== */}
        <Route path="/buyer">
          <Route path="signup" element={<BuyerSignUp />} />
          <Route path="home" element={<BuyerHome />} />
          <Route path="confirmcode" element={<ConfirmCode />} />
        </Route>

        {/* ====================== REDIRECTS & 404 ====================== */}
        <Route path="/home/BuyerHome" element={<Navigate to="/buyer/home" replace />} />

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;