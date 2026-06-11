import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import Layout from "./Layout";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Account = lazy(() => import("./pages/Account"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const NotFound = lazy(() => import("./pages/NotFound"));

function withSuspense(element) {
  return (
    <Suspense
      fallback={
        <p className="text-gray-500 flex justify-center items-center min-h-[40vh] text-xl font-semibold w-full">
          Loading...
        </p>
      }
    >
      {element}
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: "products", element: withSuspense(<Products />) },
      { path: "products/:id", element: withSuspense(<ProductDetail />) },
      {
        path: "cart",
        element: withSuspense(
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: withSuspense(
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: withSuspense(<Login />) },
      { path: "register", element: withSuspense(<Register />) },
      {
        path: "order-confirmation/:id_pedido",
        element: withSuspense(
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        ),
      },
      {
        path: "account",
        element: withSuspense(
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: withSuspense(<NotFound />) },
    ],
  },
]);

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);

  return <RouterProvider router={router} />;
}

export default App;
