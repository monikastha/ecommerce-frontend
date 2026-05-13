import { useNavigate } from "react-router-dom";
import { Home, Package, ClipboardList } from "lucide-react";

const WarehouseStaffSidebar = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.sidebar}>
      
      <h2 style={styles.title}>Warehouse</h2>

      <div style={styles.menuItem} onClick={() => navigate("/warehouse/dashboard")}>
        <Home size={18} />
        <span>Dashboard</span>
      </div>

      <div style={styles.menuItem} onClick={() => navigate("/warehouse/inventory")}>
        <Package size={18} />
        <span>Inventory</span>
      </div>

      <div style={styles.menuItem} onClick={() => navigate("/warehouse/orders")}>
        <ClipboardList size={18} />
        <span>Orders</span>
      </div>

    </div>
  );
};

const styles: any = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#d8aeb4",
    padding: "20px",
  },
  title: {
    marginBottom: "20px",
  },
  menuItem: {
    display: "flex",
    gap: "10px",
    padding: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default WarehouseStaffSidebar;