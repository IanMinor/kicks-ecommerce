import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id_producto}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden flex flex-col font-rubik w-[300px] group"
      >
        <figure className="rounded-2xl relative w-full h-[280px] overflow-hidden shadow-md flex items-center justify-center bg-white group-hover:shadow-xl transition-shadow duration-300">
          <img
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            src={product.imagen}
            alt={product.nombre_producto}
          />
        </figure>
        <h3 className="block text-xl font-semibold mt-3 text-gray-dark group-hover:text-blue-brand transition-colors">
          {product.nombre_producto}
        </h3>
        <p className="text-sm text-stone-gray mt-1">
          Ver producto - ${product.precio}
        </p>
      </motion.div>
    </Link>
  );
}

export default ProductCard;
