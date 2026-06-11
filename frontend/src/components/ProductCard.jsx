import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden  flex flex-col"
    >
      <div className="font-rubik w-[300px] h-[350px] flex flex-col items-center justify-center rounded-[28px] p-4">
        <figure className="rounded-[28px]  relative w-full h-full overflow-hidden shadow-lg flex items-center justify-center">
          <p className="absolute top-0 left-0 bg-blue-brand text-white py-1 px-2.5  rounded-tl-[28px] rounded-br-3xl font-semibold text-xs">
            New
          </p>
          <img
            className="w-full h-full bg-cover rounded-3xl "
            src={product.imagen}
            alt={product.nombre_producto}
          />
        </figure>
        <h3 className="block text-2xl font-medium my-4">
          {product.nombre_producto}
        </h3>
        <Link
          to={`/products/${product.id_producto}`}
          className="block text-center w-full h-12 py-3 px-4 rounded-[8px] bg-gray-dark text-xs font-medium uppercase text-white"
        >
          View Product - ${product.precio}
        </Link>
      </div>
    </motion.div>
  );
}

export default ProductCard;
