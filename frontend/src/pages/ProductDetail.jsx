import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useState } from "react";
import { useProductById } from "../hooks/useProductById";
import AddToCartModal from "../components/AddToCartModal";
import { apiUrl } from "../utils/api";

function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProductById(id);
  const { user } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (loading) return <p className="text-center">Cargando producto...</p>;
  if (error || !product)
    return (
      <p className="text-center text-red-500">
        {error || "Producto no encontrado"}
      </p>
    );

  const getCartItem = () => ({
    id: product.id_producto,
    name: product.nombre_producto,
    price: product.precio,
    image: product.imagen,
    size: selectedSize,
    color: product.color,
    description: product.descripcion,
    quantity: 1,
  });

  const handleAddToCart = async () => {
  if (!user) return navigate("/login");
  try {
    const res = await fetch(`${apiUrl}/api/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_producto: product.id_producto,
        cantidad: 1,
      }),
    });
      if (res.ok) {
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
        addToCart(user.email, getCartItem());
      }
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    addToCart(user.email, getCartItem());
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 mt-7 font-rubik items-center md:items-start md:justify-center">
      <div className="w-full max-w-[400px] h-auto flex items-center justify-center overflow-hidden shadow-lg">
        <img
          src={product.imagen}
          alt={product.nombre_producto}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="info-section">
        <span className="text-xs uppercase bg-blue-100 text-blue-600 px-2 py-1 rounded">
          New Release
        </span>
        <h1 className="text-2xl font-bold mt-2">{product.nombre_producto}</h1>
        <p className="text-xl font-semibold text-blue-500">${product.precio}</p>
        <p className="mt-2 text-gray-600">{product.descripcion}</p>

        {/* Color (solo visual) */}
        <div className="mt-4">
          <span className="text-sm font-medium">Color</span>
          <div
            className="w-6 h-6 rounded-full border mt-1"
            style={{ backgroundColor: product.color }}
          />
        </div>

        {/* Talla única */}
        <div className="mt-4">
          <span className="text-sm font-medium">Size</span>
          <div className="flex gap-2 mt-2">
            <button
              key={product.talla}
              onClick={() => setSelectedSize(product.talla)}
              className={`w-10 h-10 rounded border ${
                selectedSize === product.talla
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {product.talla}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            disabled={!selectedSize}
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-2 rounded-[8px] disabled:opacity-50 cursor-pointer"
          >
            ADD TO CART
          </button>
          <button
            disabled={!selectedSize}
            onClick={handleBuyNow}
            className="w-full bg-blue-600 text-white py-2 rounded-[8px] disabled:opacity-50 cursor-pointer"
          >
            BUY IT NOW
          </button>
        </div>
        <AddToCartModal isOpen={showModal} />
      </div>
    </div>
  );
}

export default ProductDetail;
