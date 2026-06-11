import { useEffect, useState } from "react";
import { useFilterStore } from "../store/useFilterStore";
import { apiUrl } from "../utils/api";

export function useFilteredProducts() {
  const { filters } = useFilterStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buildQuery = () => {
      const params = new URLSearchParams();

      if (filters.minPrice > 0) params.append("minPrice", filters.minPrice);

      ["gender", "size", "color", "category"].forEach((key) => {
        filters[key].forEach((value) => params.append(key, value));
      });

      return params.toString();
    };

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = buildQuery();
        const res = await fetch(`${apiUrl}/api/products?${query}`);
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error };
}
