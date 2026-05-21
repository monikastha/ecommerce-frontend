import { useState } from "react";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

export default function EditProduct() {
  const [productName, setProductName] = useState("Partywear Blue Saree");
  const [price, setPrice] = useState("2299");
  const [quantity, setQuantity] = useState("12");
  const [status, setStatus] = useState("Published");
  const [description, setDescription] = useState(
    "Beautiful blue saree with elegant design, perfect for parties and special occasions."
  );

  const imageUrl =
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80";

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      width: "100%",
      minHeight: "100vh",
      background: "#f3f4f6",
      fontFamily: "Arial, sans-serif",
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    content: {
      padding: "24px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#1f2937",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
    },
    btn: {
      padding: "8px 14px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      background: "#fff",
      cursor: "pointer",
      fontSize: "14px",
    },
    primaryBtn: {
      padding: "8px 14px",
      borderRadius: "8px",
      background: "#22c55e",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
    },
    grid: {
      display: "flex",
      gap: "20px",
    },
    formBox: {
      flex: 1,
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
    },
    imageBox: {
      width: "300px",
      background: "#fff",
      padding: "16px",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
    },
  };

  return (
    <div style={styles.container}>
      
      {/* ===== SIDEBAR (same as SellerDashboard) ===== */}
      <SellerSidebar />

      <div style={styles.main}>
        
        {/* ===== NAVBAR (same as SellerDashboard) ===== */}
        <SellerNavbar />

        {/* ===== CONTENT ===== */}
        <div style={styles.content}>

          {/* HEADER */}
          <div style={styles.header}>
            <div>
              <h2 style={styles.title}>Edit Product</h2>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>
                Update your product details
              </p>
            </div>

            <div style={styles.buttonGroup}>
              <button style={styles.btn}>Back</button>
              <button style={styles.btn}>Cancel</button>
              <button style={styles.primaryBtn}>Update Product</button>
            </div>
          </div>

          {/* BODY */}
          <div style={styles.grid}>

            {/* FORM */}
            <div style={styles.formBox}>
              <h3 style={{ marginBottom: "12px", fontWeight: 700 }}>
                Product Information
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input value="PRD001" disabled style={{ padding: "8px", background: "#f3f4f6", borderRadius: "6px", border: "1px solid #ddd" }} />

                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
                  placeholder="Product Name"
                />

                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
                  placeholder="Price"
                />

                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
                  placeholder="Quantity"
                />
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ marginTop: "12px", width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
              >
                <option>Published</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{ marginTop: "12px", width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
              />
            </div>

            {/* IMAGE */}
            <div style={styles.imageBox}>
              <h3 style={{ marginBottom: "12px", fontWeight: 700 }}>
                Product Image
              </h3>

              <img
                src={imageUrl}
                style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "8px" }}
              />

              <button style={{ width: "100%", marginTop: "10px", padding: "8px", border: "1px solid #ddd", borderRadius: "6px" }}>
                Change Image
              </button>

              <button style={{ width: "100%", marginTop: "8px", padding: "8px", border: "1px solid red", color: "red", borderRadius: "6px" }}>
                Remove Image
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}