import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  carts: JSON.parse(localStorage.getItem("user_carts")) || {},

  addToCart: (userEmail, item) => {
    const currentCart = get().carts[userEmail] || [];

    // Ver si ya existe el mismo producto con mismo size
    const existing = currentCart.find(
      (i) => i.id === item.id && i.size === item.size
    );

    let updatedCart;

    if (existing) {
      updatedCart = currentCart.map((i) =>
        i.id === item.id && i.size === item.size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      updatedCart = [...currentCart, item];
    }

    const newCarts = {
      ...get().carts,
      [userEmail]: updatedCart,
    };

    localStorage.setItem("user_carts", JSON.stringify(newCarts));
    set({ carts: newCarts });
  },

  removeFromCart: (userEmail, itemToRemove) => {
    const currentCart = get().carts[userEmail] || [];
    const updatedCart = currentCart.filter(
      (i) => i.id !== itemToRemove.id || i.size !== itemToRemove.size
    );

    const newCarts = {
      ...get().carts,
      [userEmail]: updatedCart,
    };

    localStorage.setItem("user_carts", JSON.stringify(newCarts));
    set({ carts: newCarts });
  },

  clearCart: (userEmail) => {
    const newCarts = { ...get().carts };
    delete newCarts[userEmail];
    localStorage.setItem("user_carts", JSON.stringify(newCarts));
    set({ carts: newCarts });
  },

  getUserCart: (userEmail) => {
    return get().carts[userEmail] || [];
  },
}));
