import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginUser } from "../utils/authApi";
import SuccessModal from "../components/SuccessModal";
import { useState } from "react";
import { motion } from "framer-motion";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const { ok, result } = await loginUser(data);
      if (ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          login(result);
          navigate("/");
        }, 1500);
      } else {
        setError("root", { message: result.message });
      }
    } catch {
      setError("root", { message: "Error de conexión" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-rubik">
      <SuccessModal show={showSuccess} message="¡Inicio de sesión exitoso!" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-dark">Iniciar sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-sm">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email", {
                required: "El email es obligatorio",
              })}
              type="email"
              className={`w-full px-4 py-2.5 rounded-lg bg-white-fa border border-gray-light focus:outline-none transition ${
                errors.email
                  ? "ring-2 ring-red-500"
                  : "focus:ring-2 focus:ring-blue-brand focus:border-blue-brand"
              }`}
              placeholder="Ingresa tu email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              {...register("contraseña", {
                required: "La contraseña es obligatoria",
              })}
              type="password"
              className={`w-full px-4 py-2.5 rounded-lg bg-white-fa border border-gray-light focus:outline-none transition ${
                errors.contraseña
                  ? "ring-2 ring-red-500"
                  : "focus:ring-2 focus:ring-blue-brand focus:border-blue-brand"
              }`}
              placeholder="Ingresa tu contraseña"
            />
            {errors.contraseña && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contraseña.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-dark text-white uppercase w-full py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>

        {errors.root && (
          <p className="text-red-500 text-sm text-center">
            {errors.root.message}
          </p>
        )}
        <p className="text-sm text-center text-stone-gray">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-brand font-semibold hover:underline">
            Regístrate
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
