"use client";

import { useState, useEffect } from "react";
import { transactionsApi } from "@/lib/api";
import TransactionModal from "@/components/TransactionModal";

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State for selected day modal
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);
  const [prefilledDate, setPrefilledDate] = useState<string>("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    loadCalendarData();
  }, [year, month]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const [calendarRes, summaryRes] = await Promise.all([
        transactionsApi.getCalendar(year, month),
        transactionsApi.getMonthlySummary(year, month),
      ]);

      setCalendarData(calendarRes.data);
      setMonthlySummary(summaryRes.data);
    } catch (error) {
      console.error("Error loading calendar:", error);
    } finally {
      setLoading(false);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Generate calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get data for a specific day
  const getDayData = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    return calendarData.find((d) => d.date === dateStr);
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    const dayData = getDayData(day);
    const clickedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (dayData && dayData.transactions.length > 0) {
      // Has transactions - show modal with transactions
      setSelectedDay(day);
      setSelectedDayData(dayData);
    } else {
      // No transactions - open add transaction modal with prefilled date
      setPrefilledDate(clickedDate);
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your calendar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <button
          onClick={today}
          className="px-4 py-2 text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          Today
        </button>
      </div>

      {/* Monthly Summary Cards */}
      {monthlySummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total Income</div>
            <div className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(monthlySummary.totalIncome)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total Expense</div>
            <div className="mt-2 text-2xl font-bold text-red-600">
              {formatCurrency(monthlySummary.totalExpense)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Net Amount</div>
            <div
              className={`mt-2 text-2xl font-bold ${
                monthlySummary.netAmount >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              {formatCurrency(monthlySummary.netAmount)}
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900 font-bold"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900 font-bold"
          >
            →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayData = getDayData(day);
              const hasTransactions =
                dayData && dayData.transactions.length > 0;
              const isToday =
                new Date().toDateString() ===
                new Date(year, month - 1, day).toDateString();

              // Check if date is in the future
              const dayDate = new Date(year, month - 1, day);
              const currentDate = new Date();
              currentDate.setHours(0, 0, 0, 0);
              dayDate.setHours(0, 0, 0, 0);
              const isFuture = dayDate > currentDate;

              return (
                <div
                  key={day}
                  onClick={() => !isFuture && handleDayClick(day)}
                  className={`aspect-square border rounded-lg p-2 transition-all ${
                    isFuture
                      ? "bg-gray-100 cursor-not-allowed opacity-50"
                      : hasTransactions
                        ? "hover:bg-gray-50 cursor-pointer hover:shadow-md"
                        : "hover:bg-gray-50 cursor-pointer"
                  } ${
                    isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  } ${selectedDay === day ? "ring-2 ring-blue-500" : ""}`}
                >
                  <div className="text-sm font-medium text-gray-900">{day}</div>
                  {dayData && !isFuture && (
                    <div className="mt-1 space-y-1">
                      {dayData.incomeTotal > 0 && (
                        <div className="text-xs text-green-600 truncate">
                          +{formatCurrency(dayData.incomeTotal)}
                        </div>
                      )}
                      {dayData.expenseTotal > 0 && (
                        <div className="text-xs text-red-600 truncate">
                          -{formatCurrency(dayData.expenseTotal)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State - Shows when no transactions for the entire month */}
          {calendarData.length === 0 && (
            <div className="col-span-7 text-center py-12 mt-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">
                No transactions for this month
              </p>
              <p className="text-sm text-gray-400">
                Add your first transaction to start tracking
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedDayData && selectedDay && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Transactions - {monthName.split(" ")[0]} {selectedDay}, {year}
              </h2>
              <button
                onClick={() => {
                  setSelectedDay(null);
                  setSelectedDayData(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600 font-medium">
                    Income
                  </div>
                  <div className="text-sm md:text-xl lg:text-xl font-bold text-green-700 mt-1">
                    {formatCurrency(selectedDayData.incomeTotal)}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-sm text-red-600 font-medium">
                    Expenses
                  </div>
                  <div className="text-sm md:text-xl lg:text-xl font-bold text-red-700 mt-1">
                    {formatCurrency(selectedDayData.expenseTotal)}
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-3">
                {selectedDayData.transactions.length} Transaction
                {selectedDayData.transactions.length !== 1 ? "s" : ""}
              </h3>

              <div className="space-y-3">
                {selectedDayData.transactions.map((transaction: any) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            transaction.type === "INCOME"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div className="font-medium text-gray-900">
                          {transaction.category}
                        </div>
                      </div>
                      {transaction.description && (
                        <div className="text-sm text-gray-500 mt-1 ml-4">
                          {transaction.description}
                        </div>
                      )}
                      {transaction.isTaxExempt && (
                        <span className="ml-4 mt-1 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Tax Exempt
                        </span>
                      )}
                    </div>
                    <div
                      className={`font-semibold text-sm md:text-xl lg:text-xl text-nowrap ${
                        transaction.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setPrefilledDate("");
        }}
        onSuccess={() => {
          loadCalendarData();
          setPrefilledDate("");
        }}
        prefilledDate={prefilledDate}
      />
    </div>
  );
}
