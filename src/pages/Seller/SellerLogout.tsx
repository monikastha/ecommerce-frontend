import { useState } from "react";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

export default function SellerLogout() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="flex w-full h-screen bg-gray-100 font-sans text-[13px]">

      {/* Sidebar (same as dashboard) */}
      <SellerSidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar (same as dashboard) */}
        <SellerNavbar />

        {/* Page Content */}
        <div className="relative flex-1 flex items-center justify-center">

          {/* Logout Modal */}
          {showModal && (
            <div className="w-90 bg-white border rounded-md shadow-lg overflow-hidden">

              {/* Top bar */}
              <div className="bg-blue-500 h-12 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-12 h-12 bg-red-600 text-white font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 text-center">
                <p className="text-gray-800 mb-6 text-sm">
                  Are you sure you want to logout?
                </p>

                <div className="flex justify-center gap-3">
                  <button className="px-6 py-2 border rounded text-sm bg-white hover:bg-gray-100">
                    Yes
                  </button>

                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border rounded text-sm bg-white hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}