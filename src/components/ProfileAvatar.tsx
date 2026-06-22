import { useEffect, useState } from "react";
import fallbackLogo from "../assets/logo.png";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const PROFILE_UPDATED_EVENT = "profile-updated";
export const PROFILE_IMAGE_UPDATED_EVENT = "profile-image-change";

export const imageUrl = (path?: string | null) => {
  if (!path) return fallbackLogo;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;

  const normalizedPath = path.startsWith("http") ? path : path.startsWith("/") ? `${API_ORIGIN}${path}` : `${API_ORIGIN}/${path}`;
  const separator = normalizedPath.includes("?") ? "&" : "?";
  return `${normalizedPath}${separator}t=${Date.now()}`;
};

export const saveProfileToStorage = (profile: {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  profile_image?: string | null;
  profile_pic?: string | null;
  logo?: string | null;
  phone?: string | null;
  phone_number?: string | null;
  address?: string | null;
}) => {
  localStorage.setItem("username", profile.username || "");
  localStorage.setItem("name", profile.name || "");
  localStorage.setItem("email", profile.email || "");
  localStorage.setItem("profile_image", profile.profile_image || profile.profile_pic || profile.logo || "");

  if (profile.phone || profile.phone_number) {
    localStorage.setItem("phone", profile.phone || profile.phone_number || "");
  }

  if (profile.address) {
    localStorage.setItem("address", profile.address);
  }

  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  window.dispatchEvent(new Event(PROFILE_IMAGE_UPDATED_EVENT));
};

export const useProfileName = (fallback: string) => {
  const [name, setName] = useState(() => localStorage.getItem("name") || fallback);

  useEffect(() => {
    const refresh = () => setName(localStorage.getItem("name") || fallback);

    window.addEventListener(PROFILE_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [fallback]);

  return name;
};

export const useProfileEmail = (fallback = "") => {
  const [email, setEmail] = useState(() => localStorage.getItem("email") || fallback);

  useEffect(() => {
    const refresh = () => setEmail(localStorage.getItem("email") || fallback);

    window.addEventListener(PROFILE_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [fallback]);

  return email;
};

type ProfileAvatarProps = {
  className?: string;
  alt?: string;
  onClick?: () => void;
};

export default function ProfileAvatar({ className, alt = "profile", onClick }: ProfileAvatarProps) {
  const [src, setSrc] = useState(() => imageUrl(localStorage.getItem("profile_image")));
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const storedImage = localStorage.getItem("profile_image");
      setSrc(imageUrl(storedImage));
      setRenderKey((prev) => prev + 1);
    };

    window.addEventListener(PROFILE_UPDATED_EVENT, refresh);
    window.addEventListener(PROFILE_IMAGE_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, refresh);
      window.removeEventListener(PROFILE_IMAGE_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return <img key={renderKey} className={className} src={src} alt={alt} onClick={onClick} />;
}
