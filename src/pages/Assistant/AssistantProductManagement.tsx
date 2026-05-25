import React, { useMemo, useState } from "react";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaBoxOpen, FaSearch } from "react-icons/fa";

type Product = {
  id: number;
  seller_name: string;
  name: string;
  category_name: string;
  price: string;
  status: "pending" | "approved" | "rejected";
  is_published: boolean;
};

// Mock Data
const mockProducts: Product[] = [
  {
    id: 1,
    seller_name: "Tech Store Nepal",
    name: "iPhone 15 Pro",
    category_name: "Smartphones",
    price: "125000",
    status: "pending",
    is_published: false,
  },
  {
    id: 2,
    seller_name: "Fashion Hub",
    name: "Wireless Headphones",
    category_name: "Electronics",
    price: "4500",
    status: "approved",
    is_published: true,
  },
  {
    id: 3,
    seller_name: "Home Essentials",
    name: "Smart LED Bulb",
    category_name: "Home Appliances",
    price: "1200",
    status: "rejected",
    is_published: false,
  },
];

const AssistantProductManagement: React.FC = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => 
    mockProducts.filter((product) => {
      const query = search.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.seller_name.toLowerCase().includes(query) ||
        product.category_name.toLowerCase().includes(query)
      );
    }), [search]
  );

  const updateStatus = (id: number, action: "approve" | "reject") => {
    alert(`Product #${id} would be ${action}ed (Demo Mode)`);
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

        .dashboard-container { background: #f4f6f8; min-height: 100vh; }
        .main-content { margin-left: 250px; width: calc(100% - 250px); min-height: 100vh; }
        .container { padding: 25px 30px; }

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 22px 26px;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .title-section { display: flex; align-items: center; gap: 14px; }
        .header-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #5BBF9A, #4DA88A);
          color: white;
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px; font-size: 22px;
        }

        .title { font-size: 24px; font-weight: 700; color: #1f2937; }
        .subtitle { font-size: 14px; color: #64748b; }

        .search {
          width: 320px;
          padding: 11px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
        }
        .search:focus { border-color: #5BBF9A; }

        .tableBox {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        table { width: 100%; border-collapse: collapse; }
        th { background: #f8fafc; padding: 16px 14px; text-align: left; font-weight: 600; color: #475569; }
        td { padding: 16px 14px; border-top: 1px solid #f1f5f9; }
        tr:hover { background: #f8fafc; }

        .status { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
        .pending { background: #fef3c7; color: #d97706; }
        .approved { background: #d1fae5; color: #10b981; }
        .rejected { background: #fee2e2; color: #ef4444; }

        .btn {
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-right: 6px;
        }
        .approve { background: #10b981; }
        .reject { background: #ef4444; }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />
        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon"><FaBoxOpen /></div>
                <div>
                  <h2 className="title">Product Management</h2>
                  <p className="subtitle">Review and manage seller products (Demo Mode)</p>
                </div>
              </div>

              <input
                type="text"
                className="search"
                placeholder="Search products, seller or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Seller</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: "center", padding: "60px" }}>No products found</td></tr>
                  ) : (
                    filtered.map((product) => (
                      <tr key={product.id}>
                        <td><strong>#{product.id}</strong></td>
                        <td>{product.seller_name}</td>
                        <td><strong>{product.name}</strong></td>
                        <td>{product.category_name}</td>
                        <td>Rs. {product.price}</td>
                        <td><span className={`status ${product.status}`}>{product.status.toUpperCase()}</span></td>
                        <td>{product.is_published ? "✅ Yes" : "❌ No"}</td>
                        <td>
                          <button className="btn approve" onClick={() => updateStatus(product.id, "approve")}>Approve</button>
                          <button className="btn reject" onClick={() => updateStatus(product.id, "reject")}>Reject</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantProductManagement;