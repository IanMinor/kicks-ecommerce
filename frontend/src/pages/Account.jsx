import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

function Account() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#1f1f2f]/90 shadow-2xl rounded-2xl px-10 py-12 max-w-md w-full flex flex-col items-center border border-[#23243a]"
      >
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-6 border-4 border-[#23243a]">
          {getInitials(user.name || user.nombre || "U")}
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-yellow-400 tracking-tight text-center drop-shadow">
          ¡Hola, {user.name || user.nombre}!
        </h1>
        <p className="text-lg text-gray-300 mb-8 text-center">
          Bienvenido a tu cuenta personal
        </p>
        <div className="w-full bg-[#23243a] p-6 rounded-lg flex flex-col gap-4 border border-[#181825]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-200">Nombre:</span>
            <span className="text-gray-100">{user.name || user.nombre}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-200">Email:</span>
            <span className="text-gray-100">{user.email}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Account;
