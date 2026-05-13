import { Bell, Search } from "lucide-react";

const WarehouseStaffNavbar = () => {
  return (
    <div style={styles.navbar}>
      
      <h2>Warehouse Panel</h2>

      <div style={styles.right}>
        <div style={styles.search}>
          <Search size={16} />
          <input placeholder="Search..." style={styles.input} />
        </div>

        <Bell />
        <img
          src="https://i.pravatar.cc/40"
          style={styles.profile}
          alt="profile"
        />
      </div>
    </div>
  );
};

const styles: any = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    background: "#fff",
    borderBottom: "1px solid #ddd",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  search: {
    display: "flex",
    alignItems: "center",
    background: "#eee",
    padding: "5px 10px",
    borderRadius: "10px",
  },
  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    marginLeft: "5px",
  },
  profile: {
    width: "35px",
    borderRadius: "50%",
  },
};

export default WarehouseStaffNavbar;