import { useAuthStore } from "../store/authStore";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  LogOut,
  Mail,
  PackageCheck,
  Phone,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

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

  const firstName = user.name || user.nombre || "Usuario";
  const lastName = user.apellido || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const accountDetails = [
    {
      label: "Nombre completo",
      value: fullName,
      icon: User,
    },
    {
      label: "Email",
      value: user.email || "No registrado",
      icon: Mail,
    },
    {
      label: "Teléfono",
      value: user.numero_telefono || user.phone || "No registrado",
      icon: Phone,
    },
    {
      label: "ID de cliente",
      value: user.id_usuario ? `#${user.id_usuario}` : "Pendiente",
      icon: BadgeCheck,
    },
  ];

  const quickActions = [
    {
      title: "Seguir comprando",
      text: "Explora nuevos lanzamientos y encuentra tu próximo par.",
      to: "/products",
      icon: ShoppingBag,
      accent: "bg-blue-brand text-white",
    },
    {
      title: "Ver carrito",
      text: "Revisa los productos que tienes listos para comprar.",
      to: "/cart",
      icon: PackageCheck,
      accent: "bg-gray-dark text-white",
    },
    {
      title: "Favoritos",
      text: "Guarda tus pares preferidos para volver a ellos después.",
      to: "/products",
      icon: Heart,
      accent: "bg-yellow-accent text-gray-dark",
    },
  ];

  return (
    <main className="min-h-screen px-4 py-8 md:py-12 font-rubik">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-[32px] bg-gray-dark text-white shadow-xl">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-brand/50 blur-3xl" />
          <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-yellow-accent/30 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="h-28 w-28 rounded-3xl bg-white text-blue-brand flex items-center justify-center text-4xl font-extrabold shadow-lg shrink-0">
                {getInitials(fullName)}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-yellow-accent mb-4">
                  <Sparkles className="w-4 h-4" />
                  Cuenta activa
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-none">
                  Hola, {firstName}
                </h1>
                <p className="text-gray-300 mt-4 max-w-xl">
                  Gestiona tus datos, revisa tus productos y vuelve rápido a tu
                  próxima compra.
                </p>
              </div>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-accent text-gray-dark flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Perfil verificado</p>
                  <p className="text-sm text-gray-300">Sesión iniciada correctamente</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Tu cuenta está lista para comprar, guardar productos y continuar
                con el checkout cuando lo necesites.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 mt-8">
          <section className="bg-white rounded-3xl shadow-lg border border-gray-light p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-bold text-blue-brand uppercase tracking-[0.2em]">
                  Perfil
                </p>
                <h2 className="text-2xl font-extrabold text-gray-dark mt-1">
                  Información personal
                </h2>
              </div>
              <div className="hidden sm:flex h-12 w-12 rounded-full bg-blue-brand/10 text-blue-brand items-center justify-center">
                <User className="w-6 h-6" />
              </div>
            </div>

            <div className="grid gap-4">
              {accountDetails.map((detail) => {
                const DetailIcon = detail.icon;

                return (
                  <article
                    key={detail.label}
                    className="flex items-center gap-4 rounded-2xl bg-white-fa border border-gray-light p-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white text-blue-brand flex items-center justify-center shadow-sm shrink-0">
                      <DetailIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-stone-gray">{detail.label}</p>
                      <p className="font-bold text-gray-dark truncate">
                        {detail.value}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group bg-white rounded-3xl shadow-lg border border-gray-light p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${action.accent} flex items-center justify-center shrink-0`}
                    >
                      <ActionIcon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-stone-gray group-hover:text-blue-brand group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-dark mt-5">
                    {action.title}
                  </h3>
                  <p className="text-stone-gray mt-2 text-sm leading-relaxed">
                    {action.text}
                  </p>
                </Link>
              );
            })}
          </section>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 bg-white rounded-3xl shadow-lg border border-gray-light p-6 md:p-8 items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-dark">
              ¿Quieres salir de tu cuenta?
            </h2>
            <p className="text-stone-gray mt-2">
              Cierra sesión solo si estás en un dispositivo compartido o deseas
              cambiar de usuario.
            </p>
          </div>
          <button
            onClick={logout}
            className="py-3 px-5 bg-gray-dark text-white rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </motion.section>
    </main>
  );
}

export default Account;
