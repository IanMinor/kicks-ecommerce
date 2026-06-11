import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { useFilteredPaginatedProducts } from "../hooks/useFilteredPaginatedProducts";
import { Pagination } from "@heroui/pagination";

function Products() {
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { products, totalPages, loading, error } =
    useFilteredPaginatedProducts(page);

  const handleFiltersApply = () => {
    setPage(1);
    setShowFilters(false);
  };

  if (loading)
    return <p className="text-center mt-10">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="flex gap-5 justify-center w-[90%] mx-auto relative mt-6">
      {/* Botón móvil para abrir filtros */}
      <button
        type="button"
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-brand text-white px-5 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2"
        onClick={() => setShowFilters(true)}
        aria-label="Mostrar filtros"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M3 6h18M6 12h12M10 18h4"
          />
        </svg>
        Filtros
      </button>

      {/* Aside de filtros en desktop */}
      <aside className="max-w-[300px] w-full rounded-[28px] p-6 hidden md:block">
        <ProductFilters onApply={() => setPage(1)} />
      </aside>

      {/* Modal de filtros en móvil */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-[90vw] max-w-xs max-h-[90vh] relative animate-fade-in flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="sticky top-0 right-0 self-end z-10 text-gray-500 hover:text-black text-2xl font-bold bg-white rounded-full p-1 mb-2"
              onClick={() => setShowFilters(false)}
              aria-label="Cerrar filtros"
            >
              &times;
            </button>
            <ProductFilters onApply={handleFiltersApply} />
          </div>
        </div>
      )}

      {/* Productos */}
      <section className="w-full">
        {products.length === 0 ? (
          <p className="text-gray-500 flex justify-center items-center h-screen text-xl font-semibold">
            No se encontraron productos.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-items-center mt-8 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id_producto || product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Paginación */}
            <div className="flex justify-center mt-10">
              <div className="w-full max-w-fit">
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={setPage}
                  isCompact
                  showControls
                  showShadow
                  className="rounded-xl bg-white shadow-lg p-2 border border-gray-200 flex items-center justify-center w-auto mx-auto text-blue-brand font-semibold text-base"
                  itemClassName="rounded-lg hover:bg-blue-100 transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center mx-[8px] text-lg"
                  activeItemClassName="bg-blue-brand text-white hover:bg-blue-brand/90 mx-[8px]"
                  controlClassName="rounded-lg hover:bg-blue-100 transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center mx-[8px] text-lg"
                  prevIcon={
                    <span className="inline-block rotate-180">&#10140;</span>
                  }
                  nextIcon={<span className="inline-block">&#10140;</span>}
                />
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Products;
