import type { BuyerCartItem } from "../utils/buyerCart";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const reduceStockForItems = async (items: BuyerCartItem[]) => {
  await Promise.all(
    items.map((item) =>
      fetch(`${API_URL}/api/warehouse/stock/reduce-by-product/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: item.id,
          quantity: item.quantity,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Out of Stock: ${item.name}`);
        }
      })
    )
  );
};
