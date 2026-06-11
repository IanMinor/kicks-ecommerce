import { useAuthStore } from "../store/authStore";
import { useUserCart } from "../hooks/useUserCart";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { apiUrl } from "../utils/api"; // <-- Agrega esta línea

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
        }
      );

      if (res.ok) {
        //  Actualizar el estado local eliminando ese producto
        setCartItems((prev) =>
          prev.filter((item) => item.id_producto !== id_producto)
        );
      } else {
        console.error("No se pudo eliminar el producto del carrito");
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto mt-8 px-2 lg:px-0 justify-between">
      {loading ? (
        <p className="text-gray-500 flex justify-center items-center min-h-[40vh] text-xl font-semibold w-full">
          Loading cart...
        </p>
      ) : error ? (
        <p className="text-red-500 flex justify-center items-center min-h-[40vh] text-xl font-semibold w-full">
          Error: {error}
        </p>
      ) : cartItems.length === 0 ? (
        <p className="text-gray-500 flex justify-center items-center min-h-[40vh] text-xl font-semibold w-full">
          Empty Cart, please add some items to your cart.
        </p>
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
