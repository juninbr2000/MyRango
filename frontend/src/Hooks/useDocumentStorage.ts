import { useState, useEffect } from "react";
import type { CartItem } from "../types/OrderTypes";

export const useDocumentStorage = (key: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<CartItem[]>([]);

  // 🔹 Carregar no início
  useEffect(() => {
    getItem();
  }, []);

  const addItem = (item: CartItem) => {
    setError(null);
    setLoading(true);

    try {
      const current = JSON.parse(localStorage.getItem(key) || "[]") as CartItem[];

      // se já existir, só aumenta a quantidade
      const exists = current.find((p) => p._id === item._id);
      let updated: CartItem[];

      if (exists) {
        updated = current.map((p) =>
          p._id === item._id ? { ...p, amount: p.amount + item.amount } : p
        );
      } else {
        updated = [...current, item];
      }

      localStorage.setItem(key, JSON.stringify(updated));
      setDocs(updated);
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const getItem = () => {
    setError(null);
    setLoading(true);

    try {
      const value = localStorage.getItem(key);
      if (value) {
        const parsed = JSON.parse(value) as CartItem[];
        setDocs(parsed);
      } else {
        setDocs([]);
      }
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (id: string) => {
    try {
      const current = JSON.parse(localStorage.getItem(key) || "[]") as CartItem[];
      const updated = current.filter((p) => p._id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
      setDocs(updated);
    } catch (err) {
      console.error(err);
      setError(String(err));
    }
  };

  const clear = () => {
    localStorage.removeItem(key);
    setDocs([]);
  };

  return {
    loading,
    error,
    docs,
    addItem,
    getItem,
    removeItem,
    clear,
  };
};
