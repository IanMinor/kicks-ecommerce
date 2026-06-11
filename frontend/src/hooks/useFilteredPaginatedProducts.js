import { useState, useEffect } from "react";
import { useFilterStore } from "../store/useFilterStore";

export function useFilteredPaginatedProducts(page = 1, limit = 9) {
  const { filters } = useFilterStore();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildQuery = () => {
    const params = new URLSearchParams();

    if (filters.minPrice > 0) params.append("minPrice", filters.minPrice);
    if (filters.gender.length)
      filters.gender.forEach((g) => params.append("gender", g));
    if (filters.color.length)
      filters.color.forEach((c) => params.append("color", c));
    if (filters.size.length)
      filters.size.forEach((s) => params.append("size", s));
    if (filters.category.length)
      filters.category.forEach((cat) => params.append("category", cat));

    params.append("page", page);
    params.append("limit", limit);

    return params.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = buildQuery();
        const res = await fetch(`http://localhost:3001/api/products?${query}`);
        const data = await res.json();

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("Error al obtener productos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, page]);

  return { products, totalPages, loading, error };
}
