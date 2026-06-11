import { useForm } from "react-hook-form";
import ErrorMessage from "../components/ErrorMessage";
import OrderDetails from "../components/OrderDetails";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUserCart } from "../hooks/useUserCart";
import { apiUrl } from "../utils/api";

function Checkout() {
  const user = useAuthStore((state) => state.user);
  const { cartItems } = useUserCart(user);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const entregaEstimada = new Date();
      entregaEstimada.setDate(entregaEstimada.getDate() + 5);

      const res = await fetch(`${apiUrl}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user.id_usuario,
          entrega_estimada: entregaEstimada.toISOString().split("T")[0],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`No se pudo crear el pedido: ${text}`);
      }

      const result = await res.json();
      reset();

      navigate(`/order-confirmation/${result.id_pedido}`);
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al procesar tu pedido.");
    }
  });

  return (
    <main className="font-rubik flex gap-5 items-start  justify-around p-6 mx-auto w-[90%] mt-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-4 p-8 w-lg">
        <h1 className="text-3xl font-semibold mb-4">Shipping Address</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={`px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.name ? "ring-red-500" : "ring-gray-300"
            }`}
            {...register("name", {
              required: {
                value: true,
                message: "Name is required",
              },
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Name must be at most 20 characters",
              },
            })}
          />
          {errors.name && <ErrorMessage message={errors.name.message} />}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm font-medium">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            className={`px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.address ? "ring-red-500" : "ring-gray-300"
            }`}
            {...register("address", {
              required: {
                value: true,
                message: "Address is required",
              },
              minLength: {
                value: 5,
                message: "Address must be at least 5 characters",
              },
              maxLength: {
                value: 50,
                message: "Address must be at most 50 characters",
              },
            })}
          />
          {errors.address && <ErrorMessage message={errors.address.message} />}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className=" text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.email ? "ring-red-500" : "ring-gray-300"
            }`}
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={`px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.phone ? "ring-red-500" : "ring-gray-300"
            }`}
            {...register("phone", {
              required: {
                value: true,
                message: "Phone number is required",
              },
              pattern: {
                value: /^\d{10}$/,
                message: "Phone number must be 10 digits",
              },
            })}
          />
          {errors.phone && <ErrorMessage message={errors.phone.message} />}
        </div>

        <button
          type="submit"
          className="bg-gray-dark rounded-[8px] text-white text-[14px] py-2 px-4 cursor-pointer"
        >
          REVIEW AND PAY
        </button>
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      </form>

      <section className=" ">
        <OrderDetails cartItems={cartItems} />
      </section>
    </main>
  );
}

export default Checkout;
