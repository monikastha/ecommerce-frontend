import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faRightFromBracket,
  faTimes,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

const WarehouseStaffNavbar = () => {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    name: "Warehouse Staff",
    email: "staff@example.com",
    phone: "+977 9841XXXXXX",
    address: "Pokhara, Nepal",
    avatar: logo,
  });

  const [formData, setFormData] = useState<ProfileData>(profile);
  const [previewImage, setPreviewImage] = useState<string>(profile.avatar);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("warehouseProfile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setFormData(parsed);
      setPreviewImage(parsed.avatar);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("warehouseProfile");
    navigate("/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openProfileModal = () => {
    setFormData(profile);
    setPreviewImage(profile.avatar);
    setModalOpen(true);
    setProfileOpen(false);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProfile = { ...formData, avatar: previewImage };
    setProfile(updatedProfile);
    localStorage.setItem("warehouseProfile", JSON.stringify(updatedProfile));
    setModalOpen(false);
    setIsEditing(false);
  };

  return (
    <>
      <style>{`
        .navbar {
          height: 72px;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0;
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 999;
          margin-left:0px;
          width: 100%;
        }

        .navbar-left h2 { 
          font-size: 19px; 
          margin: 0; 
          color: #0f172a; 
          font-weight: 600; 
        }
        .navbar-left p { 
          font-size: 13px; 
          color: #64748b; 
          margin-top: 2px; 
        }

        .navbar-right { 
          display: flex; 
          align-items: center; 
          gap: 18px; 
        }

        .icon {
          font-size: 19px;
          cursor: pointer;
          color: #475569;
          transition: 0.2s;
        }
        .icon:hover { 
          color: #5BBF9A; 
          transform: scale(1.1); 
        }

        .profile {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #e2e8f0;
          object-fit: cover;
        }
        .profile:hover { border-color: #5BBF9A; }

        .dropdown {
          position: absolute;
          top: 58px;
          right: 10px;
          width: 180px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          overflow: hidden;
          z-index: 1001;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 480px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          overflow: hidden;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body { padding: 24px; }

        .avatar-upload {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 20px;
        }

        .avatar-preview {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #f1f5f9;
        }

        .camera-icon {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: #5BBF9A;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: #475569;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 15px;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
      `}</style>

      <div className="navbar">
        {/* LEFT */}
        <div className="navbar-left">
          <h2>{getGreeting()}, Warehouse Staff 👋</h2>
          <p>Manage inventory & orders</p>
        </div>

        {/* RIGHT */}
        <div className="navbar-right">
          <FontAwesomeIcon icon={faBell} className="icon" />

          {/* PROFILE */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <img
              className="profile"
              src={profile.avatar}
              alt="profile"
              onClick={() => setProfileOpen(!profileOpen)}
            />

            {profileOpen && (
              <div className="dropdown">
                <div 
                  onClick={openProfileModal} 
                  style={{ padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <FontAwesomeIcon icon={faUser} />
                  Profile
                </div>

                <div 
                  onClick={handleLogout} 
                  style={{ 
                    padding: "12px 16px", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "10px", 
                    color: "#ef4444",
                    borderTop: "1px solid #f1f5f9"
                  }}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{isEditing ? "Edit Profile" : "My Profile"}</h3>
              <FontAwesomeIcon
                icon={faTimes}
                style={{ cursor: "pointer", fontSize: "20px" }}
                onClick={() => setModalOpen(false)}
              />
            </div>

            <div className="modal-body">
              <div className="avatar-upload">
                <img src={previewImage} alt="avatar" className="avatar-preview" />
                {isEditing && (
                  <div className="camera-icon" onClick={() => fileInputRef.current?.click()}>
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  rows={3}
                  value={formData.address}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white" }}>
                    Edit Profile
                  </button>
                  <button onClick={() => setModalOpen(false)} style={{ padding: "10px 20px", borderRadius: "8px", background: "#64748b", color: "white" }}>
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setIsEditing(false); setFormData(profile); setPreviewImage(profile.avatar); }} style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} style={{ padding: "10px 20px", borderRadius: "8px", background: "#5BBF9A", color: "white" }}>
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WarehouseStaffNavbar;