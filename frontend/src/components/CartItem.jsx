import { Trash2, Heart } from "lucide-react";

function CartItem({ item, removeFromCart, updateQuantity }) {
  const handleRemove = () => {
    removeFromCart(item.id_producto);
  };

  const handleDecrease = () => {
    if (item.cantidad > 1) updateQuantity(item.id_producto, item.cantidad - 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.id_producto, item.cantidad + 1);
  };

  return (
    <article className="flex flex-col sm:flex-row w-full font-rubik border-gray-200 rounded-xl p-4 gap-4 sm:gap-6 bg-white shadow hover:shadow-md transition-shadow duration-200">
      <figure className="w-full sm:w-[180px] h-[180px] sm:h-[180px] rounded-2xl overflow-hidden shadow-lg flex items-center justify-center flex-shrink-0 mb-4 sm:mb-0">
        <img
          src={item.imagen}
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
              <p>Talla {item.talla}</p>
              <div className="flex items-center gap-2">
                <span>Cantidad:</span>
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={item.cantidad <= 1}
                  className="w-7 h-7 rounded-lg border disabled:opacity-40 hover:bg-gray-100 transition cursor-pointer"
                >
                  -
                </button>
                <span className="font-medium">{item.cantidad}</span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-7 h-7 rounded-lg border hover:bg-gray-100 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center mt-4">
          <span className="text-blue-brand text-xl sm:text-2xl font-semibold whitespace-nowrap">
            ${item.precio}
          </span>
          <div className="flex gap-3">
            <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
              <Heart className="w-5 h-5" />
            </button>
            <button onClick={handleRemove} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
