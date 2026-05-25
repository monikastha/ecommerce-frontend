import { useState } from "react";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

export default function ProductDetails() {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [published] = useState(true);

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
      padding: "20px",
    },

    breadcrumb: {
      fontSize: "13px",
      color: "#666",
      marginBottom: "20px",
    },

    banner: {
      backgroundColor: "#22c55e",
      color: "#fff",
      padding: "12px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontWeight: 700,
      marginBottom: "20px",
    },

    layout: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },

    productCard: {
      flex: "1 1 700px",
      background: "#fff",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    productWrapper: {
      display: "flex",
      gap: "24px",
      flexWrap: "wrap",
    },

    imageBox: {
      width: "280px",
    },

    mainImage: {
      width: "280px",
      height: "230px",
      background: "#eef2ff",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "12px",
    },

    thumbnails: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },

    thumb: {
      width: "50px",
      height: "50px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#eef2ff",
    },

    productInfo: {
      flex: 1,
      minWidth: "250px",
    },

    title: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#111827",
      marginBottom: "10px",
    },

    badge: {
      display: "inline-block",
      background: "#dcfce7",
      color: "#166534",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 700,
      marginBottom: "16px",
    },

    infoRow: {
      display: "flex",
      gap: "10px",
      marginBottom: "12px",
      fontSize: "14px",
    },

    label: {
      minWidth: "90px",
      fontWeight: 700,
      color: "#374151",
    },

    value: {
      color: "#111827",
    },

    buttons: {
      marginTop: "25px",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "12px",
    },

    leftBtn: {
      padding: "10px 18px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      background: "#fff",
      cursor: "pointer",
      fontWeight: 600,
    },

    actionButtons: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },

    editBtn: {
      padding: "10px 18px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      background: "#fff",
      cursor: "pointer",
      fontWeight: 600,
    },

    deleteBtn: {
      padding: "10px 18px",
      border: "none",
      borderRadius: "8px",
      background: "#ef4444",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 600,
    },

    rightPanel: {
      width: "300px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    sideCard: {
      background: "#fff",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    statusTitle: {
      color: "#16a34a",
      fontWeight: 700,
      marginBottom: "10px",
      fontSize: "16px",
    },

    bottomBar: {
      marginTop: "20px",
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
      color: "#15803d",
      padding: "12px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      {/* SAME SIDEBAR */}
      <SellerSidebar />

      <div style={styles.main}>
        {/* SAME NAVBAR */}
        <SellerNavbar />

        <div style={styles.content}>
          {/* Banner */}
          {published && (
            <div style={styles.banner}>
              ✓ PUBLISHED (Product Live in Store)
            </div>
          )}

          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            Home › Product Management › Product Details
          </div>

          {/* Main Layout */}
          <div style={styles.layout}>
            {/* Product Card */}
            <div style={styles.productCard}>
              <div style={styles.productWrapper}>
                {/* Images */}
                <div style={styles.imageBox}>
                  <div style={styles.mainImage}>
                    <svg width="130" height="190" viewBox="0 0 130 190">
                      <ellipse
                        cx="65"
                        cy="95"
                        rx="52"
                        ry="90"
                        fill="#1a3ab8"
                        opacity="0.85"
                      />
                    </svg>
                  </div>

                  {/* Thumbnails */}
                  <div style={styles.thumbnails}>
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedThumb(i)}
                        style={{
                          ...styles.thumb,
                          border:
                            selectedThumb === i
                              ? "2px solid #2563eb"
                              : "2px solid transparent",
                        }}
                      >
                        <svg width="28" height="40" viewBox="0 0 28 40">
                          <ellipse
                            cx="14"
                            cy="20"
                            rx="11"
                            ry="19"
                            fill="#1a3ab8"
                          />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div style={styles.productInfo}>
                  <div style={styles.title}>Partywear Blue Saree</div>

                  <div style={styles.badge}>Published</div>

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Price:</span>
                    <span
                      style={{
                        ...styles.value,
                        color: "#dc2626",
                        fontWeight: 700,
                      }}
                    >
                      Rs. 2299
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Category:</span>
                    <span style={styles.value}>Saree</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Brand:</span>
                    <span style={styles.value}>Sajilo Mart</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Stock:</span>
                    <span
                      style={{
                        ...styles.value,
                        color: "#16a34a",
                        fontWeight: 700,
                      }}
                    >
                      15 in stock
                    </span>
                  </div>

                  <div style={{ marginTop: "14px" }}>
                    <div style={styles.label}>Description:</div>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#555",
                        lineHeight: 1.7,
                        marginTop: "6px",
                      }}
                    >
                      Elegant blue saree perfect for parties and special
                      occasions. Made with premium quality fabric.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={styles.buttons}>
                <button style={styles.leftBtn}>
                  ← Back to Products
                </button>

                <div style={styles.actionButtons}>
                  <button style={styles.editBtn}>
                    ✏️ Edit Product
                  </button>

                  <button style={styles.deleteBtn}>
                    Unpublish Product
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div style={styles.rightPanel}>
              {/* Status */}
              <div style={styles.sideCard}>
                <div style={styles.statusTitle}>
                  ✓ Product Published!
                </div>

                <p style={{ fontSize: "14px", color: "#555" }}>
                  This product is live and visible to customers in your store.
                </p>
              </div>

              {/* Meta */}
              <div style={styles.sideCard}>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Product ID:</span>
                  <span>#SM12345</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.label}>Created:</span>
                  <span>2024-01-15</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.label}>Updated:</span>
                  <span>2024-05-20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status */}
          <div style={styles.bottomBar}>
            ✓ This product is now live in your store and visible to customers.
          </div>
        </div>
      </div>
    </div>
  );
}
