import { useEffect } from "react";

const TITLES = {
  "/": "Kicks Store | Sneakers",
  "/products": "Kicks Store | Tienda",
  "/cart": "Kicks Store | Carrito",
  "/checkout": "Kicks Store | Checkout",
  "/login": "Kicks Store | Iniciar Sesión",
  "/register": "Kicks Store | Crear Cuenta",
  "/account": "Kicks Store | Mi Cuenta",
};

export function usePageTitle(pathname) {
  useEffect(() => {
    const base = TITLES[pathname];
    if (base) {
      document.title = base;
    } else if (pathname.startsWith("/products/")) {
      document.title = "Kicks Store | Producto";
    } else if (pathname.startsWith("/order-confirmation/")) {
      document.title = "Kicks Store | Pedido Confirmado";
    } else {
      document.title = "Kicks Store";
    }
  }, [pathname]);
}
