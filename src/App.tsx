import { BrowserRouter, Route, Routes } from "react-router-dom";

// ====================== AUTHENTICATION & COMMON PAGES ======================
import BuyerHome from "./pages/Buyer/home/BuyerHome";
import BuyerSignUp from "./pages/authentication/BuyerSignUp"; 
import LoginForAll from "./pages/authentication/LoginForAll";   // Fixed import name
import AuthLayout from "./pages/layouts/AuthLayout";
import ConfirmCode from "./pages/authentication/ConfirmCode"; 
import SignupWay from "./pages/authentication/SignupWay";     
import EmailVerifiedSuccess from "./pages/authentication/EmailVerifiedSuccess"; 
import SellerRegister from "./pages/authentication/SellerRegister";

// ====================== DELIVERY MAN PAGES ======================
import DeliverymanDashboard from "./pages/DeliveryMan/DeliverymanDashboard";
import DeliverymanOrder from "./pages/DeliveryMan/DeliverymanOrder";
import DeliverymanTracking from "./pages/DeliveryMan/DeliverymanTracking";
import DeliveryEarnings from "./pages/DeliveryMan/DeliveryEarnings";
import AssignedDeliveries from "./pages/DeliveryMan/AssignedDeliveries";
import TodayOrders from "./pages/DeliveryMan/TodayOrders";
import PendingOrders from "./pages/DeliveryMan/PendingOrders";
import OrderDetails from "./pages/DeliveryMan/OrderDetails";

// ====================== WAREHOUSE STAFF PAGES ======================
import WarehouseStaffDashboard from "./pages/WarehouseStaff/WarehouseStaffDashboard";
import InventoryManagement from "./pages/WarehouseStaff/InventoryManagement";
import OrderProcessing from "./pages/WarehouseStaff/OrderProcessing";
import WarehouseOrderTracking from "./pages/WarehouseStaff/WarehouseOrdersTracking";
import WarehouseReports from "./pages/WarehouseStaff/WarehouseReports";

// ====================== ADMIN PAGES ======================
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminStaff from "./pages/Admin/AdminStaff";
import AdminAddStaff from "./pages/Admin/AdminAddStaff";
import AdminUpdateStaff from "./pages/Admin/AdminUpdateStaff";
import AdminSeller from "./pages/Admin/AdminSeller";
import AdminBuyer from "./pages/Admin/AdminBuyer";
import AdminDelivery from "./pages/Admin/AdminDelivery";
import AdminAddDelivery from "./pages/Admin/AdminAddDelivery";
import AdminUpdateDelivery from "./pages/Admin/AdminUpdateDelivery";
import AdminCategory from "./pages/Admin/AdminCategory";
import AdminAddCategory from "./pages/Admin/AdminAddCategory";
import AdminUpdateCategory from "./pages/Admin/AdminUpdateCategory";
import AdminAddSubCategory from "./pages/Admin/AdminAddSubCategory";
import AdminUpdateSubCategory from "./pages/Admin/AdminUpdateSubCategory"; 
import AdminProduct from "./pages/Admin/AdminProduct";
import AdminOrder from "./pages/Admin/AdminOrder";
import AdminPromotion from "./pages/Admin/AdminPromotion";
import AdminAddPromotion from "./pages/Admin/AdminAddPromotion";
import AdminUpdatePromotion from "./pages/Admin/AdminUpdatePromotion";
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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path="/" element={<BuyerHome />} />
        <Route path="/home" element={<BuyerHome />} />
        <Route path="/buyer/signup" element={<BuyerSignUp />} />
        <Route path="/signupway" element={<SignupWay />} />
        <Route path="/seller/signup" element={<SellerRegister />} />
        <Route path="/confirmcode" element={<ConfirmCode />} />
        <Route path="/emailverified" element={<EmailVerifiedSuccess />} />

        {/* Login with Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForAll />} />
        </Route>

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/staff/add" element={<AdminAddStaff />} />
        <Route path="/admin/staff/update/:id" element={<AdminUpdateStaff />} />
        
        <Route path="/admin/seller" element={<AdminSeller />} />
        <Route path="/admin/buyer" element={<AdminBuyer />} />
        <Route path="/admin/delivery" element={<AdminDelivery />} />
        <Route path="/admin/delivery/add" element={<AdminAddDelivery />} />
        <Route path="/admin/delivery/update/:id" element={<AdminUpdateDelivery />} />

        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/admin/category/add" element={<AdminAddCategory />} />
        <Route path="/admin/category/update/:id" element={<AdminUpdateCategory />} />
        <Route path="/admin/subcategory/add" element={<AdminAddSubCategory />} />
        <Route path="/admin/subcategory/update/:id" element={<AdminUpdateSubCategory />} />

        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/order" element={<AdminOrder />} />
        <Route path="/admin/promotion" element={<AdminPromotion />} />
        <Route path="/admin/promotion/add" element={<AdminAddPromotion />} />
        <Route path="/admin/promotion/update/:id" element={<AdminUpdatePromotion />} />

        <Route path="/admin/location" element={<AdminLocation />} />
        <Route path="/admin/location/add" element={<AdminAddLocation />} />
        <Route path="/admin/location/update/:id" element={<AdminUpdateLocation />} />

        {/* ==================== ASSISTANT ROUTES ==================== */}
        <Route path="/assistant/dashboard" element={<AssistantDashboard />} />
        <Route path="/assistant/category" element={<AssistantCategory />} />
        <Route path="/assistant/category/add" element={<AssistantAddCategory />} />
        <Route path="/assistant/subcategory/add" element={<AssistantAddSubCategory />} />
        <Route path="/assistant/warehouse/staff" element={<AssistantWarehouseStaff />} />
        <Route path="/assistant/warehouse/staff/update/:id" element={<AssistantUpdateWarehouseStaff />} />
        <Route path="/assistant/product" element={<AssistantProductManagement />} />
        <Route path="/assistant/emergency-orders" element={<AssistantEmergencyOrders />} />
        <Route path="/assistant/order" element={<AssistantOrder />} />
        <Route path="/assistant/seller" element={<AssistantSeller />} />

        {/* ==================== SELLER ROUTES ==================== */}
        <Route path="/seller/dashboard" element={<SellerDashboards />} />
        <Route path="/seller/products" element={<SellerManageProduct />} />
        <Route path="/seller/product/add" element={<SellerAddProduct />} />
        <Route path="/seller/product/edit/:id" element={<SellerEditProduct />} />
        <Route path="/seller/product/publish" element={<SellerPublishProduct />} />
        <Route path="/seller/product/unpublish" element={<SellerUnpublishProduct />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/orders/manage" element={<SellerManageOrders />} />
        <Route path="/seller/reviews" element={<SellerReviews />} />
        <Route path="/seller/profile" element={<SellerProfile />} />
        <Route path="/seller/logout" element={<SellerLogout />} />

        {/* ==================== DELIVERY MAN ROUTES ==================== */}
        <Route path="/delivery/dashboard" element={<DeliverymanDashboard />} />
        <Route path="/delivery/orders" element={<DeliverymanOrder />} />
        <Route path="/delivery/tracking" element={<DeliverymanTracking />} />
        <Route path="/delivery/earnings" element={<DeliveryEarnings />} />
        <Route path="/delivery/assigned" element={<AssignedDeliveries />} />
        <Route path="/delivery/today-orders" element={<TodayOrders />} />
        <Route path="/delivery/pending-orders" element={<PendingOrders />} />
        <Route path="/delivery/orders/:id" element={<OrderDetails />} />

        {/* ==================== WAREHOUSE STAFF ROUTES ==================== */}
        <Route path="/warehouse/dashboard" element={<WarehouseStaffDashboard />} />
        <Route path="/warehouse/inventory" element={<InventoryManagement />} />
        <Route path="/warehouse/orders" element={<OrderProcessing />} />
        <Route path="/warehouse/tracking" element={<WarehouseOrderTracking />} />
        <Route path="/warehouse/reports" element={<WarehouseReports />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;