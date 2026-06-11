import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginUser } from "../utils/authApi";
import SuccessModal from "../components/SuccessModal";
import { useState } from "react";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    } catch (err) {
      setError("root", { message: "Error de conexión" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SuccessModal show={showSuccess} message="¡Inicio de sesión exitoso!" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 rounded-2xl shadow-lg max-w-md w-full space-y-5"
      >
        <h2 className="text-3xl font-bold text-center">Login</h2>
        {/* Email */}
        <div>
          <label className="block mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email", {
              required: "Email is required",
            })}
            type="email"
            className={`w-full px-4 py-2 rounded-l focus:outline-none ${
              errors.email
                ? "ring-2 ring-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        {/* Password */}
        <div>
          <label className="block mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            {...register("contraseña", {
              required: "Password is required",
            })}
            type="password"
            className={`w-full px-4 py-2 rounded-lg  focus:outline-none ${
              errors.password
                ? "ring-2 ring-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
            placeholder="Enter your password"
          />
          {errors.contraseña && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contraseña.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-gray-dark text-white uppercase w-full py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Login
        </button>

        {errors.root && (
          <p className="text-red-500 text-sm text-center">
            {errors.root.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
