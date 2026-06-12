import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { useProductById } from "../hooks/useProductById";
import AddToCartModal from "../components/AddToCartModal";
import { apiUrl, getAuthHeaders } from "../utils/api";
import { ProductDetailSkeleton } from "../components/Skeleton";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProductById(id);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (loading) return <ProductDetailSkeleton />;
  if (error || !product)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-red-500 text-xl font-semibold">
          {error || "Producto no encontrado"}
        </p>
        <a
          href="/products"
          className="text-blue-brand font-semibold hover:underline"
        >
          Volver a la tienda
        </a>
      </div>
    );

  const addProductToServerCart = async () => {
    const res = await fetch(`${apiUrl}/api/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        id_producto: product.id_producto,
        cantidad: 1,
      }),
    });

    if (!res.ok) throw new Error("No se pudo agregar el producto al carrito");
    window.dispatchEvent(new Event("cart:updated"));
  };

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");

    try {
      await addProductToServerCart();
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
    }
  };

  const handleBuyNow = async () => {
    if (!user) return navigate("/login");
    if (!selectedSize) return;

    try {
      await addProductToServerCart();
      navigate("/checkout");
    } catch (err) {
      console.error("Error al comprar ahora:", err);
    }
  };

  return (
    <div className="font-rubik px-4 mt-4 max-w-5xl mx-auto">
      <nav className="flex items-center gap-1 text-sm text-stone-gray mb-6">
        <Link to="/products" className="hover:text-blue-brand transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Productos
        </Link>
        <span>/</span>
        <span className="text-gray-dark font-medium truncate">{product.nombre_producto}</span>
      </nav>

      <motion.div
        className="flex flex-col md:flex-row gap-8 items-center md:items-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-full max-w-[400px] h-auto flex items-center justify-center overflow-hidden shadow-lg rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={product.imagen}
            alt={product.nombre_producto}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          className="info-section flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
        <span className="text-xs uppercase bg-blue-100 text-blue-600 px-2 py-1 rounded">
          Nuevo lanzamiento
        </span>
        <h1 className="text-2xl font-bold mt-2">{product.nombre_producto}</h1>
        <p className="text-xl font-semibold text-blue-brand">${product.precio}</p>
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
          <span className="text-sm font-medium">Talla</span>
          <div className="flex gap-2 mt-2">
            <button
              key={product.talla}
              onClick={() => setSelectedSize(product.talla)}
              className={`w-10 h-10 rounded-lg border ${
                selectedSize === product.talla
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              } transition cursor-pointer`}
            >
              {product.talla}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            disabled={!selectedSize}
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-2.5 rounded-lg disabled:opacity-50 cursor-pointer font-semibold hover:bg-gray-800 transition"
          >
            AGREGAR AL CARRITO
          </button>
          <button
            disabled={!selectedSize}
            onClick={handleBuyNow}
            className="w-full bg-blue-brand text-white py-2.5 rounded-lg disabled:opacity-50 cursor-pointer font-semibold hover:bg-blue-brand/90 transition"
          >
            COMPRAR AHORA
          </button>
        </div>
        <AddToCartModal isOpen={showModal} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProductDetail;
