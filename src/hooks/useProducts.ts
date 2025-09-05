import { useState, useEffect, useCallback } from 'react';
import { dbService, WoodProduct } from '@/services/database';

interface UseProductsReturn {
  products: WoodProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getProductsByCategory: (category: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<WoodProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await dbService.getProducts(100); // Get up to 100 products
      setProducts(fetchedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await dbService.getProductsByCategory(category);
      setProducts(fetchedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products by category');
      console.error('Error fetching products by category:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await dbService.searchProducts(query);
      setProducts(fetchedProducts);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    getProductsByCategory,
    searchProducts
  };
};
