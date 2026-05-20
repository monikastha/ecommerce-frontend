import { useState } from "react";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const product = {
  id: "SM12345",
  name: "Partywear Blue Saree",
  price: 2299,
  category: "Saree",
  brand: "Sajilo Mart",
  stock: 15,
  status: "unpublished",
  description:
    "Elegant blue saree perfect for parties and special occasions. Made with premium quality fabric.",
  createdAt: "2024-01-15",
  updatedAt: "2024-05-20",
  images: [
    "https://images.meesho.com/images/products/265379557/mswlg_512.webp",
    "https://images.meesho.com/images/products/265379557/mswlg_512.webp",
    "https://images.meesho.com/images/products/265379557/mswlg_512.webp",
    "https://images.meesho.com/images/products/265379557/mswlg_512.webp",
    "https://images.meesho.com/images/products/265379557/mswlg_512.webp",
  ],
};

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [published, setPublished] = useState(false);

  const handlePublish = () => {
    setPublished(true);
  };

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

    banner: {
      background: published ? "#22c55e" : "#ef4444",
      color: "#fff",
      padding: "12px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      fontWeight: 700,
      marginBottom: "20px",
    },

    breadcrumb: {
      fontSize: "13px",
      color: "#6b7280",
      marginBottom: "20px",
    },

    card: {
      background: "#fff",
      borderRadius: "12px",
      padding: "25px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    body: {
      display: "flex",
      gap: "30px",
      flexWrap: "wrap",
    },

    imageSection: {
      width: "300px",
    },

    mainImage: {
      width: "100%",
      height: "320px",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #ddd",
      marginBottom: "12px",
      background: "#f9fafb",
    },

    thumbnailWrapper: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },

    thumbnail: {
      width: "55px",
      height: "60px",
      borderRadius: "8px",
      overflow: "hidden",
      cursor: "pointer",
      border: "2px solid transparent",
    },

    productInfo: {
      flex: 1,
      minWidth: "300px",
    },

    titleRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "15px",
      flexWrap: "wrap",
    },

    title: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#111827",
    },

    badge: {
      padding: "5px 14px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 700,
      background: published ? "#dcfce7" : "#fee2e2",
      color: published ? "#166534" : "#b91c1c",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
    },

    label: {
      padding: "10px 0",
      color: "#6b7280",
      fontWeight: 600,
      width: "100px",
    },

    value: {
      color: "#111827",
      fontSize: "15px",
    },

    descriptionTitle: {
      color: "#374151",
      fontWeight: 700,
      marginBottom: "8px",
    },

    description: {
      color: "#4b5563",
      lineHeight: 1.7,
      fontSize: "14px",
    },

    sidePanel: {
      width: "260px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    sideCard: {
      background: "#f9fafb",
      border: published
        ? "1px solid #bbf7d0"
        : "1px solid #fecaca",
      borderRadius: "10px",
      padding: "18px",
    },

    statusTitle: {
      fontWeight: 700,
      marginBottom: "8px",
      color: published ? "#15803d" : "#dc2626",
    },

    metaRow: {
      display: "flex",
      gap: "10px",
      marginBottom: "14px",
      alignItems: "center",
    },

    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "30px",
      borderTop: "1px solid #e5e7eb",
      paddingTop: "20px",
      flexWrap: "wrap",
      gap: "15px",
    },

    backBtn: {
      border: "1px solid #d1d5db",
      background: "#fff",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 600,
    },

    actionButtons: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },

    editBtn: {
      border: "1px solid #d1d5db",
      background: "#fff",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 600,
    },

    publishBtn: {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 22px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 700,
    },

    bottomWarning: {
      marginTop: "20px",
      background: published ? "#f0fdf4" : "#fef2f2",
      border: published
        ? "1px solid #bbf7d0"
        : "1px solid #fecaca",
      color: published ? "#166534" : "#b91c1c",
      padding: "14px",
      borderRadius: "10px",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      {/* SAME SELLER SIDEBAR */}
      <SellerSidebar />

      <div style={styles.main}>
        {/* SAME SELLER NAVBAR */}
        <SellerNavbar />

        <div style={styles.content}>
          {/* Top Banner */}
          <div style={styles.banner}>
            {published
              ? "✓ PUBLISHED (Product Live in Store)"
              : "✕ UNPUBLISHED (Product Hidden from Store)"}
          </div>

          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            Home › Product Management › Product Details
          </div>

          {/* Main Card */}
          <div style={styles.card}>
            <div style={styles.body}>
              {/* Images */}
              <div style={styles.imageSection}>
                <div style={styles.mainImage}>
                  <img
                    src={product.images[selectedImage]}
                    alt="product"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={styles.thumbnailWrapper}>
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      style={{
                        ...styles.thumbnail,
                        border:
                          selectedImage === i
                            ? "2px solid #2563eb"
                            : "2px solid #d1d5db",
                      }}
                    >
                      <img
                        src={img}
                        alt={`thumb-${i}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div style={styles.productInfo}>
                <div style={styles.titleRow}>
                  <div style={styles.title}>{product.name}</div>

                  <div style={styles.badge}>
                    {published ? "Published" : "Unpublished"}
                  </div>
                </div>

                <table style={styles.table}>
                  <tbody>
                    <tr>
                      <td style={styles.label}>Price:</td>
                      <td style={styles.value}>
                        <span
                          style={{
                            color: "#dc2626",
                            fontWeight: 700,
                            fontSize: "18px",
                          }}
                        >
                          Rs. {product.price}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.label}>Category:</td>
                      <td style={styles.value}>{product.category}</td>
                    </tr>

                    <tr>
                      <td style={styles.label}>Brand:</td>
                      <td style={styles.value}>{product.brand}</td>
                    </tr>

                    <tr>
                      <td style={styles.label}>Stock:</td>
                      <td
                        style={{
                          ...styles.value,
                          color: "#15803d",
                          fontWeight: 700,
                        }}
                      >
                        {product.stock} in stock
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div>
                  <div style={styles.descriptionTitle}>Description:</div>

                  <div style={styles.description}>
                    {product.description}
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div style={styles.sidePanel}>
                <div style={styles.sideCard}>
                  <div style={styles.statusTitle}>
                    {published
                      ? "✓ Product Published!"
                      : "✕ Product Unpublished!"}
                  </div>

                  <div style={{ fontSize: "14px", color: "#555" }}>
                    {published
                      ? "This product is live and visible to customers."
                      : "This product is hidden from customers."}
                  </div>
                </div>

                <div
                  style={{
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "18px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={styles.metaRow}>
                    <span>🪪</span>
                    <div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Product ID
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        #{product.id}
                      </div>
                    </div>
                  </div>

                  <div style={styles.metaRow}>
                    <span>🕐</span>
                    <div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Created At
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        {product.createdAt}
                      </div>
                    </div>
                  </div>

                  <div style={styles.metaRow}>
                    <span>🔄</span>
                    <div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Updated At
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        {product.updatedAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={styles.footer}>
              <button style={styles.backBtn}>
                ← Back to Products
              </button>

              <div style={styles.actionButtons}>
                <button style={styles.editBtn}>
                  ✏️ Edit Product
                </button>

                {!published && (
                  <button
                    onClick={handlePublish}
                    style={styles.publishBtn}
                  >
                    Publish Product
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div style={styles.bottomWarning}>
            {published
              ? "✓ This product is now live and visible to customers."
              : "✕ This product is hidden from your store and not visible to customers."}
          </div>
        </div>
      </div>
    </div>
  );
}