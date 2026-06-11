import { apiUrl, getAuthHeaders } from "./api";

export const fetchCartTotal = async (id_usuario) => {
  try {
    const res = await fetch(`${apiUrl}/api/cart/${id_usuario}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener el carrito");

    const data = await res.json();
    return data.reduce((acc, item) => acc + item.cantidad, 0);
  } catch (error) {
    console.error("Error al obtener el total del carrito:", error);
    return 0;
  }
};
