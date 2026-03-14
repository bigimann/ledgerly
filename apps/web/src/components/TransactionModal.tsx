"use client";

import { useState, useEffect } from "react";
import { transactionsApi } from "@/lib/api";
import { HelpCircle } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prefilledDate?: string;
}

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Contract",
  "Business",
  "Investment",
  "Gift",
  "Inheritance",
  "Other Income",
];

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Rent/Housing",
  "Utilities",
  "Personal Care",
  "Business",
  "Healthcare",
  "Education",
  "Entertainment",
  "Other Expense",
];

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  prefilledDate,
}: TransactionModalProps) {
  const [formData, setFormData] = useState({
    type: "INCOME",
    amount: "",
    date: prefilledDate || new Date().toISOString().split("T")[0],
    category: "",
    description: "",
    isTaxExempt: false,
    isRecurring: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTaxInfo, setShowTaxInfo] = useState(false);

  // Update date when prefilledDate changes
  useEffect(() => {
    if (prefilledDate) {
      setFormData((prev) => ({ ...prev, date: prefilledDate }));
    }
  }, [prefilledDate]);

  if (!isOpen) return null;

  const categories =
    formData.type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Get today's date in YYYY-MM-DD format for max attribute
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const selectedDate = new Date(formData.date);

    if (isNaN(selectedDate.getTime())) {
      setError("Please enter a valid date");
      return;
    }

    selectedDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate > currentDate) {
      setError("Cannot add transactions for future dates");
      return;
    }

    setLoading(true);

    try {
      await transactionsApi.create({
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        description: formData.description || undefined,
        isTaxExempt: formData.isTaxExempt,
        isRecurring: formData.isRecurring,
      });

      // Reset form
      setFormData({
        type: "INCOME",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        description: "",
        isTaxExempt: false,
        isRecurring: false,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      type,
      category: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("INCOME")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.type === "INCOME"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("EXPENSE")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.type === "EXPENSE"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (₦)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              required
              max={today}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Cannot select future dates
            </p>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a note..."
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            {/* Tax Exempt */}
            <div>
              <label className="flex items-center group relative">
                <input
                  type="checkbox"
                  checked={formData.isTaxExempt}
                  onChange={(e) =>
                    setFormData({ ...formData, isTaxExempt: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Tax Exempt</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTaxInfo(!showTaxInfo);
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  title="Tax Exempt Information"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </label>

              {/* Tax Info Popup */}
              {showTaxInfo && (
                <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Tax-Exempt Income (Nigeria)
                  </h4>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Gifts and inheritances</li>
                    <li>• Gratuity payments</li>
                    <li>• Certain compensation for loss of employment</li>
                    <li>• Pension lump sum withdrawals (conditions apply)</li>
                    <li>• Interest on savings (up to certain limits)</li>
                  </ul>
                  <p className="mt-3 text-xs text-blue-700">
                    Note: Tax laws are complex. For specific advice, consult a
                    qualified tax professional.
                  </p>
                </div>
              )}
            </div>

            {/* Recurring */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Recurring transaction
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
