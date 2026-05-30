import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logoImg from "../assets/logo.png";
import homeLogo from "../assets/homeremovebg.png";
import loginIcon from "../assets/login.png";
import signupIcon from "../assets/signupRemove.png";
import account from "../assets/account logo.jpg";
import logout from "../assets/logoutremovebg.png";

const GUEST_NAV_ITEMS = [
  { label: "Home", icon: homeLogo, path: "/" },
  { label: "Login", icon: loginIcon, path: "/login" },
  { label: "Sign Up", icon: signupIcon, path: "/buyer/signup" },
];

const AUTH_NAV_ITEMS = [
  { label: "Home", icon: homeLogo, path: "/allproducts" },
  { label: "Account", icon: account, path: "/account" },
  { label: "Logout", icon: logout, path: "/" },
];

type BuyerNavbarProps = {
  cartQty?: number;
  activeCat?: string;
  onCatChange?: (category: string) => void;
  categories?: string[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
};

export default function BuyerNavbar({ 
  activeCat: propActiveCat = "All", 
  onCatChange,
  categories = [],
  searchQuery = "",
  onSearchChange,
  cartQty = 0 
}: BuyerNavbarProps) {
  
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [activeCat, setActiveCat] = useState(propActiveCat);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const categoryTabs = ["All", ...new Set(categories)];

  useEffect(() => {
    setActiveCat(propActiveCat);
  }, [propActiveCat]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    setIsLoggedIn(loggedIn && role === "buyer" && !!username);
  }, []);

  const navItems = isLoggedIn ? AUTH_NAV_ITEMS : GUEST_NAV_ITEMS;

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  const handleCategoryClick = (label: string) => {
    setActiveCat(label);
    onCatChange?.(label);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    } else {
      navigate(`/allproducts?search=${encodeURIComponent(localSearch)}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Row */}
        <div className="flex items-center justify-between py-3">
          
          {/* Logo */}
          <div 
            onClick={() => navigate(isLoggedIn ? "/buyer/home" : "/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-green-200 shadow">
              <img src={logoImg} alt="Sajilo Mart" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-xl font-black text-emerald-700 tracking-tight">Sajilo Mart</p>
              <p className="text-[10px] text-gray-500 -mt-1">Shop Anytime, Anywhere</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-8">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  onSearchChange?.(e.target.value);
                }}
                className="w-full pl-5 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 text-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 text-white p-2.5 rounded-xl hover:bg-teal-700 transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => item.label === "Logout" ? handleLogout() : navigate(item.path)}
                className="flex flex-col items-center px-3 py-1 text-xs text-gray-600 hover:text-teal-700 transition-colors"
              >
                <img src={item.icon} alt={item.label} className="w-6 h-6 mb-1" />
                {item.label}
              </button>
            ))}

            {isLoggedIn && (
              <button
                onClick={() => navigate("/cart")}
                className="flex flex-col items-center px-3 py-1 text-xs text-gray-600 hover:text-teal-700 transition-colors relative"
              >
                <div className="relative">
                  🛒
                  {cartQty > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[17px] h-[17px] flex items-center justify-center rounded-full">
                      {cartQty}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 pb-4 overflow-x-auto hide-scroll">
          {categoryTabs.map((label) => (
            <button
              key={label}
              onClick={() => handleCategoryClick(label)}
              className={`px-6 py-2 text-sm font-medium rounded-2xl whitespace-nowrap transition-all
                ${activeCat === label 
                  ? "bg-slate-900 text-white" 
                  : "bg-white border border-gray-200 hover:border-teal-300 text-gray-700"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
