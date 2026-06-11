// import { Routes, Route } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Layout from "./Layout";
import OrderConfirmation from "./pages/OrderConfirmation";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "/order-confirmation/:id_pedido",
        element: <OrderConfirmation />,
      },
      { path: "account", element: <Account /> },
    ],
  },
]);

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  useEffect(() => {
    initialize();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
