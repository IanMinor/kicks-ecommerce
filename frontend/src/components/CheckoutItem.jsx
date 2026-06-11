function CheckoutItem({ item }) {
  if (!item) {
    return;
  }

  return (
    <article className="flex w-full max-h-[150px] h-full font-rubik bg-white border-gray-200 rounded-lg p-4 mt-4 gap-5">
      <figure className="w-[150px] h-[full] rounded-[24px] overflow-hidden shadow-lg flex items-center justify-center flex-grow-0">
        <img
          src={item.imagen}
          alt={item.title || "Product image"}
          className="w-full h-full object-cover"
        />
      </figure>

      <div className="flex flex-col justify-between w-full">
        <div className="flex justify-between items-start flex-wrap gap-20">
          <div className="max-w-[70%]">
            <h3 className="text-xl font-semibold break-words">
              {item.nombre_producto}
            </h3>
            <p className="text-sm text-gray-600">{item.descripcion}</p>
            <div className="flex gap-4 mt-2 text-gray-dark text-sm">
              <p>Size {item.talla}</p>
              <p>Quantity: {item.cantidad}</p>
            </div>
            <span className="text-blue-brand text-xl font-semibold ">
              ${item.precio}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CheckoutItem;
