<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DeliverymanDashboard from "./pages/DeliveryMan/DeliverymanDashboard";
import DeliverymanOrder from "./pages/DeliveryMan/DeliverymanOrder";
import DeliverymanTracking from "./pages/DeliveryMan/DeliverymanTracking";
import DeliveryEarnings from "./pages/DeliveryMan/DeliveryEarnings";
import AssignedDeliveries from "./pages/DeliveryMan/AssignedDeliveries";
import TodayOrders from "./pages/DeliveryMan/TodayOrders";
import PendingOrders from "./pages/DeliveryMan/PendingOrders";
import OrderDetails from "./pages/DeliveryMan/OrderDetails";

import WarehouseStaffDashboard from "./pages/WarehouseStaff/WarehouseStaffDashboard";
import InventoryManagement from "./pages/WarehouseStaff/InventoryManagement";
import OrderProcessing from "./pages/WarehouseStaff/OrderProcessing";
import WarehouseOrderTracking from "./pages/WarehouseStaff/WarehouseOrdersTracking";
import WarehouseReports from "./pages/WarehouseStaff/WarehouseReports";


// import Home from "./pages/common/Home";
// import AdminRegister from "./pages/authentication/AdminRegister";
// import LoginPage from "./pages/authentication/LoginPage";
=======
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
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96

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
<<<<<<< HEAD
        <Route path="/" element={<BuyerHome />} />

        {/*Login For ALl Page Routes*/}
{/* 
        <Route path="/admin/register" element={<AdminRegister />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/staff/add" element={<AdminAddStaff />} />
        <Route path="/admin/staff/update/:id" element={<AdminUpdateStaff />} />
        <Route path="/admin/seller" element={<AdminSeller />} />
        <Route path="/admin/buyer" element={<AdminBuyer />} />

        <Route path="/admin/delivery" element={<AdminDelivery />} />
        <Route path="/admin/delivery/add" element={<AdminAddDelivery />} />

        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/admin/category/add" element={<AdminAddCategory />} />
        <Route
          path="/admin/subcategory/add"
          element={<AdminAddSubCategory />}
        />

        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/earnings" element={<AdminEarnings />} />

        <Route path="/admin/promotion" element={<AdminPromotion />} />
        <Route path="/admin/promotion/add" element={<AdminAddPromotion />} />
        <Route path="/admin/order" element={<AdminOrder />} />
        <Route path="/admin/location" element={<AdminLocation />} />
        <Route path="/admin/location/add" element={<AdminAddLocation />} />
        <Route
          path="/admin/location/update/:id"
          element={<AdminUpdateLocation />}
        />
        <Route path="/assistant/dashboard" element={<AssistantDashboard />} />
        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/admin/category/add" element={<AdminAddCategory />} />
        <Route
          path="/admin/category/update/:id"
          element={<AdminUpdateCategory />}
        />

        <Route
          path="/admin/subcategory/add"
          element={<AdminAddSubCategory />}
        />
        <Route
          path="/admin/subcategory/update/:id"
          element={<AdminUpdateSubCategory />}
        />
        <Route
          path="/assistant/warehouse/staff"
          element={<AssistantWarehouseStaff />}
        />
        <Route
          path="/assistant/product"
          element={<AssistantProductManagement />}
        />
        <Route path="/assistant/order" element={<AssistantOrder />} />
        <Route path="/assistant/seller" element={<AssistantSeller />} />
        {/* 
        <Route path="/buyer/home" element={<BuyerHome />} /> */}
        <Route path="/home/BuyerHome" element={<BuyerHome />} />
        <Route path="/buyer/signup" element={<BuyerSignUp />} />
        <Route path="/login" element={<LoginForALl />} />
        <Route path="/confirmcode" element={<ConfirmCode />} />
=======
        {/* ====================== PUBLIC ROUTES ====================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForAll />} />
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        <Route path="/signupway" element={<SignupWay />} />
        <Route path="/confirmcode" element={<ConfirmCode />} />
        <Route path="/emailverified" element={<EmailVerifiedSuccess />} />

<<<<<<< HEAD
        {/* DELIVERY MAN ROUTES */}
      <Route path="/delivery/dashboard" element={<DeliverymanDashboard />} />
      <Route path="/delivery/orders" element={<DeliverymanOrder />} />
      <Route path="/delivery/tracking" element={<DeliverymanTracking />} />
      <Route path="/delivery/earnings" element={<DeliveryEarnings />} />
      <Route path="/delivery/assigned" element={<AssignedDeliveries />} />
      <Route path="/delivery/today-orders" element={<TodayOrders />} />
      <Route path="/delivery/pending-orders" element={<PendingOrders />} />
      <Route path="/delivery/orders/:id" element={<OrderDetails />} />

      <Route path="/warehouse/dashboard" element={<WarehouseStaffDashboard />} />
      <Route path="/warehouse/inventory" element={<InventoryManagement />} />
      <Route path="/warehouse/orders" element={<OrderProcessing />} />
      <Route path="/warehouse/tracking" element={<WarehouseOrderTracking />} />
      <Route path="/warehouse/reports" element={<WarehouseReports />} />
=======
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
        </Route>

        {/* ====================== REDIRECTS & 404 ====================== */}
        <Route path="/home/BuyerHome" element={<Navigate to="/buyer/home" replace />} />

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
      </Routes>
    </BrowserRouter>
  );
};

export default App;