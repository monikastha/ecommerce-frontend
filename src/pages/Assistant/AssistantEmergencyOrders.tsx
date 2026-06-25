import React from "react";
import OrderManagementView from "../../components/OrderManagementView";
import AssistantNavbar from "./AssistantNavbar";
import AssistantSidebar from "./AssistantSidebar";

const AssistantEmergencyOrders: React.FC = () => (
  <OrderManagementView
    sidebar={<AssistantSidebar />}
    navbar={<AssistantNavbar />}
    title="Emergency Fast Delivery"
    subtitle="Immediate priority queue for buyers who selected emergency delivery"
    emergencyOnly
  />
);

export default AssistantEmergencyOrders;
