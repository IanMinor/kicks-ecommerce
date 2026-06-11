import { Trash2, Heart } from "lucide-react";
import { useProducts } from "../hooks/useProducts";

function CartItem({ item, removeFromCart }) {
  const handleRemove = () => {
    removeFromCart(item.id_producto);
  };

  const { products } = useProducts();
  const product = products.find((p) => p.id_producto === item.id_producto);

  return (
    <article className="flex flex-col sm:flex-row w-full font-rubik border-gray-200 rounded-lg p-4 mt-4 gap-4 sm:gap-6 bg-white shadow">
      <figure className="w-full sm:w-[180px] h-[180px] sm:h-[180px] rounded-[24px] overflow-hidden shadow-lg flex items-center justify-center flex-shrink-0 mb-4 sm:mb-0">
        <img
          src={product?.imagen || item.imagen}
          alt={item.descripcion}
          className="w-full h-full object-contain"
        />
      </figure>
      <div className="flex flex-col justify-between w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-2 sm:gap-0">
          <div className="w-full">
            <h3 className="text-xl sm:text-2xl font-semibold break-words">
              {item.nombre_producto}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {item.descripcion}
            </p>
            <div className="flex gap-4 mt-2 text-gray-dark text-sm">
              <p>Size {item.talla}</p>
              <p>Quantity: {item.cantidad}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center mt-4">
          <span className="text-blue-brand text-xl sm:text-2xl font-semibold whitespace-nowrap">
            ${item.precio}
          </span>
          <div className="flex gap-4">
            <button className="mr-2">
              <Heart className="cursor-pointer" />
            </button>
            <button onClick={handleRemove} className="cursor-pointer">
              <Trash2 />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
