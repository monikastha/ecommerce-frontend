import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";
import { FaPhone, FaMapMarkerAlt, FaWarehouse } from "react-icons/fa";

const OrderDetails = () => {
  const order = {
    id: "#101",
    customer: "Ram Sharma",
    phone: "9800000000",
    pickup: "Warehouse A, Kathmandu",
    address: "Newroad, Kathmandu",
    status: "Accepted",
  };

  return (
    <div className="assigned-layout">
      <DeliverymanSidebar />

      <div className="assigned-main">
        <DeliverymanNavbar />

        <div className="assigned-content">
          <h2 className="text-xl font-bold mb-3">📄 Order Details</h2>

          <div className="table-box p-4">
            <p><strong>Order ID:</strong> {order.id}</p>

            <p className="mt-2">
              <FaPhone /> {order.phone}
            </p>

            <p className="mt-2">
              <FaWarehouse /> {order.pickup}
            </p>

            <p className="mt-2">
              <FaMapMarkerAlt /> {order.address}
            </p>

            <div className="mt-4 flex gap-2">
              <button className="btn-accept">Accept</button>
              <button className="btn-pickup">Picked Up</button>
              <button className="btn-delivered">Delivered</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;