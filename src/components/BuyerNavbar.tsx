import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoImg from "../assets/logo.png";
import homeLogo from "../assets/homeremovebg.png";
import login from "../assets/login.png";
import signup from "../assets/signupRemove.png";
import account from "../assets/accountbgremove.png";
import logout from "../assets/logoutbgremoved.png";
import cart from "../assets/cartbgremove.png";

const NAV_ITEMS = [
  { label: "Home", emoji: homeLogo, path: "/" },
  { label: "Login", emoji: login, path: "/login" },
  { label: "SignUp", emoji: signup, path: "/signup" },
  { label: "Account", emoji: account, path: "/account" },
  { label: "Logout", emoji: logout, path: "/logout" },
  { label: "Cart", emoji: cart, path: "/cart" },
];

const CAT_TABS = [
  { label: "All", path: "/products" },
  { label: "Fashion", path: "/fashion" },
  { label: "Electronics", path: "/electronics" },
  { label: "Home Goods", path: "/homegoods" },
  { label: "Cosmetics", path: "/cosmetics" },
  { label: "Medicine", path: "/medicine" },
  { label: "Study Materials", path: "/studymaterials" },
  { label: "Shoes", path: "/shoes" },
  { label: "Accessories", path: "/accessories" },

  // 🔥 IMPORTANT: Others also goes to full product page
  { label: "Others", path: "/products" },
];

type BuyerNavbarProps = {
  cartQty: number;
};

export default function BuyerNavbar({ cartQty }: BuyerNavbarProps) {
  const [activeNav, setActiveNav] = useState("Home");
  const [activeCat, setActiveCat] = useState("All");

  const navigate = useNavigate();

  /* ─────────────────────────────────────────────
     NAVIGATION HANDLER
  ───────────────────────────────────────────── */
  const handleNavigation = (label: string, path: string) => {
    setActiveNav(label);
    navigate(path);
  };

  /* ─────────────────────────────────────────────
     CATEGORY HANDLER
  ───────────────────────────────────────────── */
  const handleCategory = (label: string, path: string) => {
    setActiveCat(label);
    navigate(path);
  };

  return (
    <header className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ───────────── ROW 1 ───────────── */}
        <div className="flex items-center gap-3 py-2">

          {/* LOGO */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 shrink-0 bg-transparent border-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-green-400/30 bg-white flex items-center justify-center">
              <img src={logoImg} className="w-10 h-10 object-contain" />
            </div>

            <div className="text-left leading-none">
              <p className="text-[15px] font-black text-blue-700">
                Sajilo Mart
              </p>
              <p className="text-[9px] text-gray-400 italic">
                Shop Anytime, Anywhere
              </p>
            </div>
          </button>

          {/* SEARCH */}
          <div className="flex flex-1 items-center rounded-full border-2 border-violet-200 h-9 bg-gray-50 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 text-sm outline-none bg-transparent"
            />
            <button className="bg-violet-600 text-white w-10 h-9">
              🔍
            </button>
          </div>

          {/* NAV ITEMS */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() =>
                  handleNavigation(item.label, item.path)
                }
                className={`flex flex-col items-center px-2 py-1 text-[10px] rounded-lg
                  ${
                    activeNav === item.label
                      ? "text-violet-700 bg-violet-50 font-bold"
                      : "text-gray-500 hover:text-violet-600 hover:bg-violet-50"
                  }`}
              >
                <img
                  src={item.emoji}
                  className="w-5 h-5"
                  alt={item.label}
                />
                {item.label}

                {item.label === "Cart" && cartQty > 0 && (
                  <span className="absolute text-[8px] bg-red-500 text-white rounded-full px-1">
                    {cartQty}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* ───────────── CATEGORIES ───────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CAT_TABS.map((c) => (
            <button
              key={c.label}
              onClick={() =>
                handleCategory(c.label, c.path)
              }
              className={`px-4 py-1 rounded-full text-xs border
                ${
                  activeCat === c.label
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-gray-600 border-gray-300"
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