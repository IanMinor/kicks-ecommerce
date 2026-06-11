import { Link } from "react-router-dom";
import useCartCalculations from "../hooks/useCartCalculations.js";

function OrderSummary({ cartItems }) {
  const { totalItems, subtotal } = useCartCalculations(cartItems);

  return (
    <article className="font-rubik flex flex-col gap-4 bg-white rounded-lg shadow-lg p-4 h-max w-full max-w-[400px]">
      <h2 className="text-3xl font-semibold">Order Summary</h2>
      <div>
        <div className="flex justify-between items-center">
          <p>{totalItems} ITEM</p>
          <p>${subtotal}</p>
        </div>
        <div className="flex justify-between items-center border-b-2 border-gray-200 py-2 text-2xl font-semibold text-gray-dark">
          <h3 className="">Total</h3>
          <p className="opacity-80">${subtotal}</p>
        </div>
      </div>

      <Link
        to="/checkout"
        className="py-2 px-4 bg-gray-dark text-white rounded-[8px] block text-center"
      >
        Checkout
      </Link>
    </article>
  );
}

export default OrderSummary;
