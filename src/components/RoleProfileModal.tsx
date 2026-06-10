import { type ChangeEvent, useEffect, useState } from "react";
import { imageUrl, saveProfileToStorage } from "./ProfileAvatar";

type ProfileData = {
  id?: number;
  user?: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  profile_image: string;
  role: string;
  password: string;
};

type RoleProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const emptyProfile: ProfileData = {
  name: "",
  username: "",
  email: "",
  phone: "",
  address: "",
  profile_image: "",
  role: "",
  password: "",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  assistant: "Assistant",
  warehousestaff: "Warehouse Staff",
  seller: "Seller",
  delivery: "Delivery Man",
};

const canChangeOwnPassword = (role: string) => role === "admin" || role === "seller";

function getStoredProfileId() {
  return localStorage.getItem("user_id");
}

function getEndpoint(id: string) {
  return `${API_BASE}/api/profile/${id}/`;
}

export default function RoleProfileModal({ open, onClose }: RoleProfileModalProps) {
  const role = localStorage.getItem("role") || "";
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileId, setProfileId] = useState("");
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [formData, setFormData] = useState<ProfileData>(emptyProfile);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!open || !role || role === "buyer") return;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        let id = getStoredProfileId() || "";

        if (!id) {
          throw new Error("Profile record was not found for this account.");
        }

        setProfileId(id);
        const res = await fetch(getEndpoint(id));
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.detail || "Failed to load profile.");
        }

        const nextProfile: ProfileData = {
          id: data.profile_id || data.id,
          user: data.user_id || data.user,
          name: data.name || data.user_name || localStorage.getItem("name") || "",
          username: data.username || localStorage.getItem("username") || "",
          email: data.email || localStorage.getItem("email") || "",
          phone: data.phone || "",
          address: data.address || "",
          profile_image: data.profile_image || data.logo || "",
          role: data.role || role,
          password: "",
        };

        setProfile(nextProfile);
        setFormData(nextProfile);
        setSelectedImage(null);
        setPreviewImage(imageUrl(nextProfile.profile_image));
        saveProfileToStorage(nextProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [open, role]);

  if (!open || role === "buyer") return null;

  const updateField = (field: keyof ProfileData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setIsEditing(false);
    setFormData(profile);
    setSelectedImage(null);
    setPreviewImage(imageUrl(profile.profile_image));
    onClose();
  };

  const handleSave = async () => {
    if (!profileId) return;

    setSaving(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("username", formData.username);
      payload.append("email", formData.email);

      if (role !== "admin") {
        payload.append("phone", formData.phone);
        payload.append("address", formData.address);
      }

      if (role === "assistant" || role === "warehousestaff") {
        payload.append("role", role);
      }

      if (canChangeOwnPassword(role) && formData.password.trim()) {
        payload.append("password", formData.password);
      }

      if (selectedImage) {
        payload.append(role === "seller" ? "logo" : "profile_image", selectedImage);
      }

      const res = await fetch(getEndpoint(profileId), {
        method: "PATCH",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.detail || "Failed to save profile.");
      }

      const nextProfile = {
        ...formData,
        profile_image: data.profile_image || data.logo || formData.profile_image,
        password: "",
      };
      setProfile(nextProfile);
      setFormData(nextProfile);
      setSelectedImage(null);
      setPreviewImage(imageUrl(nextProfile.profile_image));
      saveProfileToStorage(nextProfile);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="role-profile-overlay">
      <style>{`
        .role-profile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.58);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          padding: 20px;
        }
        .role-profile-modal {
          width: min(520px, 100%);
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
          overflow: hidden;
        }
        .role-profile-header,
        .role-profile-footer {
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .role-profile-footer {
          border-top: 1px solid #e2e8f0;
          border-bottom: none;
          justify-content: flex-end;
        }
        .role-profile-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }
        .role-profile-body {
          padding: 22px;
        }
        .role-profile-avatar {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }
        .role-profile-avatar-wrap {
          position: relative;
          width: 64px;
          height: 64px;
          flex: 0 0 auto;
        }
        .role-profile-avatar img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e2e8f0;
        }
        .role-profile-image-button {
          position: absolute;
          left: 50%;
          bottom: -9px;
          transform: translateX(-50%);
          border: none;
          border-radius: 999px;
          background: #2563eb;
          color: #fff;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          white-space: nowrap;
        }
        .role-profile-image-button input {
          display: none;
        }
        .role-profile-avatar strong {
          display: block;
          color: #0f172a;
          font-size: 16px;
        }
        .role-profile-avatar span {
          color: #64748b;
          font-size: 13px;
        }
        .role-profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .role-profile-field.full {
          grid-column: 1 / -1;
        }
        .role-profile-field label {
          display: block;
          margin-bottom: 6px;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
        }
        .role-profile-field input,
        .role-profile-field textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          color: #0f172a;
          background: #fff;
        }
        .role-profile-field input:disabled,
        .role-profile-field textarea:disabled {
          background: #f8fafc;
          color: #475569;
        }
        .role-profile-error {
          margin: 0 0 14px;
          padding: 10px 12px;
          border-radius: 8px;
          color: #b91c1c;
          background: #fee2e2;
          font-size: 13px;
        }
        .role-profile-button {
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          font-weight: 700;
          cursor: pointer;
        }
        .role-profile-button.secondary {
          background: #e2e8f0;
          color: #334155;
        }
        .role-profile-button.primary {
          background: #2563eb;
          color: #fff;
        }
        .role-profile-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        @media (max-width: 560px) {
          .role-profile-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="role-profile-modal">
        <div className="role-profile-header">
          <h3 className="role-profile-title">{isEditing ? "Edit Profile" : "My Profile"}</h3>
          <button className="role-profile-button secondary" type="button" onClick={handleClose}>
            Close
          </button>
        </div>

        <div className="role-profile-body">
          {error && <p className="role-profile-error">{error}</p>}

          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <>
              <div className="role-profile-avatar">
                <div className="role-profile-avatar-wrap">
                  <img src={previewImage || imageUrl(profile.profile_image)} alt="profile" />
                  {isEditing && (
                    <label className="role-profile-image-button">
                      Change
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
                <div>
                  <strong>{profile.name || profile.username}</strong>
                  <span>{roleLabels[role] || role}</span>
                </div>
              </div>

              <div className="role-profile-grid">
                <div className="role-profile-field">
                  <label>Name</label>
                  <input value={formData.name} disabled={!isEditing} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div className="role-profile-field">
                  <label>Username</label>
                  <input value={formData.username} disabled={!isEditing} onChange={(e) => updateField("username", e.target.value)} />
                </div>
                <div className="role-profile-field full">
                  <label>Email</label>
                  <input type="email" value={formData.email} disabled={!isEditing} onChange={(e) => updateField("email", e.target.value)} />
                </div>
                {role !== "admin" && (
                  <>
                    <div className="role-profile-field">
                      <label>Phone</label>
                      <input value={formData.phone} disabled={!isEditing} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    <div className="role-profile-field">
                      <label>Address</label>
                      <input value={formData.address} disabled={!isEditing} onChange={(e) => updateField("address", e.target.value)} />
                    </div>
                  </>
                )}
                {isEditing && canChangeOwnPassword(role) && (
                  <div className="role-profile-field full">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      placeholder="Leave blank to keep current password"
                      onChange={(e) => updateField("password", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="role-profile-footer">
          {!isEditing ? (
            <button className="role-profile-button primary" type="button" disabled={loading || !!error} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="role-profile-button secondary" type="button" onClick={() => { setIsEditing(false); setFormData(profile); }}>
                Cancel
              </button>
              <button className="role-profile-button primary" type="button" disabled={saving} onClick={handleSave}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
