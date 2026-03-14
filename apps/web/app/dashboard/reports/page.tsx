"use client";

import { useState, useEffect } from "react";
import { reportsApi } from "@/lib/api";
import { Download, FileText, FileSpreadsheet } from "lucide-react";

export default function ReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [annualReport, setAnnualReport] = useState<any>(null);
  const [taxSummary, setTaxSummary] = useState<any>(null);
  const [ytdSummary, setYtdSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [annualRent, setAnnualRent] = useState("0");
  const [debouncedRent, setDebouncedRent] = useState("0");
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setShowExportMenu(false);
    if (showExportMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showExportMenu]);

  useEffect(() => {
    loadReports();
  }, [year, debouncedRent]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRent(annualRent);
    }, 7000);
    return () => clearTimeout(timer);
  }, [annualRent]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [annualRes, taxRes, ytdRes] = await Promise.all([
        reportsApi.getAnnual(year),
        reportsApi.getTax(year, parseFloat(annualRent) || 0),
        reportsApi.getYTD(),
      ]);

      setAnnualReport(annualRes.data);
      setTaxSummary(taxRes.data);
      setYtdSummary(ytdRes.data);
    } catch (error) {
      console.error("Error loading reports:", error);
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

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading reports...</p>
      </div>
    );
  }

  const exportToCSV = () => {
    if (!annualReport) return;

    const headers = ["Month", "Income", "Expense", "Net"];
    const rows = Object.keys(annualReport.income.byMonth).map((month) => [
      month,
      annualReport.income.byMonth[month] || 0,
      annualReport.expense.byMonth[month] || 0,
      (annualReport.income.byMonth[month] || 0) -
        (annualReport.expense.byMonth[month] || 0),
    ]);

    const csv = [
      headers,
      ...rows,
      [
        "Total",
        annualReport.income.total,
        annualReport.expense.total,
        annualReport.net,
      ],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledgerly-report-${year}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    window.print(); // Opens print dialog, user can save as PDF
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <div className="flex items-center space-x-4">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-2 md:px-4 lg:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    exportToCSV();
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => {
                    exportToPDF();
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export as PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Year Selector */}
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-2 md:px-4 lg:px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {[...Array(5)].map((_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Year-to-Date Summary */}
      {ytdSummary && (
        <div className="bg-linear-to-r from-blue-500 to-blue-400 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Year-to-Date Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm opacity-90">YTD Income</div>
              <div className="text-2xl font-bold">
                {formatCurrency(ytdSummary.ytdIncome)}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-90">YTD Expense</div>
              <div className="text-2xl font-bold">
                {formatCurrency(ytdSummary.ytdExpense)}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-90">Projected Annual Tax</div>
              <div className="text-2xl font-bold">
                {formatCurrency(ytdSummary.projectedAnnualTax)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Annual Summary */}
      {annualReport && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Annual Summary - {year}
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium">
                  Total Income
                </div>
                <div className="text-2xl font-bold text-green-700 mt-2">
                  {formatCurrency(annualReport.income.total)}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm text-red-600 font-medium">
                  Total Expense
                </div>
                <div className="text-2xl font-bold text-red-700 mt-2">
                  {formatCurrency(annualReport.expense.total)}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">
                  Net Amount
                </div>
                <div className="text-2xl font-bold text-blue-700 mt-2">
                  {formatCurrency(annualReport.net)}
                </div>
              </div>
            </div>

            {/* Income by Category */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Income by Category
              </h3>
              <div className="space-y-2">
                {Object.entries(annualReport.income.byCategory).map(
                  ([category, amount]: [string, any]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <span className="text-gray-700">{category}</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Expense by Category */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Expense by Category
              </h3>
              <div className="space-y-2">
                {Object.entries(annualReport.expense.byCategory).map(
                  ([category, amount]: [string, any]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <span className="text-gray-700">{category}</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Summary */}
      {taxSummary && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Tax Summary - {year}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Nigeria Tax Act 2026</p>
          </div>
          <div className="p-6">
            {/* Rent Relief Input */}
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Rent Paid (for Rent Relief calculation)
              </label>
              <input
                type="number"
                value={annualRent}
                onChange={(e) => setAnnualRent(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="0"
              />
              <p className="text-xs text-gray-600 mt-2">
                Rent Relief: Lower of 20% of rent or ₦500,000 cap
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {/* Income Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Total Income</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    {formatCurrency(taxSummary.totalIncome)}
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-sm text-yellow-700">
                    Tax-Exempt Income
                  </div>
                  <div className="text-xl font-bold text-yellow-800 mt-1">
                    - {formatCurrency(taxSummary.taxExemptIncome)}
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-700">Rent Relief Applied</div>
                <div className="text-xl font-bold text-blue-800 mt-1">
                  - {formatCurrency(taxSummary.rentRelief)}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  20% of ₦{parseFloat(annualRent || "0").toLocaleString()}{" "}
                  (capped at ₦500,000)
                </div>
              </div>

              {/* Final Taxable Income */}
              <div className="bg-linear-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
                <div className="text-sm text-green-700 font-medium">
                  Taxable Income
                </div>
                <div className="text-2xl font-bold text-green-900 mt-1">
                  {formatCurrency(taxSummary.taxableIncome)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Total Income - Tax Exempt - Rent Relief
                </div>
              </div>
            </div>

            {/* Tax Calculation */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold text-gray-900">
                  Estimated Tax
                </div>
                <div className="sm:text-2xl md:text-2xl lg:text-3xl font-bold text-blue-700">
                  {formatCurrency(taxSummary.estimatedTax)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Effective Tax Rate</div>
                <div className="text-lg font-semibold text-blue-600">
                  {formatPercent(taxSummary.effectiveRate)}
                </div>
              </div>
            </div>

            {/* Tax Bands Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Tax Bands (2026)
              </h3>
              <div className="space-y-2">
                {taxSummary.bands.map((band: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(band.minAmount)} -{" "}
                        {band.maxAmount === Infinity
                          ? "∞"
                          : formatCurrency(band.maxAmount)}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        @ {formatPercent(band.rate * 100)}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(band.tax)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 whitespace-pre-line">
                {taxSummary.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
