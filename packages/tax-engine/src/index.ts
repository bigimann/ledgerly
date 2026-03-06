// Export main calculator
export { TaxCalculator } from "./calculator";

// Export types and functions

export { calculatePIT, calculateRentRelief } from "./nigeria/pit";
export type { PITCalculation, TaxBandCalculation } from "./nigeria/pit";
export {
  isCommonlyExempt,
  getExemptionGuidance,
  EXEMPT_CATEGORIES,
} from "./nigeria/exemptions";
export {
  getDisclaimerText,
  getMethodologyText,
  TAX_ASSUMPTIONS,
} from "./nigeria/assumptions";
