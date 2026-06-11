import { useFilterOptions } from "../hooks/useFilterOptions";
import { useFilterStore } from "../store/useFilterStore";

function ProductFilters({ onApply, onReset }) {
  const { options, loading, error } = useFilterOptions();
  const { filters, toggleFilterValue, updateFilter } = useFilterStore();

  if (loading) return <p>Cargando filtros...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleChangePrice = (e) => {
    updateFilter("minPrice", Number(e.target.value));
  };

  const handleChangeGender = (e) => {
    toggleFilterValue("gender", e.target.value.toLowerCase());
  };

  const handleChangeCategory = (e) => {
    toggleFilterValue("category", e.target.value);
  };

  // Botón de reset: limpia todos los filtros
  const handleReset = () => {
    updateFilter("minPrice", 0);
    updateFilter("gender", []);
    updateFilter("size", []);
    updateFilter("color", []);
    updateFilter("category", []);
    if (onReset) onReset();
  };

  return (
    <div className="p-4 rounded-2xl font-rubik">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      {/* Refine By */}
      <div className="mb-8">
        <h3 className="font-medium mb-2">REFINE BY</h3>
        <div className="flex gap-2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
            Mens
          </span>
          <span className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm">
            Casual
          </span>
        </div>
      </div>
      {/* Size */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {options.sizes.map((size) => {
          const isSelected = filters.size.includes(String(size));
          return (
            <button
              key={size}
              value={size}
              onClick={() => toggleFilterValue("size", String(size))}
              className={`border rounded-lg px-2 py-1 transition duration-200 cursor-pointer
          ${isSelected ? "bg-black text-white" : "hover:bg-gray-200"}`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Color */}
      <div className="grid grid-cols-5 gap-2 mb-8">
        {options.colors.map((color, idx) => {
          const isSelected = filters.color.includes(color.toLowerCase());

          return (
            <button
              key={idx}
              style={{ backgroundColor: color }}
              onClick={() => toggleFilterValue("color", color.toLowerCase())}
              className={`w-7 h-7 rounded-[8px] border transition duration-200 ${
                isSelected ? "ring-2 ring-black scale-105" : ""
              }`}
            ></button>
          );
        })}
      </div>

      {/* Categorías */}
      <div className="mb-8">
        {options.categories.map((category) => (
          <div key={category} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id={category}
              value={category || ""}
              checked={filters.category.includes(category)}
              onChange={(e) => toggleFilterValue("category", category)}
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>

      {/* Gender */}
      <div className="mb-8">
        <h3 className="font-medium mb-2">GENDER</h3>
        {["Men", "Women"].map((gender) => (
          <div key={gender} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id={gender}
              value={gender}
              checked={filters.gender.includes(gender.toLowerCase())}
              onChange={handleChangeGender}
            />
            <label htmlFor={gender}>{gender}</label>
          </div>
        ))}
      </div>
      {/* Price Slider */}
      <div className="mb-8">
        <h3 className="font-medium mb-2">PRICE</h3>
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          className="w-full"
          onChange={handleChangePrice}
          value={filters.minPrice}
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>${filters.minPrice}</span>
        </div>
      </div>
      <div className="flex gap-3 mt-6 md:hidden">
        <button
          type="button"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          onClick={handleReset}
        >
          Reiniciar
        </button>
        <button
          type="button"
          className="bg-blue-brand text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={onApply}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}

export default ProductFilters;
