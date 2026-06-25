/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logoImg from "../assets/logo.png";
import homeLogo from "../assets/homeremovebg.png";
import login from "../assets/login.png";
import signup from "../assets/signupRemove.png";

const NAV_ITEMS = [
  { label: "Home", icon: homeLogo, path: "/" },
  { label: "Login", icon: login, path: "/login" },
  { label: "Sign Up", icon: signup, path: "/buyer/signup" },
];

type BuyerNavbarProps = {
  cartQty?: number;
  activeCat?: string;
  onCatChange?: (category: string) => void;
  categories?: string[];
};

export default function BuyerNavbar({ 
  activeCat: propActiveCat = "All", 
  onCatChange,
  categories = [],
}: BuyerNavbarProps) {
  
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Home");
  const [activeCat, setActiveCat] = useState(propActiveCat);
  const [searchTerm, setSearchTerm] = useState("");

  const categoryTabs = ["All", ...new Set(categories)];

  useEffect(() => {
    setActiveCat(propActiveCat);
  }, [propActiveCat]);

  const handleNavigation = (label: string, path: string) => {
    setActiveNav(label);
    navigate(path);
  };

  const handleCategory = (label: string) => {
    setActiveCat(label);
    onCatChange?.(label);
    
    const path = label === "All" 
      ? "/allproducts" 
      : `/allproducts?category=${encodeURIComponent(label)}`;
    navigate(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/allproducts?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          
          {/* Logo */}
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-11 h-11 bg-white rounded-2xl overflow-hidden border border-emerald-200 shadow flex items-center justify-center">
              <img src={logoImg} alt="Sajilo Mart" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="text-xl font-black text-emerald-700 tracking-tight">Sajilo Mart</p>
              <p className="text-[10px] text-gray-500 -mt-1">Shop Anytime, Anywhere</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-5 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-violet-500 text-sm placeholder:text-gray-400"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 text-white p-2.5 rounded-xl hover:bg-violet-700 transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.label, item.path)}
                className={`flex flex-col items-center px-4 py-2 text-xs rounded-2xl transition-all
                  ${activeNav === item.label 
                    ? "text-violet-700 bg-violet-50 font-semibold" 
                    : "text-gray-600 hover:text-violet-600 hover:bg-violet-50"}`}
              >
                <img src={item.icon} className="w-6 h-6 mb-1" alt={item.label} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 pb-4 overflow-x-auto hide-scroll">
          {categoryTabs.map((label) => (
            <button
              key={label}
              onClick={() => handleCategory(label)}
              className={`px-6 py-2 text-sm font-medium rounded-2xl whitespace-nowrap transition-all border
                ${activeCat === label 
                  ? "bg-violet-600 text-white border-violet-600" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700"
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