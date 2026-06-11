import { useMemo } from "react";

const useCartCalculations = (cartItems = []) => {
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + (item.precio || 0) * (item.cantidad || 0),
        0
      ),
    [cartItems]
  );
  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.cantidad || 0), 0),
    [cartItems]
  );
  // Redondear subtotal a dos decimales aquí para evitar repetir lógica en los componentes
  const roundedSubtotal = Number(subtotal).toFixed(2);
  return { totalItems, subtotal: roundedSubtotal };
};

export default useCartCalculations;
