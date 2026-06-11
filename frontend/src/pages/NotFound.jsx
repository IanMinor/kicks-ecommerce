import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 font-rubik">
      <p className="text-sm uppercase tracking-[0.3em] text-blue-brand font-semibold mb-3">
        404
      </p>
      <h1 className="text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        to="/"
        className="bg-gray-dark text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition"
      >
        Go Home
      </Link>
    </main>
  );
}

export default NotFound;
