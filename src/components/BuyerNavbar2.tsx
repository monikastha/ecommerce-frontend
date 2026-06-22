/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import logoImg from "../assets/logo.png";
import homeLogo from "../assets/homeremovebg.png";
import loginIcon from "../assets/login.png";
import signupIcon from "../assets/signupRemove.png";
import account from "../assets/account logo.jpg";
import logout from "../assets/logoutremovebg.png";
import ProfileAvatar from "./ProfileAvatar";
import { getBuyerWishlistCount } from "../utils/buyerWishlist";

const normalizeApiOrigin = (value: string) => {
  const raw = String(value || "").trim();
  if (!raw) return "http://127.0.0.1:8000";
  const normalized = raw.replace(/\/+$/, "");
  return normalized.startsWith("http://") || normalized.startsWith("https://")
    ? normalized
    : `http://${normalized}`;
};

const API_ORIGIN = normalizeApiOrigin(import.meta.env.VITE_API_URL || "http://127.0.0.1:8000");

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


const EMPTY_CATEGORIES: string[] = [];

type BuyerNavbarProps = {
  cartQty?: number;
  activeCat?: string;
  onCatChange?: (category: string) => void;
  categories?: string[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showAllCategory?: boolean;
};

export default function BuyerNavbar({ 
  activeCat: propActiveCat = "All", 
  onCatChange,
  categories = EMPTY_CATEGORIES,
  searchQuery = "",
  onSearchChange,
  cartQty = 0,
  showAllCategory = true
}: BuyerNavbarProps) {
  
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [activeCat, setActiveCat] = useState(propActiveCat);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlistQty, setWishlistQty] = useState(getBuyerWishlistCount());
  const [internalCategories, setInternalCategories] = useState<string[]>(categories);

  const categoryTabs = showAllCategory ? ["All", ...new Set(internalCategories)] : [...new Set(internalCategories)];

  useEffect(() => {
    setActiveCat(propActiveCat);
  }, [propActiveCat]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setInternalCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (categories.length > 0 || !showAllCategory) return;

    const buildCategoryEndpoints = () => {
      const normalizedPath = "/api/productcategory/categories/";
      return Array.from(
        new Set([
          `${API_ORIGIN}${normalizedPath}`,
          `${API_ORIGIN.replace("localhost", "127.0.0.1")}${normalizedPath}`,
          `${API_ORIGIN.replace("127.0.0.1", "localhost")}${normalizedPath}`,
          normalizedPath,
        ])
      );
    };

    const fetchCategories = async () => {
      let lastError: unknown;
      for (const url of buildCategoryEndpoints()) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;
          const data = await response.json();
          const payload = Array.isArray(data)
            ? data
            : data?.results || data?.data || data?.categories || [];
          if (!Array.isArray(payload)) continue;

          const names = Array.from(
            new Set(
              payload
                .map((item: any) => {
                  if (typeof item === "string") return item;
                  if (typeof item === "object" && item !== null) {
                    return item.name || item.title || item.category || null;
                  }
                  return null;
                })
                .filter(Boolean)
            )
          );

          if (names.length) {
            setInternalCategories(names);
            return;
          }
        } catch (err) {
          lastError = err;
        }
      }
      console.error("Failed to load navbar categories from any endpoint:", lastError);
    };

    fetchCategories();
  }, [categories, showAllCategory]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    setIsLoggedIn(loggedIn && role === "buyer" && !!username);
  }, []);

  useEffect(() => {
    const refreshWishlist = () => setWishlistQty(getBuyerWishlistCount());
    window.addEventListener("buyer-wishlist-change", refreshWishlist);
    window.addEventListener("storage", refreshWishlist);
    return () => {
      window.removeEventListener("buyer-wishlist-change", refreshWishlist);
      window.removeEventListener("storage", refreshWishlist);
    };
  }, []);

  const navItems = isLoggedIn ? AUTH_NAV_ITEMS : GUEST_NAV_ITEMS;

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  const handleCategoryClick = (label: string) => {
    setActiveCat(label);
    if (onCatChange) {
      onCatChange(label);
      return;
    }

    const categoryPath =
      label === "All"
        ? "/allproducts"
        : `/allproducts?category=${encodeURIComponent(label)}`;
    navigate(categoryPath);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
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
                placeholder="Search products by name or price..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
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
                {item.label === "Account" ? (
                  <ProfileAvatar className="w-6 h-6 mb-1 rounded-full object-cover" />
                ) : (
                  <img src={item.icon} alt={item.label} className="w-6 h-6 mb-1" />
                )}
                {item.label}
              </button>
            ))}

            {isLoggedIn && (
              <button
                onClick={() => navigate("/myorders")}
                className="flex flex-col items-center px-3 py-1 text-xs text-gray-600 hover:text-teal-700 transition-colors relative"
              >
                <div className="relative text-lg leading-none">
                  📦
                </div>
                <span>My Orders</span>
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={() => navigate("/wishlist")}
                className="flex flex-col items-center px-3 py-1 text-xs text-gray-600 hover:text-rose-600 transition-colors relative"
              >
                <div className="relative text-lg leading-none">
                  ♥
                  {wishlistQty > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold min-w-[17px] h-[17px] flex items-center justify-center rounded-full">
                      {wishlistQty}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </button>
            )}

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
        <div className="flex gap-2 pb-4 overflow-x-auto hide-scroll min-h-[44px] items-center">
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