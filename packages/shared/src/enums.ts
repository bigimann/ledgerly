// TRANSACTION TYPES
export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

// INCOME CATEGORIES
export enum IncomeCategory {
  SALARY = "Salary",
  FREELANCE = "Freelance/Contract",
  BUSINESS = "Business Income",
  INVESTMENT = "Investment Income",
  GIFT = "Gift/Inheritance",
  OTHER = "Other Income",
}

// EXPENSE CATEGORIES
export enum ExpenseCategory {
  FOOD = "Food & Dining",
  TRANSPORT = "Transport",
  RENT = "Rent/Housing",
  UTILITIES = "Utilities",
  PERSONAL = "Personal Care",
  BUSINESS = "Business Expense",
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  ENTERTAINMENT = "Entertainment",
  OTHER = "Other Expense",
}

// HELPER FUNCTIONS

/**
 * Get all income categories as array
 */
export const getIncomeCategories = (): string[] => {
  return Object.values(IncomeCategory);
};

/**
 * Get all expense categories as array
 */
export const getExpenseCategories = (): string[] => {
  return Object.values(ExpenseCategory);
};

/**
 * Check if a category is valid for given transaction type
 */
export const isValidCategory = (
  type: TransactionType,
  category: string
): boolean => {
  if (type === TransactionType.INCOME) {
    return Object.values(IncomeCategory).includes(category as IncomeCategory);
  }
  return Object.values(ExpenseCategory).includes(category as ExpenseCategory);
};

/**
 * Get categories for a transaction type
 */
export const getCategoriesForType = (type: TransactionType): string[] => {
  return type === TransactionType.INCOME
    ? getIncomeCategories()
    : getExpenseCategories();
};
