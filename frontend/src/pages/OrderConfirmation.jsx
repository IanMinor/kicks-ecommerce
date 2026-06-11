import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { apiUrl } from "../utils/api";

function OrderConfirmation() {
  const navigate = useNavigate();
  const { id_pedido } = useParams();
  const user = useAuthStore((state) => state.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${apiUrl}/api/orders/${id_pedido}?id_usuario=${user.id_usuario}`
        );

        if (!res.ok) throw new Error("No se pudo cargar el pedido");

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id_pedido, user]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <p className="text-gray-500 flex justify-center items-center min-h-[40vh] text-xl font-semibold w-full">
        Cargando confirmación...
      </p>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No pudimos cargar tu pedido</h1>
        <p className="text-red-500 mb-6">{error}</p>
        <button
          onClick={handleContinueShopping}
          className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold transition"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 font-rubik">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="text-lg mb-6">
          Your order number is: <strong>{id_pedido}</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-gray-500">Status</p>
            <p className="font-semibold">{order?.estado_pedido || "En proceso"}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-gray-500">Estimated delivery</p>
            <p className="font-semibold">
              {order?.entrega_estimada?.split("T")[0] || "Pendiente"}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-gray-500">Total</p>
            <p className="font-semibold">${Number(order?.total || 0).toFixed(2)}</p>
          </div>
        </div>

        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
          <div className="flex flex-col gap-4">
            {order?.items?.map((item) => (
              <article
                key={item.id_producto}
                className="flex gap-4 items-center border border-gray-100 rounded-xl p-4"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre_producto}
                  className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.nombre_producto}</h3>
                  <p className="text-sm text-gray-500">
                    Size {item.talla} · Qty {item.cantidad}
                  </p>
                </div>
                <p className="font-semibold">${Number(item.precio).toFixed(2)}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>${Number(order?.subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold mt-2">
          <span>Total</span>
          <span>${Number(order?.total || 0).toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleContinueShopping}
        className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold transition"
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default OrderConfirmation;
