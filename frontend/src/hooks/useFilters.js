import { useFilterStore } from "../store/useFilterStore";
import { products } from "../data/products";

export function useFilters() {
  const { filters } = useFilterStore();

  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= filters.minPrice;
    const matchesGender =
      filters.gender.length === 0 ||
      filters.gender.includes(product.gender?.toLowerCase());
    const matchesSize =
      filters.size.length === 0 ||
      filters.size.some((size) => product.size.includes(parseFloat(size)));
    const matchesColor =
      filters.color.length === 0 || filters.color.includes(product.color);
    const matchesCategory =
      filters.category.length === 0 ||
      filters.category.includes(product.category);

    return (
      matchesPrice &&
      matchesGender &&
      matchesSize &&
      matchesColor &&
      matchesCategory
    );
  });

  return { filteredProducts };
}
