import { useAuthStore } from "../store/authStore";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

function Account() {
  const { user, logout } = useAuthStore();
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-rubik">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-xl rounded-2xl px-10 py-12 max-w-md w-full flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full bg-blue-brand flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-6">
          {getInitials(user.name || user.nombre || "U")}
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-gray-dark tracking-tight text-center">
          ¡Hola, {user.name || user.nombre}!
        </h1>
        <p className="text-lg text-stone-gray mb-8 text-center">
          Bienvenido a tu cuenta personal
        </p>
        <div className="w-full bg-white-fa p-6 rounded-xl flex flex-col gap-4 border border-gray-light">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-dark">Nombre:</span>
            <span className="text-stone-gray">{user.name || user.nombre}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-dark">Email:</span>
            <span className="text-stone-gray">{user.email}</span>
          </div>
        </div>
        <div className="flex gap-3 mt-8 w-full">
          <Link
            to="/"
            className="flex-1 py-2.5 px-4 bg-gray-dark text-white rounded-lg text-center font-semibold hover:bg-gray-800 transition"
          >
            Inicio
          </Link>
          <button
            onClick={logout}
            className="flex-1 py-2.5 px-4 bg-white border border-gray-light text-gray-dark rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Account;
