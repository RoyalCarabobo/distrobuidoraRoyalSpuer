'use client';
import { useState, useEffect, useCallback } from 'react';
import { ProductService } from '@/services/products';

export function useProducts() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await ProductService.getAllProducts();
      setProductos(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setIsError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carga Inicial
    fetchProducts();

    // Suscripción a cambios en tiempo real
    const unsubscribe = ProductService.subscribeToLatestProducts(() => {
      console.log('Actualización en tiempo real detectada en el Catálogo');
      // Cuando hay cambios en BD, volvemos a solicitar los productos
      fetchProducts();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchProducts]);

  return { productos, isLoading, isError, mutate: fetchProducts };
}