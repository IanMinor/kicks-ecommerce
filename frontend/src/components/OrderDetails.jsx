import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import useCartCalculations from "../hooks/useCartCalculations";
import CheckoutItem from "./CheckoutItem";

function OrderDetails({ cartItems = [] }) {
  const { totalItems, subtotal } = useCartCalculations(cartItems);
  const user = useAuthStore((state) => state.user);
  const carts = useCartStore((state) => state.carts);

  return (
    <div>
      {/* RESUMEN */}
      <article className="font-rubik flex flex-col gap-4 bg-white rounded-lg shadow-lg p-4 h-max w-full">
        <h2 className="text-3xl font-semibold">Order Summary</h2>
        <div className="flex justify-between items-center">
          <p>{totalItems} Items</p>
          <p>${Number(subtotal).toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center text-2xl font-semibold text-gray-dark">
          <h3>Total</h3>
          <p className="opacity-80">${Number(subtotal).toFixed(2)}</p>
        </div>
      </article>

      {/* DETALLES */}
      <article className="border-gray-200 mt-5 bg-white shadow-lg p-4 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Order Details</h3>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          cartItems.map((item) => (
            <CheckoutItem
              key={`${item.id}-${item.color}-${item.size}`}
              item={item}
            />
          ))
        )}
      </article>
    </div>
  );
}

export default OrderDetails;
