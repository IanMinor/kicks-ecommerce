import { useForm } from "react-hook-form";
import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import OrderDetails from "../components/OrderDetails";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUserCart } from "../hooks/useUserCart";
import { apiUrl, getAuthHeaders } from "../utils/api";

function Checkout() {
  const user = useAuthStore((state) => state.user);
  const { cartItems, loading } = useUserCart(user);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    if (cartItems.length === 0) {
      setSubmitError("Agrega productos al carrito antes de finalizar tu pedido.");
      return;
    }

    try {
      setSubmitError(null);
      const entregaEstimada = new Date();
      entregaEstimada.setDate(entregaEstimada.getDate() + 5);

      const res = await fetch(`${apiUrl}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          entrega_estimada: entregaEstimada.toISOString().split("T")[0],
          shipping_address: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
          },
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
      setSubmitError("Hubo un problema al procesar tu pedido. Intenta de nuevo.");
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-gray-500 text-xl font-semibold">Cargando checkout...</p>
      </div>
    );
  }

  const inputClass = (hasError) =>
    `px-4 py-2.5 rounded-lg bg-white-fa border border-gray-light focus:outline-none transition ${
      hasError
        ? "ring-2 ring-red-500"
        : "focus:ring-2 focus:ring-blue-brand focus:border-blue-brand"
    }`;

  return (
    <main className="font-rubik flex flex-col lg:flex-row gap-8 items-start justify-center p-6 mx-auto w-[90%] max-w-6xl mt-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-4 p-8 bg-white rounded-2xl shadow-lg w-full lg:w-lg">
        <h1 className="text-3xl font-semibold mb-4 text-gray-dark">Dirección de envío</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={inputClass(errors.name)}
            {...register("name", {
              required: { value: true, message: "El nombre es obligatorio" },
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 20, message: "Máximo 20 caracteres" },
            })}
          />
          {errors.name && <ErrorMessage message={errors.name.message} />}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm font-medium">
            Dirección <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            className={inputClass(errors.address)}
            {...register("address", {
              required: { value: true, message: "La dirección es obligatoria" },
              minLength: { value: 5, message: "Mínimo 5 caracteres" },
              maxLength: { value: 50, message: "Máximo 50 caracteres" },
            })}
          />
          {errors.address && <ErrorMessage message={errors.address.message} />}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={inputClass(errors.email)}
            {...register("email", {
              required: { value: true, message: "El email es obligatorio" },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email inválido",
              },
            })}
          />
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={inputClass(errors.phone)}
            {...register("phone", {
              required: { value: true, message: "El teléfono es obligatorio" },
              pattern: { value: /^\d{10}$/, message: "10 dígitos requeridos" },
            })}
          />
          {errors.phone && <ErrorMessage message={errors.phone.message} />}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || cartItems.length === 0}
          className="bg-gray-dark rounded-lg text-white py-2.5 px-4 cursor-pointer hover:bg-gray-800 transition font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {isSubmitting ? "PROCESANDO..." : "REVISAR Y PAGAR"}
        </button>
        {submitError && <ErrorMessage message={submitError} />}
      </form>

      <section className="w-full lg:w-auto">
        <OrderDetails cartItems={cartItems} />
      </section>
    </main>
  );
}

export default Checkout;
