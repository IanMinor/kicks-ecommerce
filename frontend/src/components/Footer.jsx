import { Link } from "react-router-dom";
import { LogoIcon } from "../assets/Icons";

function Footer() {
  return (
    <footer className="bg-gray-dark text-white font-rubik mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4 [&_svg]: [&_path]:fill-white">
              <LogoIcon />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu tienda de sneakers favorita. Estilo, comodidad y las mejores
              marcas en un solo lugar.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Tienda
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link
                  to="/products?gender=men"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Hombres
                </Link>
              </li>
              <li>
                <Link
                  to="/products?gender=women"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Mujeres
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Ayuda
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">
                  Preguntas frecuentes
                </span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">
                  Envíos y entregas
                </span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Devoluciones</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Síguenos
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
                  Instagram
                </span>
              </li>
              <li>
                <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
                  Twitter / X
                </span>
              </li>
              <li>
                <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
                  TikTok
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Kicks Store. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="hover:text-gray-300 transition-colors cursor-pointer">
              Privacidad
            </span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">
              Términos
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
