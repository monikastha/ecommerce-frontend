import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddPromotion: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "Discount",
    discount: "",
    appliesTo: "",
    startDate: "",
    endDate: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    // VALIDATION
    if (
      !formData.name ||
      !formData.discount ||
      !formData.appliesTo ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setError("All fields are required!");
      return;
    }

    if (Number(formData.discount) <= 0) {
      setError("Discount must be greater than 0");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("Start date cannot be after end date");
      return;
    }

    console.log("Promotion Data:", formData);
    alert("Promotion added successfully!");

    navigate("/admin/promotion");
  };

  return (
    <div style={styles.wrapper}>
      <AdminSidebar />

      <div style={styles.main}>
        <AdminNavbar />

        <div style={styles.page}>
          <div style={styles.card}>
            <h2 style={styles.title}>Add Promotion</h2>
            <p style={styles.subtitle}>
              Create discounts and promotional campaigns
            </p>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>

              <div style={styles.field}>
                <label>Promotion Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter promotion name"
                />
              </div>

              <div style={styles.field}>
                <label>Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Discount">Discount</option>
                  <option value="Coupon">Coupon</option>
                  <option value="Flash Sale">Flash Sale</option>
                </select>
              </div>

              <div style={styles.field}>
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter discount %"
                />
              </div>

              <div style={styles.field}>
                <label>Applies To</label>
                <input
                  name="appliesTo"
                  value={formData.appliesTo}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g. All Products / Electronics"
                />
              </div>

              <div style={styles.field}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              {/* BUTTONS */}
              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={styles.backBtn}
                  onClick={() => navigate("/admin/promotion")}
                >
                  ← Back
                </button>

                <button type="submit" style={styles.addBtn}>
                  Add Promotion
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddPromotion;

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
  },

  main: {
    flex: 1,
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  page: {
    padding: "30px",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "650px",
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "5px",
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
    gap: "5px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
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
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
  },
};