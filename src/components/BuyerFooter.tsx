import { useState } from "react";

const TOKEN = {
  footerBg: "#100025",
};

export default function BuyerFooter() {
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  return (
    <footer
      className="mt-12 pt-10 pb-4"
      style={{ background: TOKEN.footerBg, color: "#fff" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold mb-2">Sajilo Mart</h2>

            <p className="text-xs text-gray-400 leading-relaxed">
              Your trusted online shopping partner.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-bold mb-3 text-white">
              Quick Links
            </p>

            {["Home", "About", "Products", "Contact"].map((l) => (
              <p
                key={l}
                className="text-xs text-gray-400 mb-2 cursor-pointer hover:text-violet-300"
              >
                {l}
              </p>
            ))}
          </div>

          {/* Customer Service */}
          <div>
            <p className="text-sm font-bold mb-3 text-white">
              Customer Service
            </p>

            {["Track Order", "Wishlist", "Help Center"].map((l) => (
              <p
                key={l}
                className="text-xs text-gray-400 mb-2 cursor-pointer hover:text-violet-300"
              >
                {l}
              </p>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-sm font-bold mb-2 text-white">
              Newsletter
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#1e0050] text-white text-xs outline-none"
            />

            <button
              onClick={() => {
                if (email) setSubbed(true);
              }}
              className="w-full mt-2 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold"
            >
              {subbed ? "✓ Subscribed!" : "Subscribe"}
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-4 text-center">
          <span className="text-xs text-gray-500">
            © 2026 Sajilo Mart. All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
}