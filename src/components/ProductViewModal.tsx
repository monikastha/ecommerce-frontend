import React from "react";

export type ProductViewItem = {
  id: number | string;
  seller_name?: string | null;
  seller_email?: string | null;
  name?: string | null;
  code?: string | null;
  category_name?: string | null;
  price?: string | number | null;
  quantity?: string | number | null;
  size?: string | null;
  description?: string | null;
  image?: string | null;
  status?: string | null;
  rejection_reason?: string | null;
  is_published?: boolean;
};

type ProductViewModalProps = {
  product: ProductViewItem | null;
  imageUrl: (path?: string | null) => string;
  onClose: () => void;
};

const descriptionLines = (description?: string | null) =>
  (description || "")
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

const ProductViewModal: React.FC<ProductViewModalProps> = ({ product, imageUrl, onClose }) => {
  if (!product) return null;

  const productName = product.name || "Unnamed Product";
  const quantity = Number(product.quantity || 0);

  const details = [
    ["Product ID", `#${product.id}`],
    ["Code", product.code || "-"],
    ["Category", product.category_name || "-"],
    ["Size", product.size || "-"],
    ["Stock", `${product.quantity ?? 0}`],
    ["Status", product.status || "-"],
    ["Published", product.is_published ? "Yes" : "No"],
  ];
  const points = descriptionLines(product.description);

  return (
    <div className="product-view-backdrop" onClick={onClose}>
      <style>{`
        .product-view-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(15, 23, 42, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .product-view-modal {
          width: min(980px, 100%);
          max-height: 92vh;
          overflow: auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.35);
        }

        .product-view-grid {
          display: grid;
          grid-template-columns: minmax(280px, 44%) 1fr;
        }

        .product-view-image {
          min-height: 420px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .product-view-image img {
          width: 100%;
          height: 100%;
          max-height: 620px;
          object-fit: contain;
          border-radius: 12px;
        }

        .product-view-empty {
          color: #94a3b8;
          font-weight: 800;
        }

        .product-view-content {
          padding: 28px;
        }

        .product-view-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .product-view-category {
          color: #7c3aed;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0;
        }

        .product-view-title {
          margin-top: 8px;
          color: #0f172a;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 900;
        }

        .product-view-close {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
        }

        .product-view-price {
          margin-top: 18px;
          color: #e11d48;
          font-size: 32px;
          font-weight: 900;
        }

        .product-view-stock {
          margin-top: 6px;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
        }

        .product-view-details {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 22px;
        }

        .product-view-detail {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 11px 12px;
          background: #f8fafc;
        }

        .product-view-label {
          display: block;
          color: #64748b;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .product-view-value {
          display: block;
          margin-top: 4px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          overflow-wrap: anywhere;
          text-transform: capitalize;
        }

        .product-view-section {
          margin-top: 24px;
        }

        .product-view-section h3 {
          color: #0f172a;
          font-size: 15px;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .product-view-description {
          color: #475569;
          font-size: 14px;
          line-height: 1.7;
        }

        .product-view-description ul {
          padding-left: 18px;
        }

        .product-view-seller {
          border-top: 1px solid #e2e8f0;
          margin-top: 24px;
          padding-top: 18px;
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
        }

        .product-view-note {
          border-left: 4px solid #f97316;
          background: #fff7ed;
          color: #9a3412;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.5;
        }

        @media (max-width: 760px) {
          .product-view-grid {
            grid-template-columns: 1fr;
          }

          .product-view-image {
            min-height: 260px;
          }

          .product-view-content {
            padding: 20px;
          }

          .product-view-title {
            font-size: 24px;
          }

          .product-view-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="product-view-modal" onClick={(event) => event.stopPropagation()}>
        <div className="product-view-grid">
          <div className="product-view-image">
            {product.image ? (
              <img src={imageUrl(product.image)} alt={productName} />
            ) : (
              <span className="product-view-empty">No Image</span>
            )}
          </div>

          <div className="product-view-content">
            <div className="product-view-top">
              <div>
                <p className="product-view-category">{product.category_name || "Product"}</p>
                <h2 className="product-view-title">{productName}</h2>
              </div>
              <button className="product-view-close" onClick={onClose} aria-label="Close product view">
                x
              </button>
            </div>

            <div className="product-view-price">Rs. {product.price}</div>
            <p className="product-view-stock">
              {quantity > 0 ? `${product.quantity} items in stock` : "Out of stock"}
            </p>

            <div className="product-view-details">
              {details.map(([label, value]) => (
                <div className="product-view-detail" key={label}>
                  <span className="product-view-label">{label}</span>
                  <span className="product-view-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="product-view-section">
              <h3>Product Details</h3>
              <div className="product-view-description">
                {points.length > 1 ? (
                  <ul>
                    {points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{product.description || "No product description provided."}</p>
                )}
              </div>
            </div>

            {(product.seller_name || product.seller_email) && (
              <div className="product-view-seller">
                {product.seller_name && <strong>{product.seller_name}</strong>}
                {product.seller_email && <div>{product.seller_email}</div>}
              </div>
            )}

            {product.rejection_reason && (
              <div className="product-view-section">
                <div className="product-view-note">{product.rejection_reason}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
