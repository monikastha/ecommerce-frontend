import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddStaff: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    role: "Assistant",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let tempErrors: any = {};

    if (!formData.name.trim()) tempErrors.name = "Name is required";

    if (!formData.username.trim())
      tempErrors.username = "Username is required";
    else if (formData.username.length < 3)
      tempErrors.username = "Username must be at least 3 characters";

    if (!formData.email.trim())
      tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Invalid email format";

    if (!formData.phone.trim())
      tempErrors.phone = "Phone is required";
    else if (!/^\d{7,15}$/.test(formData.phone))
      tempErrors.phone = "Phone must be 7-15 digits";

    if (!formData.address.trim())
      tempErrors.address = "Address is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // remove error while typing
    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Staff Data:", formData);
    alert("Staff added successfully!");

    setFormData({
      name: "",
      username: "",
      email: "",
      phone: "",
      address: "",
      role: "Assistant",
    });

    navigate("/admin/staff");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <AdminSidebar />
      </div>

      <div style={styles.main}>
        <AdminNavbar />

        <div style={styles.page}>
          <div style={styles.card}>
            <h2 style={styles.title}>Add New Staff</h2>
            <p style={styles.subtitle}>
              Fill in the details to create a staff account
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>

              {/* NAME */}
              <div style={styles.field}>
                <label>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter full name"
                />
                {errors.name && <span style={styles.error}>{errors.name}</span>}
              </div>

              {/* USERNAME */}
              <div style={styles.field}>
                <label>Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter username"
                />
                {errors.username && <span style={styles.error}>{errors.username}</span>}
              </div>

              {/* EMAIL */}
              <div style={styles.field}>
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter email"
                />
                {errors.email && <span style={styles.error}>{errors.email}</span>}
              </div>

              {/* PHONE */}
              <div style={styles.field}>
                <label>Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter phone"
                />
                {errors.phone && <span style={styles.error}>{errors.phone}</span>}
              </div>

              {/* ADDRESS */}
              <div style={styles.field}>
                <label>Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter address"
                />
                {errors.address && <span style={styles.error}>{errors.address}</span>}
              </div>

              {/* ROLE */}
              <div style={styles.field}>
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Assistant">Assistant</option>
                  <option value="Warehouse Staff">Warehouse Staff</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={styles.backBtn}
                  onClick={() => navigate("/admin/staff")}
                >
                  ← Back
                </button>

                <button type="submit" style={styles.addBtn}>
                  Add Staff
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddStaff;

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    width: "100%",
  },
  sidebar: {
    width: "260px",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 1000,
  },
  main: {
    flex: 1,
    marginLeft: "260px",
    background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
    minHeight: "100vh",
  },
  page: {
    padding: "30px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    background: "#fff",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  backBtn: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#e5e7eb",
    fontWeight: 600,
    cursor: "pointer",
  },
  addBtn: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#16a34a",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};