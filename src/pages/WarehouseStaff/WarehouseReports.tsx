import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";

const WarehouseReports = () => {
  return (
    <div style={{ display: "flex" }}>
      <WarehouseStaffSidebar />
      <div style={{ flex: 1 }}>
        <WarehouseStaffNavbar />

        <div style={{ padding: 20 }}>
          <h2>Reports</h2>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ background: "#dbeafe", padding: 20 }}>Efficiency: 90%</div>
            <div style={{ background: "#dcfce7", padding: 20 }}>Completed Tasks: 80</div>
            <div style={{ background: "#fef9c3", padding: 20 }}>Pending: 20</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseReports;