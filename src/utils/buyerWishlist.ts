export type BuyerWishlistItem = {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number | string;
  image?: string;
  category?: string;
  description?: string;
  size?: string;
  sizes?: string[];
  stock?: number;
  savedAt: string;
};

const WISHLIST_KEY = "buyer_wishlist_items";

const emitWishlistChange = () => {
  window.dispatchEvent(new Event("buyer-wishlist-change"));
};

const normalizeId = (id: number | string) => String(id);

export const getBuyerWishlistItems = (): BuyerWishlistItem[] => {
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveBuyerWishlistItems = (items: BuyerWishlistItem[]) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  emitWishlistChange();
};

export const getBuyerWishlistCount = () => getBuyerWishlistItems().length;

export const isBuyerWishlistItem = (id: number | string) =>
  getBuyerWishlistItems().some((item) => normalizeId(item.id) === normalizeId(id));

export const addBuyerWishlistItem = (item: Omit<BuyerWishlistItem, "savedAt">) => {
  const items = getBuyerWishlistItems();
  const nextItem: BuyerWishlistItem = { ...item, savedAt: new Date().toISOString() };
  const nextItems = [
    nextItem,
    ...items.filter((saved) => normalizeId(saved.id) !== normalizeId(item.id)),
  ];
  saveBuyerWishlistItems(nextItems);
  return nextItems;
};

export const removeBuyerWishlistItem = (id: number | string) => {
  const nextItems = getBuyerWishlistItems().filter((item) => normalizeId(item.id) !== normalizeId(id));
  saveBuyerWishlistItems(nextItems);
  return nextItems;
};

export const toggleBuyerWishlistItem = (item: Omit<BuyerWishlistItem, "savedAt">) => {
  if (isBuyerWishlistItem(item.id)) {
    return { items: removeBuyerWishlistItem(item.id), saved: false };
  }

  return { items: addBuyerWishlistItem(item), saved: true };
};
