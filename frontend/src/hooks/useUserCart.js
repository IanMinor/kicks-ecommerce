import { useCallback, useEffect, useState } from "react";
import { apiUrl, getAuthHeaders } from "../utils/api";

export function useUserCart(user) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/api/cart/${user.id_usuario}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Error al obtener el carrito");
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      setError(err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();

    window.addEventListener("cart:updated", fetchCart);

    return () => {
      window.removeEventListener("cart:updated", fetchCart);
    };
  }, [fetchCart]);

  return { cartItems, setCartItems, loading, error, refreshCart: fetchCart };
}
