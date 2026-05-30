import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleProfileModal from "../../components/RoleProfileModal";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

export default function SellerProfile() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(true);

  const closeProfile = () => {
    setProfileOpen(false);
    navigate("/seller/dashboard");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>
      <SellerSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <SellerNavbar />
        <main style={{ padding: "32px" }}>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Seller Profile</h2>
          <p style={{ color: "#64748b", marginTop: "8px" }}>
            View and update your seller account information.
          </p>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            style={{
              marginTop: "18px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
              padding: "11px 18px",
            }}
          >
            Open Profile
          </button>
        </main>
      </div>
      <RoleProfileModal open={profileOpen} onClose={closeProfile} />
    </div>
  );
}
