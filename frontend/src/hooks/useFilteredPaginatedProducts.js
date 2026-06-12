import { useState, useEffect } from "react";
import { useFilterStore } from "../store/useFilterStore";
import { apiUrl } from "../utils/api";

export function useFilteredPaginatedProducts(page = 1, limit = 9) {
  const { filters } = useFilterStore();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = buildQuery();
        const res = await fetch(`${apiUrl}/api/products?${query}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Error al obtener productos");

        const data = await res.json();

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error al obtener productos:", err);
        setError("Error al obtener productos");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchData, 200);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [filters, page, limit]);

  return { products, totalPages, loading, error };
}
