import { ReactNode, useEffect, useState, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTransaction {
  description: string;
  category: string;
  price: number;
  type: "income" | "outcome";
}

interface TransactionsProvidersProps {
  children: ReactNode;
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => void;
  createTransaction: (transaction: CreateTransaction) => void;
}
export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProvidersProps) {
  const [transactions, SetTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get("transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });
    SetTransactions(response.data);
  }, []);

  const createTransaction = useCallback(async (data: CreateTransaction) => {
    const { description, category, price, type } = data;

    const response = await api.post("transactions", {
      description,
      category,
      price,
      type,
      createdAt: new Date(),
    });

    SetTransactions((state) => [response.data, ...state]);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
