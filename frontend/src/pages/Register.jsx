import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ErrorMessage from "../components/ErrorMessage";
import { registerUser } from "../utils/authApi";
import { useState } from "react";
import SuccessModal from "../components/SuccessModal";
import { motion } from "framer-motion";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const contraseña = watch("contraseña");
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const { ok, result } = await registerUser(data);
      if (ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          login(result);
          navigate("/");
        }, 1800);
      } else {
        setError("root", { message: result.message });
      }
    } catch {
      setError("root", { message: "Error de conexión al servidor" });
    }
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg bg-white-fa border border-gray-light focus:outline-none transition ${
      hasError
        ? "ring-2 ring-red-500"
        : "focus:ring-2 focus:ring-blue-brand focus:border-blue-brand"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-rubik">
      <SuccessModal
        show={showSuccess}
        message="✅ Registro exitoso. ¡Bienvenido!"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-dark">Crear cuenta</h2>
        {errors.root && (
          <p className="text-red-500 text-sm">{errors.root.message}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 20, message: "Máximo 20 caracteres" },
              })}
              className={inputClass(errors.nombre)}
              placeholder="Ingresa tu nombre"
            />
            {errors.nombre && <ErrorMessage message={errors.nombre.message} />}
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              {...register("apellido", {
                required: "El apellido es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 20, message: "Máximo 20 caracteres" },
              })}
              className={inputClass(errors.apellido)}
              placeholder="Ingresa tu apellido"
            />
            {errors.apellido && <ErrorMessage message={errors.apellido.message} />}
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              {...register("numero_telefono", {
                required: "El teléfono es obligatorio",
                pattern: { value: /^\d{10}$/, message: "10 dígitos requeridos" },
              })}
              className={inputClass(errors.numero_telefono)}
              placeholder="Ingresa tu teléfono"
            />
            {errors.numero_telefono && (
              <ErrorMessage message={errors.numero_telefono.message} />
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email inválido",
                },
              })}
              type="email"
              className={inputClass(errors.email)}
              placeholder="Ingresa tu email"
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              {...register("contraseña", {
                required: "La contraseña es obligatoria",
                minLength: { value: 4, message: "Mínimo 4 caracteres" },
              })}
              type="password"
              className={inputClass(errors.contraseña)}
              placeholder="Ingresa tu contraseña"
            />
            {errors.contraseña && (
              <ErrorMessage message={errors.contraseña.message} />
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Confirmar contraseña <span className="text-red-500">*</span>
            </label>
            <input
              {...register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: (value) =>
                  value === contraseña || "Las contraseñas no coinciden",
              })}
              type="password"
              className={inputClass(errors.confirmPassword)}
              placeholder="Confirma tu contraseña"
            />
            {errors.confirmPassword && (
              <ErrorMessage message={errors.confirmPassword.message} />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("terms", {
                required: "Debes aceptar los términos y condiciones",
              })}
              className="w-4 h-4 accent-blue-brand"
            />
            <label className="text-sm">
              Acepto los{" "}
              <span className="underline cursor-pointer text-blue-brand">
                términos y condiciones
              </span>
            </label>
          </div>
          {errors.terms && <ErrorMessage message={errors.terms.message} />}

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
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-sm text-center text-stone-gray">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-brand font-semibold hover:underline">
            Inicia sesión
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
