"use client";

import { useState, useEffect } from "react";
import { transactionsApi } from "@/lib/api";

export default function HistoryPage() {
  const [deletedTransactions, setDeletedTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeletedTransactions();
  }, []);

  const loadDeletedTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionsApi.getDeleted();
      setDeletedTransactions(response.data);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
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
      month: "long",
      day: "numeric",
    });
  };

  // Group by month
  const groupedByMonth = deletedTransactions.reduce((acc: any, transaction) => {
    const monthKey = new Date(transaction.deletedAt).toLocaleDateString(
      "en-NG",
      {
        year: "numeric",
        month: "long",
      }
    );
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(transaction);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Transaction History
        </h1>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This feature tracks deleted transactions. Once
          a transaction is deleted, it is permanently archived here and grouped
          by month.
        </p>
      </div>

      {Object.keys(groupedByMonth).length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No deleted transactions yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByMonth).map(
            ([month, transactions]: [string, any]) => (
              <div
                key={month}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <h3 className="font-semibold text-gray-900">{month}</h3>
                </div>
                <div className="divide-y">
                  {transactions.map((transaction: any) => (
                    <div key={transaction.id} className="p-4 opacity-75">
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
                                Original Date: {formatDate(transaction.date)} •
                                Deleted: {formatDate(transaction.deletedAt)}
                              </div>
                            </div>
                          </div>
                        </div>
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
