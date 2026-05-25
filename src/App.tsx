import { BrowserRouter, Route, Routes } from "react-router-dom";

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
import AdminAddSubCategory from "./pages/Admin/AdminAddSubCategory";
import AdminProduct from "./pages/Admin/AdminProduct";
import AdminOrder from "./pages/Admin/AdminOrder";
import AdminPromotion from "./pages/Admin/AdminPromotion";
import AdminAddPromotion from "./pages/Admin/AdminAddPromotion";
import AdminLocation from "./pages/Admin/AdminLocation";
import AdminAddLocation from "./pages/Admin/AdminAddLocation";
import AdminEarnings from "./pages/Admin/AdminEarnigns";

// ====================== ASSISTANT PAGES ======================
import AssistantDashboard from "./pages/Assistant/AssistantDashboard";
import AssistantCategory from "./pages/Assistant/AssistantCategory";
import AssistantAddCategory from "./pages/Assistant/AssistantAddCategory";
import AssistantAddSubCategory from "./pages/Assistant/AssistantAddSubCategory";
import AssistantWarehouseStaff from "./pages/Assistant/AssistantWarehouseStaff";
import AssistantProductManagement from "./pages/Assistant/AssistantProductManagement";
import AssistantOrder from "./pages/Assistant/AssistantOrder";
import AssistantSeller from "./pages/Assistant/AssistantSeller";

// ====================== BUYER PAGES ======================
import BuyerHome from "./pages/Buyer/home/BuyerHome";
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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ====================== PUBLIC ROUTES ====================== */}
        <Route path="/" element={<Home />} />

        {/* ====================== AUTH ROUTES ====================== */}
        <Route path="/login" element={<LoginForAll />} />
        <Route path="/signupway" element={<SignupWay />} />
        <Route path="/confirmcode" element={<ConfirmCode />} />
        <Route path="/emailverified" element={<EmailVerifiedSuccess />} />

        {/* ====================== REGISTER ROUTES ====================== */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/buyer/signup" element={<BuyerSignUp />} />

        {/* ====================== ADMIN ROUTES ====================== */}
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
        <Route path="/admin/subcategory/add" element={<AdminAddSubCategory />} />

        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/order" element={<AdminOrder />} />

        <Route path="/admin/promotion" element={<AdminPromotion />} />
        <Route path="/admin/promotion/add" element={<AdminAddPromotion />} />

        <Route path="/admin/earnings" element={<AdminEarnings />} />

        <Route path="/admin/location" element={<AdminLocation />} />
        <Route path="/admin/location/add" element={<AdminAddLocation />} />

        {/* ====================== ASSISTANT ROUTES ====================== */}
        <Route path="/assistant/dashboard" element={<AssistantDashboard />} />

        <Route path="/assistant/category" element={<AssistantCategory />} />
        <Route path="/assistant/category/add" element={<AssistantAddCategory />} />
        <Route path="/assistant/subcategory/add" element={<AssistantAddSubCategory />} />

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

        {/* ====================== BUYER ROUTES ====================== */}
        <Route path="/buyer/home" element={<BuyerHome />} />
        <Route path="/home/BuyerHome" element={<BuyerHome />} />
        <Route path="/buyerhome" element={<BuyerHome />} />

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

      </Routes>
    </BrowserRouter>
  );
};

export default App;