export type BuyerCartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  size?: string;
  sizes?: string[];
  quantity: number;
  stock?: number;
  locationId?: number;
  locationName?: string;
};

const CART_KEY = "buyer_cart";

const emitCartChange = () => {
  window.dispatchEvent(new Event("buyer-cart-change"));
};

export const getBuyerCart = (): BuyerCartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveBuyerCart = (items: BuyerCartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitCartChange();
};

export const getBuyerCartCount = () =>
  getBuyerCart().reduce((total, item) => total + item.quantity, 0);

export const addBuyerCartItem = (item: Omit<BuyerCartItem, "quantity">, quantity = 1) => {
  const cart = getBuyerCart();
  const existing = cart.find((cartItem) =>
    cartItem.id === item.id && (cartItem.size || "") === (item.size || "")
  );
  const nextQuantity = Math.max(1, quantity);

  if (existing) {
    const maxQuantity = existing.stock || item.stock;
    existing.quantity = maxQuantity
      ? Math.min(maxQuantity, existing.quantity + nextQuantity)
      : existing.quantity + nextQuantity;
    existing.category = item.category || existing.category;
    existing.image = item.image || existing.image;
    existing.description = item.description || existing.description;
    existing.size = item.size || existing.size;
    existing.sizes = item.sizes || existing.sizes;
    existing.stock = item.stock || existing.stock;
    existing.price = item.price;
    existing.locationId = item.locationId || existing.locationId;
    existing.locationName = item.locationName || existing.locationName;
  } else {
    cart.push({ ...item, quantity: item.stock ? Math.min(item.stock, nextQuantity) : nextQuantity });
  }

  saveBuyerCart(cart);
};

export const updateBuyerCartQuantity = (id: number, quantity: number) => {
  const next = getBuyerCart()
    .map((item) => {
      if (item.id !== id) return item;
      const nextQuantity = item.stock ? Math.min(item.stock, quantity) : quantity;
      return { ...item, quantity: nextQuantity };
    })
    .filter((item) => item.quantity > 0);

  saveBuyerCart(next);
};

export const removeBuyerCartItem = (id: number) => {
  saveBuyerCart(getBuyerCart().filter((item) => item.id !== id));
};

export const clearBuyerCart = () => {
  localStorage.removeItem(CART_KEY);
  emitCartChange();
};
