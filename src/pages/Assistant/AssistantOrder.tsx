import React from "react";
import OrderManagementView from "../../components/OrderManagementView";
import AssistantNavbar from "./AssistantNavbar";
import AssistantSidebar from "./AssistantSidebar";

const AssistantOrder: React.FC = () => (
  <OrderManagementView
    sidebar={<AssistantSidebar />}
    navbar={<AssistantNavbar />}
    title="Order Management"
    subtitle="View every buyer order, assign delivery staff, and update order status"
  />
);

export default AssistantOrder;
