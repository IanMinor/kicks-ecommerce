import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ErrorMessage from "../components/ErrorMessage";
import { registerUser } from "../utils/authApi";
import { useState } from "react";
import SuccessModal from "../components/SuccessModal";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
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
    } catch (err) {
      setError("root", { message: "Error de conexión al servidor" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      <SuccessModal
        show={showSuccess}
        message="✅ Registro exitoso. ¡Bienvenido!"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 rounded-2xl shadow-lg max-w-md w-full  space-y-5"
      >
        <h2 className="text-3xl font-bold text-center">Create Account</h2>
        {errors.root && (
          <p className="text-red-500 text-sm">{errors.root.message}</p>
        )}
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("nombre", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Name must be at most 20 characters",
              },
            })}
            className={`w-full px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.nombre ? "ring-red-500" : "ring-gray-300"
            }`}
            placeholder="Enter your name"
          />
          {errors.nombre && <ErrorMessage message={errors.nombre.message} />}
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-semibold">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("apellido", {
              required: "Last name is required",
              minLength: {
                value: 3,
                message: "Last name must be at least 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Last name must be at most 20 characters",
              },
            })}
            className={`w-full px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.name ? "ring-red-500" : "ring-gray-300"
            }`}
            placeholder="Enter your last name"
          />
          {errors.apellido && (
            <ErrorMessage message={errors.apellido.message} />
          )}
        </div>

        {/* Phone number */}
        <div>
          <label className="block mb-1 font-semibold">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register("numero_telefono", {
              required: "Phone number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Invalid phone number",
              },
            })}
            className={`w-full px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.name ? "ring-red-500" : "ring-gray-300"
            }`}
            placeholder="Enter your phone number"
          />
          {errors.numero_telefono && (
            <ErrorMessage message={errors.numero_telefono.message} />
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            type="email"
            className={`w-full px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.name ? "ring-red-500" : "ring-gray-300"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-semibold">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            {...register("contraseña", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
            type="password"
            className={`w-full px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.name ? "ring-red-500" : "ring-gray-300"
            }`}
            placeholder="Enter your password"
          />
          {errors.contraseña && (
            <ErrorMessage message={errors.contraseña.message} />
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-semibold">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === contraseña || "Passwords must match",
            })}
            type="password"
            className={`w-full px-4 py-2 rounded-lg bg-transparent border-1 border-gray-light focus:outline-none focus:ring-2 ${
              errors.name ? "ring-red-500" : "ring-gray-300"
            }`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <ErrorMessage message={errors.confirmPassword.message} />
          )}
        </div>

        {/* Terms */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("terms", {
              required: "You must accept the terms and conditions",
            })}
          />
          <label className="text-sm">
            I agree to the{" "}
            <span className="underline cursor-pointer">
              terms and conditions
            </span>
          </label>
        </div>
        {errors.terms && <ErrorMessage message={errors.terms.message} />}

        {/* Button */}
        <button
          type="submit"
          className="bg-gray-dark text-white uppercase w-full py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
