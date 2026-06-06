import React from "react";

export type CategoryViewItem = {
  id: number;
  name: string;
  description?: string;
  image?: string;
};

type CategoryViewModalProps = {
  category: CategoryViewItem | null;
  imageUrl: (path?: string | null) => string;
  onClose: () => void;
};

const CategoryViewModal: React.FC<CategoryViewModalProps> = ({ category, imageUrl, onClose }) => {
  if (!category) return null;

  return (
    <div className="category-view-backdrop" onClick={onClose}>
      <style>{`
        .category-view-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(15, 23, 42, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .category-view-modal {
          width: min(860px, 100%);
          max-height: 92vh;
          overflow: auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.35);
        }

        .category-view-grid {
          display: grid;
          grid-template-columns: minmax(260px, 42%) 1fr;
        }

        .category-view-image {
          min-height: 360px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-view-image img {
          width: 100%;
          height: 100%;
          max-height: 560px;
          object-fit: cover;
        }

        .category-view-empty {
          color: #94a3b8;
          font-weight: 800;
        }

        .category-view-content {
          padding: 28px;
        }

        .category-view-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .category-view-label {
          color: #2563eb;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .category-view-title {
          margin-top: 8px;
          color: #0f172a;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 900;
        }

        .category-view-close {
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

        .category-view-detail {
          margin-top: 22px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
          padding: 12px;
        }

        .category-view-detail span {
          display: block;
          color: #64748b;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .category-view-detail strong {
          display: block;
          margin-top: 4px;
          color: #0f172a;
          font-size: 14px;
        }

        .category-view-section {
          margin-top: 24px;
        }

        .category-view-section h3 {
          color: #0f172a;
          font-size: 15px;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .category-view-section p {
          color: #475569;
          font-size: 14px;
          line-height: 1.7;
          white-space: pre-line;
        }

        @media (max-width: 720px) {
          .category-view-grid {
            grid-template-columns: 1fr;
          }

          .category-view-image {
            min-height: 240px;
          }

          .category-view-content {
            padding: 20px;
          }

          .category-view-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="category-view-modal" onClick={(event) => event.stopPropagation()}>
        <div className="category-view-grid">
          <div className="category-view-image">
            {category.image ? (
              <img src={imageUrl(category.image)} alt={category.name} />
            ) : (
              <span className="category-view-empty">No Image</span>
            )}
          </div>

          <div className="category-view-content">
            <div className="category-view-top">
              <div>
                <p className="category-view-label">Category</p>
                <h2 className="category-view-title">{category.name}</h2>
              </div>
              <button className="category-view-close" onClick={onClose} aria-label="Close category view">
                x
              </button>
            </div>

            <div className="category-view-detail">
              <span>Category ID</span>
              <strong>#{category.id}</strong>
            </div>

            <div className="category-view-section">
              <h3>Description</h3>
              <p>{category.description || "No category description provided."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryViewModal;
