import { motion, AnimatePresence } from "framer-motion";

export default function AddToCartModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-white shadow-lg border border-gray-200 px-6 py-4 rounded-xl text-sm font-medium text-gray-dark"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          ✅ Producto añadido al carrito
        </motion.div>
      )}
    </AnimatePresence>
  );
}
