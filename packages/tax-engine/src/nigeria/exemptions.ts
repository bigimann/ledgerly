/**
 * Common tax-exempt income categories in Nigeria
 *
 * Note: This is for informational/educational purposes.
 * Users should consult tax professionals for specific situations.
 */

export const EXEMPT_CATEGORIES = {
  GIFTS: "Gifts and Inheritances",
  COMPENSATION: "Compensation for Loss of Employment",
  GRATUITY: "Gratuity",
  PENSION_WITHDRAWAL: "Pension Lump Sum (conditions apply)",
  RENTAL_INCOME_OWNER_OCCUPIED: "Rental Income (if owner-occupied)",
} as const;

/**
 * Check if an income category is commonly tax-exempt
 *
 * Note: This is simplified for MVP. Real tax rules are complex.
 */
export const isCommonlyExempt = (category: string): boolean => {
  const exemptKeywords = ["gift", "inheritance", "gratuity", "compensation"];

  const lowerCategory = category.toLowerCase();
  return exemptKeywords.some((keyword) => lowerCategory.includes(keyword));
};

/**
 * Get guidance text for tax-exempt income
 */
export const getExemptionGuidance = (): string => {
  return `
    Common tax-exempt income in Nigeria includes:
    • Gifts and inheritances
    • Gratuity payments
    • Certain compensation for loss of employment
    • Pension lump sum withdrawals (under specific conditions)
    
    Note: Tax laws are complex and subject to change. 
    For specific advice, please consult a qualified tax professional.
  `.trim();
};
