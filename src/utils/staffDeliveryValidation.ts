export type StaffDeliveryField = "username" | "password" | "email" | "phone";

export type StaffDeliveryErrors = Partial<Record<StaffDeliveryField, string>>;

type StaffDeliveryValues = {
  username: string;
  email: string;
  phone: string;
  password: string;
  requirePassword?: boolean;
};

export const validateStaffDeliveryValues = ({
  username,
  email,
  phone,
  password,
  requirePassword = false,
}: StaffDeliveryValues): StaffDeliveryErrors => {
  const errors: StaffDeliveryErrors = {};

  if (!username.trim()) errors.username = "Username is required";
  if (requirePassword && !password) errors.password = "Password is required";
  if (password && password.length < 6) errors.password = "Password must be at least 6 characters";
  if (password && password.trim().toLocaleLowerCase() === username.trim().toLocaleLowerCase()) {
    errors.password = "Password must be different from username";
  }
  if (!/^[^\s@]+@gmail\.com$/i.test(email.trim())) {
    errors.email = "Email must be a valid @gmail.com address";
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    errors.phone = "Phone number must contain exactly 10 digits";
  }

  return errors;
};

export const getStaffDeliveryApiErrorMessage = (data: unknown, fallback: string) => {
  if (!data || typeof data !== "object") return fallback;
  const body = data as Record<string, unknown>;
  for (const key of ["detail", "error", "message"]) {
    if (typeof body[key] === "string") return body[key] as string;
  }

  for (const [field, value] of Object.entries(body)) {
    const message = Array.isArray(value) ? value[0] : value;
    if (typeof message === "string") return `${field}: ${message}`;
  }
  return fallback;
};
