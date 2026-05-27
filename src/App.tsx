import { BrowserRouter, Route, Routes } from "react-router-dom";

// ====================== AUTHENTICATION & COMMON PAGES ======================
import LandingPage from "./pages/Buyer/home/LandingPage";
import BuyerHome from "./pages/Buyer/home/BuyerHome";
import BuyerSignUp from "./pages/authentication/BuyerSignUp";
import LoginForAll from "./pages/authentication/LoginForAll";
import AuthLayout from "./pages/layouts/AuthLayout";
import ConfirmCode from "./pages/authentication/ConfirmCode";
import SignupWay from "./pages/authentication/SignupWay";
import EmailVerifiedSuccess from "./pages/authentication/EmailVerifiedSuccess";
import SellerRegister from "./pages/authentication/SellerRegister";
import ProtectedRoute from "./components/ProtectedRoute";

// ====================== BUYER PAGES ======================
import ProductPage from "./pages/Buyer/home/ProductPage";
import ViewAllProducts from "./pages/Buyer/home/ViewAllProduct";
import ViewAllCategories from "./pages/Buyer/home/ViewAllCategories";
import Fashion from "./pages/Buyer/home/Fashion";
import Electronics from "./pages/Buyer/home/Electronics";
import HomeGoods from "./pages/Buyer/home/HomeGoods";
import Cosmetics from "./pages/Buyer/home/Cosmetics";
import Shoes from "./pages/Buyer/home/Shoes";
import Accessories from "./pages/Buyer/home/Accessories";
import Medicine from "./pages/Buyer/home/Medicine";
import StudyMaterials from "./pages/Buyer/home/StudyMaterials";
import Checkout from "./pages/Buyer/home/Checkout";
import Payment from "./pages/Buyer/home/Payment";
import Home from "./pages/Buyer/home/BuyerHome";
import OrderTracking from "./pages/Buyer/home/OrderTracking";
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
import AdminProduct from "./pages/Admin/AdminProduct";
import AdminOrder from "./pages/Admin/AdminOrder";
import AdminPromotion from "./pages/Admin/AdminPromotion";
import AdminAddPromotion from "./pages/Admin/AdminAddPromotion";
import AdminUpdatePromotion from "./pages/Admin/AdminUpdatePromotion";
import AdminLocation from "./pages/Admin/AdminLocation";
import AdminAddLocation from "./pages/Admin/AdminAddLocation";
// import AdminEarnings from "./pages/Admin/AdminEarnigns";

// ====================== ASSISTANT PAGES ======================
import AssistantDashboard from "./pages/Assistant/AssistantDashboard";
import AssistantCategory from "./pages/Assistant/AssistantCategory";
import AssistantAddCategory from "./pages/Assistant/AssistantAddCategory";
import AssistantWarehouseStaff from "./pages/Assistant/AssistantWarehouseStaff";
import AssistantUpdateWarehouseStaff from "./pages/Assistant/AssistantUpdateWarehouseStaff";
import AssistantProductManagement from "./pages/Assistant/AssistantProductManagement";
import AssistantOrder from "./pages/Assistant/AssistantOrder";
import AssistantSeller from "./pages/Assistant/AssistantSeller";
import AssistantDeliveryMan from "./pages/Assistant/AssistantDeliveryMan";
import AssistantUpdateDeliveryMan from "./pages/Assistant/AssistantUpdateDeliveryMan";
import AssistantBuyer from "./pages/Assistant/AssistantBuyer";
import AssistantUpdateCategory from "./pages/Assistant/AssistantUpdateCategory";

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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path="/" element={<LandingPage  />} />
        <Route path="/buyer/signup" element={<BuyerSignUp />} />
        <Route path="/signupway" element={<SignupWay />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/confirmcode" element={<ConfirmCode />} />
        <Route path="/emailverified" element={<EmailVerifiedSuccess />} />

        {/* Login Route */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForAll />} />
        </Route>

        {/* ==================== BUYER ROUTES ==================== */}
        <Route path="/product" element={<ProductPage />} />
        <Route path="/allproducts" element={<ViewAllProducts />} />
        <Route path="/allcategories" element={<ViewAllCategories />} />

        <Route path="/fashion" element={<Fashion />} />
        <Route path="/electronics" element={<Electronics />} />
        <Route path="/homegoods" element={<HomeGoods />} />
        <Route path="/cosmetics" element={<Cosmetics />} />
        <Route path="/shoes" element={<Shoes />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/medicine" element={<Medicine />} />
        <Route path="/studymaterials" element={<StudyMaterials />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/ordertracking" element={<OrderTracking />} />

        <Route element={<ProtectedRoute allowedRoles={["buyer"]} />}>
          <Route path="/home" element={<Home/>} />
          <Route path="/buyer/home" element={<BuyerHome />} />
        </Route>

    

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
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

          <Route path="/admin/product" element={<AdminProduct />} />
          <Route path="/admin/order" element={<AdminOrder />} />

          <Route path="/admin/promotion" element={<AdminPromotion />} />
          <Route path="/admin/promotion/add" element={<AdminAddPromotion />} />
          <Route path="/admin/promotion/update/:id" element={<AdminUpdatePromotion />} />

          <Route path="/admin/location" element={<AdminLocation />} />
          <Route path="/admin/location/add" element={<AdminAddLocation />} />

          {/* <Route path="/admin/earnings" element={<AdminEarnings />} /> */}
        </Route>

        {/* ==================== ASSISTANT ROUTES ==================== */}
        <Route element={<ProtectedRoute allowedRoles={["assistant"]} />}>
          <Route path="/assistant/dashboard" element={<AssistantDashboard />} />
          <Route path="/assistant/category" element={<AssistantCategory />} />
          <Route path="/assistant/category/add" element={<AssistantAddCategory />} />
          <Route path="/assistant/category/update/:id" element={<AssistantUpdateCategory />} />

          <Route path="/assistant/warehouse/staff" element={<AssistantWarehouseStaff />} />
          <Route path="/assistant/warehouse/staff/update/:id" element={<AssistantUpdateWarehouseStaff />} />
          <Route path="/assistant/product" element={<AssistantProductManagement />} />

          <Route path="/assistant/order" element={<AssistantOrder />} />

          <Route path="/assistant/seller" element={<AssistantSeller />} />

          <Route path="/assistant/delivery-man" element={<AssistantDeliveryMan />} />
          <Route path="/assistant/delivery-man/update/:id" element={<AssistantUpdateDeliveryMan />} />

          <Route path="/assistant/buyer" element={<AssistantBuyer />} />
        </Route>

        {/* ==================== SELLER ROUTES ==================== */}
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller/dashboard" element={<SellerDashboards />} />
          <Route path="/seller/manageproduct" element={<SellerManageProduct />} />
          <Route path="/seller/product/add" element={<SellerAddProduct />} />
          <Route path="/seller/product/edit/:id" element={<SellerEditProduct />} />
          <Route path="/seller/product/publish" element={<SellerPublishProduct />} />
          <Route path="/seller/product/unpublish" element={<SellerUnpublishProduct />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/orders/manage" element={<SellerManageOrders />} />
          <Route path="/seller/reviews" element={<SellerReviews />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
        </Route>

        {/* ==================== DELIVERY ROUTES ==================== */}
        <Route element={<ProtectedRoute allowedRoles={["delivery"]} />}>
          <Route path="/delivery/dashboard" element={<DeliverymanDashboard />} />
          <Route path="/delivery/orders" element={<DeliverymanOrder />} />
          <Route path="/delivery/tracking" element={<DeliverymanTracking />} />
          <Route path="/delivery/earnings" element={<DeliveryEarnings />} />
          <Route path="/delivery/assigned" element={<AssignedDeliveries />} />
          <Route path="/delivery/today-orders" element={<TodayOrders />} />
          <Route path="/delivery/pending-orders" element={<PendingOrders />} />
          <Route path="/delivery/orders/:id" element={<OrderDetails />} />
        </Route>

        {/* ==================== WAREHOUSE STAFF ROUTES ==================== */}
        <Route element={<ProtectedRoute allowedRoles={["warehousestaff"]} />}>
          <Route path="/warehouse/dashboard" element={<WarehouseStaffDashboard />} />
          <Route path="/warehouse/inventory" element={<InventoryManagement />} />
          <Route path="/warehouse/orders" element={<OrderProcessing />} />
          <Route path="/warehouse/tracking" element={<WarehouseOrderTracking />} />
          <Route path="/warehouse/reports" element={<WarehouseReports />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
