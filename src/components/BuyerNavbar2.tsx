import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logoImg from "../assets/logo.png";
import homeLogo from "../assets/homeremovebg.png";
import account from "../assets/account logo.jpg";
import logout from "../assets/logoutremovebg.png";

const NAV_ITEMS = [
  { label: "Home", emoji: homeLogo, path: "/buyer/home" },
  { label: "Account", emoji: account, path: "/account" },
  { label: "Logout", emoji: logout, path: "/" },
];

const CAT_TABS = [
  { label: "All", path: "/allproducts" },
  { label: "Fashion", path: "/fashion" },
  { label: "Electronics", path: "/electronics" },
  { label: "Home Goods", path: "/homegoods" },
  { label: "Cosmetics", path: "/cosmetics" },
  { label: "Medicine", path: "/medicine" },
  { label: "Study Materials", path: "/studymaterials" },
  { label: "Shoes", path: "/shoes" },
  { label: "Accessories", path: "/accessories" },
  { label: "Others", path: "/allproducts" },
];

type BuyerNavbarProps = {
  cartQty?: number;
  activeCat?: string;
  onCatChange?: (category: string) => void;
};

export default function BuyerNavbar({ 
  activeCat: propActiveCat, 
  onCatChange,
  cartQty = 0 
}: BuyerNavbarProps) {
  
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Home");
  const [activeCat, setActiveCat] = useState(propActiveCat || "All");

  useEffect(() => {
    if (propActiveCat !== undefined) {
      setActiveCat(propActiveCat);
    }
  }, [propActiveCat]);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("buyer_id");
    localStorage.removeItem("seller_id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const handleNavigation = (label: string, path: string) => {
    if (label === "Logout") {
      handleLogout();
      return;
    }

    setActiveNav(label);
    navigate(path);
  };

  const handleCategory = (label: string, path: string) => {
    setActiveCat(label);
    onCatChange?.(label);
    navigate(path);
  };

  return (
    <header className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ROW 1 - Logo + Search + Nav */}
        <div className="flex items-center gap-3 py-2">
          {/* LOGO */}
          <button
            onClick={() => navigate("/buyer/home")}
            className="flex items-center gap-2 shrink-0 bg-transparent border-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-green-400/30 bg-white flex items-center justify-center">
              <img src={logoImg} className="w-10 h-10 object-contain" alt="Sajilo Mart" />
            </div>
            <div className="text-left leading-none">
              <p className="text-[15px] font-black text-blue-700">Sajilo Mart</p>
              <p className="text-[9px] text-gray-400 italic">Shop Anytime, Anywhere</p>
            </div>
          </button>

          {/* SEARCH */}
          <div className="flex flex-1 items-center rounded-full border-2 border-violet-200 h-9 bg-gray-50 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 text-sm outline-none bg-transparent"
            />
            <button className="bg-violet-600 text-white w-10 h-9 rounded-r-full hover:bg-violet-700 transition-colors">
              🔍
            </button>
          </div>

          {/* NAV ITEMS */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.label, item.path)}
                className={`flex flex-col items-center px-3 py-1 text-[10px] rounded-lg transition-all
                  ${activeNav === item.label
                    ? "text-violet-700 bg-violet-50 font-bold"
                    : "text-gray-500 hover:text-violet-600 hover:bg-violet-50"
                  }`}
              >
                <img src={item.emoji} className="w-5 h-5 mb-0.5" alt={item.label} />
                {item.label}
              </button>
            ))}

            {/* Cart Button with Quantity Badge */}
            <button
              onClick={() => navigate("/cart")}
              className={`flex flex-col items-center px-3 py-1 text-[10px] rounded-lg transition-all relative
                ${activeNav === "Cart" ? "text-violet-700 bg-violet-50 font-bold" : "text-gray-500 hover:text-violet-600 hover:bg-violet-50"}`}
            >
              <div className="relative">
                🛒
                {cartQty > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-0.5">
                    {cartQty > 99 ? "99+" : cartQty}
                  </span>
                )}
              </div>
              Cart
            </button>
          </nav>
        </div>

        {/* CATEGORIES TABS */}
        <div className="flex gap-2 overflow-x-auto pb-3 hide-scroll scrollbar-hide">
          {CAT_TABS.map((c) => (
            <button
              key={c.label}
              onClick={() => handleCategory(c.label, c.path)}
              className={`px-5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all
                ${activeCat === c.label
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
