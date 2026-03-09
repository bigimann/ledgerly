"use client";

import { useState, useEffect } from "react";
import { transactionsApi } from "@/lib/api";
import TransactionModal from "@/components/TransactionModal";
import { Trash2, Plus } from "lucide-react";

export default function TransactionsPage() {
  //Group transactions  by month helper function
  const groupByMonth = (transactions: any[]) => {
    const grouped: Record<string, any[]> = {};

    transactions.forEach((transaction) => {
      const monthKey = new Date(transaction.date).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
      });

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(transaction);
    });

    return grouped;
  };

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const filters = filter !== "all" ? { type: filter } : {};
      const response = await transactionsApi.getAll(filters);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await transactionsApi.delete(id);
      loadTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add New</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("INCOME")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "INCOME"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter("EXPENSE")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "EXPENSE"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Transactions List - Grouped by Month */}
      <div className="space-y-6">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No transactions found</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>Add your first transaction</span>
            </button>
          </div>
        ) : (
          <>
            {Object.entries(groupByMonth(transactions)).map(
              ([month, monthTransactions]) => (
                <div
                  key={month}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-3 border-b">
                    <h3 className="font-semibold text-gray-900">{month}</h3>
                    <p className="text-sm text-gray-500">
                      {monthTransactions.length} transactions
                    </p>
                  </div>
                  <div className="divide-y">
                    {monthTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        {/* Keep existing transaction display code */}
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  transaction.type === "INCOME"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {transaction.category}
                                </div>
                                {transaction.description && (
                                  <div className="text-sm text-gray-500">
                                    {transaction.description}
                                  </div>
                                )}
                                <div className="text-xs text-gray-400 mt-1">
                                  {formatDate(transaction.date)}
                                  {transaction.isTaxExempt && (
                                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                                      Tax Exempt
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div
                              className={`text-lg font-semibold ${
                                transaction.type === "INCOME"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "INCOME" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </div>
                            <button
                              onClick={() => deleteTransaction(transaction.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              title="Delete transaction"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadTransactions}
      />
    </div>
  );
}
