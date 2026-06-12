import { MoveRight, RefreshCw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeleton";
import { useProducts } from "../hooks/useProducts";
import { useFilterStore } from "../store/useFilterStore";

const categoryTiles = [
  {
    title: "Hombres",
    eyebrow: "Sneakers para todos los días",
    filter: { gender: ["men"], category: [] },
    className: "bg-gray-dark text-white",
  },
  {
    title: "Mujeres",
    eyebrow: "Siluetas ligeras y versátiles",
    filter: { gender: ["women"], category: [] },
    className: "bg-blue-brand text-white",
  },
  {
    title: "Running",
    eyebrow: "Respuesta, agarre y comodidad",
    filter: { gender: [], category: ["Running"] },
    className: "bg-yellow-accent text-gray-dark",
  },
  {
    title: "Basketball",
    eyebrow: "Soporte para jugar fuerte",
    filter: { gender: [], category: ["Basketball"] },
    className: "bg-white text-gray-dark border border-gray-light",
  },
];

const trustBadges = [
  {
    icon: Truck,
    title: "Envíos rápidos",
    text: "Recibe tus sneakers favoritos sin esperas innecesarias.",
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    text: "Proceso simple, protegido y listo para finalizar tu pedido.",
  },
  {
    icon: RefreshCw,
    title: "Cambios sencillos",
    text: "Compra con más confianza si necesitas ajustar tu elección.",
  },
];

function HomePage() {
  const { products, loading } = useProducts();
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const setMultipleFilters = useFilterStore((state) => state.setMultipleFilters);
  const featuredProducts = products.slice(0, 6);
  const carouselProducts = [...featuredProducts, ...featuredProducts];

  const handleCategoryClick = (filter) => {
    resetFilters();
    setMultipleFilters(filter);
  };

  return (
    <main className="font-rubik w-full max-w-[1200px] mx-auto px-2">
      <section className="grid grid-cols-1 md:grid-cols-2 py-10 md:py-20 items-center justify-center gap-8">
        <article>
          <motion.div
            className="flex flex-col md:items-start items-center justify-center text-6xl md:text-8xl font-bold md:text-left text-center"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="text-blue-brand"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            >
              DO IT
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            >
              RIGHT
            </motion.span>
          </motion.div>

          <motion.p
            className="text-2xl md:text-left text-center mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Explore the new collection of sneakers
          </motion.p>

          <motion.div
            className="flex md:justify-start justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Link
              to="/products"
              className="flex justify-between items-center w-[200px] mt-6 bg-blue-brand text-white py-4 px-5 rounded-[8px] font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200"
            >
              Explore
              <MoveRight />
            </Link>
          </motion.div>
        </article>

        <article className="flex justify-center items-center mt-8 md:mt-0">
          <motion.figure
            className="w-[90vw] max-w-[350px] md:max-w-[505px] h-[90vw] max-h-[350px] md:max-h-[505px] rounded-full bg-black bg-cover flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.7,
              type: "spring",
              stiffness: 80,
            }}
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px #000" }}
          >
            <motion.img
              src="/images/yeezy.png"
              alt="Yeezy sneaker"
              className="relative w-[80vw] max-w-[300px] md:w-[650px] md:max-w-[650px] h-[80vw] max-h-[300px] md:h-[650px] md:max-h-[650px] right-0 md:right-[50px] bottom-0 md:bottom-[100px] rotate-[-5deg]"
              initial={{ rotate: -15, y: 60, opacity: 0 }}
              animate={{ rotate: -5, y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 60,
              }}
            />
          </motion.figure>
        </article>
      </section>

      <section className="py-10 md:py-16">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 px-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-sm font-bold text-blue-brand uppercase tracking-[0.2em]">
              Nuevos lanzamientos
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-dark mt-2">
              Pares que elevan tu rotación
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gray-dark font-semibold hover:text-blue-brand transition-colors"
          >
            Ver toda la colección
            <MoveRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="relative overflow-hidden py-4">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white-fa to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white-fa to-transparent" />

          {loading ? (
            <div className="flex gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex w-max gap-8"
              animate={{ x: [0, -((300 + 32) * featuredProducts.length)] }}
              transition={{
                duration: 26,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {carouselProducts.map((product, index) => (
                <div
                  key={`${product.id_producto || product.id}-${index}`}
                  className="shrink-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-10 md:py-16 px-2">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-bold text-blue-brand uppercase tracking-[0.2em]">
              Compra por estilo
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-dark mt-2">
              Encuentra tu zona
            </h2>
          </div>
          <p className="max-w-md text-stone-gray">
            Accesos rápidos para saltar directo a los estilos que más se ajustan
            a tu ritmo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryTiles.map((category) => (
            <Link
              key={category.title}
              to="/products"
              onClick={() => handleCategoryClick(category.filter)}
              className={`${category.className} min-h-[220px] rounded-2xl p-6 flex flex-col justify-between shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden relative`}
            >
              <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/15" />
              <div>
                <p className="text-sm font-semibold opacity-80">
                  {category.eyebrow}
                </p>
                <h3 className="text-3xl font-extrabold mt-3">
                  {category.title}
                </h3>
              </div>
              <span className="inline-flex items-center gap-2 font-semibold">
                Explorar
                <MoveRight className="w-5 h-5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-10 md:py-16 px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trustBadges.map((badge) => {
            const BadgeIcon = badge.icon;

            return (
            <motion.article
              key={badge.title}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-light"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35 }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-brand/10 text-blue-brand flex items-center justify-center mb-5">
                <BadgeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-dark">{badge.title}</h3>
              <p className="text-stone-gray mt-2 leading-relaxed">{badge.text}</p>
            </motion.article>
            );
          })}
        </div>
      </section>

      <section className="py-10 md:py-16 px-2">
        <motion.div
          className="rounded-[32px] bg-gray-dark text-white overflow-hidden grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] min-h-[380px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
        >
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-yellow-accent font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              Kicks edit
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-none">
              Tu próximo par empieza con una buena silueta
            </h2>
            <p className="text-gray-300 mt-5 max-w-xl leading-relaxed">
              De la cancha a la calle, una selección pensada para moverte con
              comodidad sin perder presencia.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-between w-fit gap-6 mt-8 bg-white text-gray-dark py-3 px-5 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Ver colección
              <MoveRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="relative min-h-[280px] bg-blue-brand flex items-center justify-center overflow-hidden">
            <div className="absolute inset-8 border border-white/20 rounded-full" />
            <div className="absolute w-72 h-72 rounded-full bg-yellow-accent/90 blur-3xl opacity-40" />
            <img
              src="/images/yeezy.png"
              alt="Sneaker destacado"
              className="relative z-10 w-[115%] max-w-[560px] rotate-[-18deg] translate-x-4 md:translate-x-10"
            />
          </div>
        </motion.div>
      </section>

      <section className="py-12 md:py-20 px-2 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-dark">
          Encuentra tu próximo par
        </h2>
        <p className="text-stone-gray mt-4 max-w-2xl mx-auto">
          Explora sneakers listos para entrenar, salir o completar tu outfit de
          todos los días.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-3 mt-8 bg-blue-brand text-white py-4 px-6 rounded-lg font-semibold shadow-lg hover:bg-blue-brand/90 hover:shadow-xl transition"
        >
          Ver colección completa
          <MoveRight className="w-5 h-5" />
        </Link>
      </section>
    </main>
  );
}

export default HomePage;
