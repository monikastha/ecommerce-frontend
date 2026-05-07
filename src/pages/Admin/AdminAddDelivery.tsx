import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddDelivery: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // VALIDATION
  const validate = () => {
    let tempErrors: any = {};

    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    if (!formData.phone.trim()) tempErrors.phone = "Phone is required";
    if (!formData.address.trim()) tempErrors.address = "Address is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Delivery Data:", formData);
    alert("Delivery staff added successfully!");

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    navigate("/admin/delivery");
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
            <h2 style={styles.title}>Add Delivery Staff</h2>
            <p style={styles.subtitle}>
              Fill in delivery staff details carefully
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>

              {/* NAME */}
              <div style={styles.field}>
                <label>Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter name"
                />
                {errors.name && <span style={styles.error}>{errors.name}</span>}
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

              {/* BUTTONS */}
              <div style={styles.buttonRow}>
                <button
                  type="button"
                  onClick={() => navigate("/admin/delivery")}
                  style={styles.backBtn}
                >
                  Back
                </button>

                <button type="submit" style={styles.addBtn}>
                  Add Delivery
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddDelivery;

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
  },

  sidebar: {
    width: "260px",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
  },

  main: {
    flex: 1,
    marginLeft: "260px",
    background: "linear-gradient(135deg,#f5f7fa,#e4ecf5)",
    minHeight: "100vh",
  },

  page: {
    padding: "30px",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "22px",
    fontWeight: 600,
  },

  subtitle: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "15px",
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
  },

  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "3px",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  backBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#e5e7eb",
    fontWeight: 600,
    cursor: "pointer",
  },

  addBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#16a34a",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};