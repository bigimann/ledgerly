/**
 * MVP Tax Calculation Assumptions
 *
 * These assumptions simplify tax calculations for the MVP.
 * They make the app safer legally and easier to build.
 */

export const TAX_ASSUMPTIONS = {
  /**
   * We calculate Personal Income Tax (PIT), not PAYE
   * PAYE is employer-specific and more complex
   */
  CALCULATION_TYPE: "Personal Income Tax (PIT) - Estimated",

  /**
   * We use Rent Relief only (2026 Tax Act)
   * CRA has been abolished as of January 1, 2026
   * Other allowances (pension, NHF, NHIS) are not included in MVP
   */
  RELIEFS_INCLUDED: ["Rent Relief (up to ₦500,000)"],

  /**
   * We use new Nigeria PIT tax bands from 2026 Tax Act
   * Effective January 1, 2026
   */
  TAX_YEAR: "2026 (Nigeria Tax Act 2025)",

  /**
   * Key Changes in 2026 Tax Act:
   * - First ₦800,000 is tax-free
   * - Progressive rates: 0%, 15%, 18%, 21%, 23%, 25%
   * - CRA abolished, replaced with Rent Relief
   * - Rent Relief: Lower of 20% of rent or ₦500,000
   */
  KEY_CHANGES: [
    "First ₦800,000 tax-free",
    "Maximum rate increased to 25% (from 24%)",
    "CRA abolished - Rent Relief introduced",
    "Simplified progressive structure",
  ],

  /**
   * Users self-declare tax-exempt income
   * We don't validate or verify exemption claims
   */
  EXEMPTION_VERIFICATION: "User-declared (not verified)",

  /**
   * Calculations are estimates, not official
   */
  DISCLAIMER: `
    This is an estimated tax calculation based on Nigeria Tax Act 2025 
    (effective January 1, 2026). It is for informational purposes only and 
    should not be considered as professional tax advice.
    
    Key assumptions:
    • Based on 2026 PIT rates (0% up to ₦800k, progressive up to 25%)
    • Rent Relief calculated if annual rent provided
    • Does not include employer-specific PAYE deductions
    • Does not include state-specific taxes
    • Excludes pension, NHF, NHIS allowances
    
    Actual tax liability may vary based on individual circumstances, 
    employment status, and other factors.
    
    For accurate tax filing and advice, please consult a qualified tax 
    professional or the Nigeria Revenue Service (NRS).
  `.trim(),
} as const;

/**
 * Get full disclaimer text for display
 */
export const getDisclaimerText = (): string => {
  return TAX_ASSUMPTIONS.DISCLAIMER;
};

/**
 * Get calculation methodology description
 */
export const getMethodologyText = (): string => {
  return `
    Tax Calculation Method (2026 Tax Act):
    • Type: ${TAX_ASSUMPTIONS.CALCULATION_TYPE}
    • Tax Year: ${TAX_ASSUMPTIONS.TAX_YEAR}
    • Reliefs: ${TAX_ASSUMPTIONS.RELIEFS_INCLUDED.join(", ")}
    • Exemptions: ${TAX_ASSUMPTIONS.EXEMPTION_VERIFICATION}
    
    Key Changes in 2026:
    ${TAX_ASSUMPTIONS.KEY_CHANGES.map((change) => `• ${change}`).join("\n    ")}
    
    This calculation uses the new Nigeria Personal Income Tax (PIT) rules 
    from the 2026 Tax Act. It does not include employer-specific PAYE 
    deductions, state taxes, or special allowances beyond Rent Relief.
  `.trim();
};
