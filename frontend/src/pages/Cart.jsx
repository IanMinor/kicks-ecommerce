import { useAuthStore } from "../store/authStore";
import { useUserCart } from "../hooks/useUserCart";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { apiUrl, getAuthHeaders } from "../utils/api";
import { CartItemSkeleton, OrderSummarySkeleton } from "../components/Skeleton";

function Cart() {
  const user = useAuthStore((state) => state.user);
  const { cartItems, setCartItems, loading, error } = useUserCart(user);

  const handleRemove = async (id_producto) => {
    if (!user) return;

    try {
      const res = await fetch(
        `${apiUrl}/api/cart/${user.id_usuario}/${id_producto}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (res.ok) {
        //  Actualizar el estado local eliminando ese producto
        setCartItems((prev) =>
          prev.filter((item) => item.id_producto !== id_producto)
        );
        window.dispatchEvent(new Event("cart:updated"));
      } else {
        console.error("No se pudo eliminar el producto del carrito");
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
    }
  };

  const handleUpdateQuantity = async (id_producto, cantidad) => {
    if (!user) return;

    try {
      const res = await fetch(
        `${apiUrl}/api/cart/${user.id_usuario}/${id_producto}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ cantidad }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar la cantidad");

      setCartItems((prev) =>
        prev.map((item) =>
          item.id_producto === id_producto ? { ...item, cantidad } : item
        )
      );
      window.dispatchEvent(new Event("cart:updated"));
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto mt-8 px-2 lg:px-0 justify-between">
      {loading ? (
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="flex flex-col gap-4 w-full lg:w-2/3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
          <div className="w-full lg:w-1/3">
            <OrderSummarySkeleton />
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500 flex justify-center items-center min-h-[40vh] text-xl font-semibold w-full">
          Error: {error}
        </p>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] w-full gap-4">
          <svg
            className="w-20 h-20 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.872l1.836-8.073A1.125 1.125 0 0018.054 3H5.106m2.394 11.25l-1.5-6h13.5"
            />
          </svg>
          <p className="text-gray-500 text-xl font-semibold">
            Tu carrito está vacío
          </p>
          <p className="text-gray-400">
            Agrega productos para continuar comprando
          </p>
          <a
            href="/products"
            className="mt-2 bg-blue-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-brand/90 transition"
          >
            Ver productos
          </a>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="flex flex-col gap-4 w-full lg:w-2/3">
            {cartItems.map((item, idx) => (
              <CartItem
                key={`${item.id || "noid"}-${item.size || "nosize"}-${
                  item.color || "nocolor"
                }-${idx}`}
                item={item}
                removeFromCart={handleRemove}
                updateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <OrderSummary cartItems={cartItems} />
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;
