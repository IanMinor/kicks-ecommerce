import { Search, User, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DropDownMenu from "./DropDownMenu";
import { LogoIcon } from "../assets/Icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUserCart } from "../hooks/useUserCart";
import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import useCartCalculations from "../hooks/useCartCalculations";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cartItems } = useUserCart(user);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, subtotal } = useCartCalculations(cartItems);

  const [showMiniCart, setShowMiniCart] = useState(false);

  const { products } = useProducts();

  return (
    <header className="py-4 px-6">
      <nav className="bg-white w-full rounded-3xl px-4 md:px-8 py-6 flex items-center max-w-7xl mx-auto shadow-md relative">
        {/* Sección izquierda: Hamburguesa solo en móvil */}
        <div className="flex-1 flex items-center md:hidden">
          <button
            className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <span
              className={`block w-6 h-0.5 bg-black mb-1 transition-all ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-black mb-1 transition-all ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-black transition-all ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Sección izquierda (desktop) */}
        <div className="hidden md:flex flex-1 items-center gap-6 text-black font-medium">
          <Link
            to="/products"
            className="flex items-center gap-1 font-semibold"
          >
            <span role="img" aria-label="fire">
              🔥
            </span>
            New Drops
          </Link>
          <DropDownMenu title="Men" />
          <DropDownMenu title="Women" />
        </div>

        {/* Logo centrado absoluto en móvil, relativo en desktop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 flex justify-center items-center z-20 w-fit">
          <Link to="/">
            <LogoIcon />
          </Link>
        </div>

        {/* Sección derecha: opciones */}
        <div className="flex-1 flex items-center justify-end gap-6">
          <button className="cursor-pointer">
            <Search className="w-5 h-5 text-black" />
          </button>
          <Dropdown>
            <DropdownTrigger className="flex items-center justify-center gap-1 font-semibold cursor-pointer">
              <User className="w-5 h-5" />
            </DropdownTrigger>
            <DropdownMenu className="bg-white border border-gray-200 rounded-md shadow-lg px-5">
              <DropdownSection>
                {user ? (
                  <>
                    <DropdownItem
                      as={Link}
                      to="/account"
                      className="w-full px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      {user.nombre} {user.apellido}
                    </DropdownItem>
                    <DropdownItem
                      as="div"
                      onClick={logout}
                      className="w-full px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </DropdownItem>
                  </>
                ) : (
                  <>
                    <DropdownItem
                      as={Link}
                      to="/login"
                      className="w-full px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      Login
                    </DropdownItem>
                    <DropdownItem
                      as={Link}
                      to="/register"
                      className="w-full px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      Register
                    </DropdownItem>
                  </>
                )}
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>

          <div
            className="relative font-rubik"
            onMouseEnter={() => setShowMiniCart(true)}
            onMouseLeave={() => setShowMiniCart(false)}
          >
            <Link to="/cart" className="relative cursor-pointer">
              <ShoppingCart className="w-5 h-5 text-black" />
              <span className="absolute -top-2 -right-2 bg-yellow-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </Link>

            {/* Mini cart modal con animación */}
            <AnimatePresence>
              {showMiniCart && (
                <motion.div
                  key="mini-cart"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-8 right-0 z-50 w-[300px] bg-white shadow-xl border border-gray-200 rounded-xl px-4 py-3"
                >
                  <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto custom-scrollbar">
                    {cartItems.map((item) => {
                      const product = products.find(
                        (p) => p.id_producto === item.id_producto
                      );
                      return (
                        <div
                          key={item.id_producto}
                          className="flex gap-4 items-center text-sm py-2 border-b last:border-b-0 border-gray-100"
                        >
                          <img
                            src={item.imagen || product?.imagen}
                            alt={item.nombre_producto}
                            className="w-14 h-14 rounded-lg object-contain  flex-shrink-0"
                          />
                          <div className="flex flex-col flex-grow min-w-0">
                            <span className="truncate font-medium">
                              {item.nombre_producto}
                            </span>
                            <span className="text-xs text-gray-500">
                              x{item.cantidad}
                            </span>
                          </div>
                          <span className="text-base font-semibold text-gray-700 whitespace-nowrap ml-2">
                            ${item.precio}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2 border-t pt-2 flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>${subtotal}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-b-3xl z-40 animate-fade-in flex flex-col items-center py-6 gap-4">
            <Link
              to="/products"
              className="flex items-center gap-1 font-semibold text-black text-lg"
              onClick={() => setMenuOpen(false)}
            >
              <span role="img" aria-label="fire">
                🔥
              </span>
              New Drops
            </Link>
            <DropDownMenu title="Men" onClick={() => setMenuOpen(false)} />
            <DropDownMenu title="Women" onClick={() => setMenuOpen(false)} />
          </div>
        )}
      </nav>
      {console.log(cartItems)}
    </header>
  );
}
