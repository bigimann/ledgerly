import {
  calculatePIT,
  calculateMonthlyTax,
  estimateAnnualTax,
  PITCalculation,
  calculateRentRelief,
} from "./nigeria/pit";
import { isCommonlyExempt, getExemptionGuidance } from "./nigeria/exemptions";
import { getDisclaimerText, getMethodologyText } from "./nigeria/assumptions";

/**
 * Main Tax Calculator
 * Currently supports Nigeria only
 */
export class TaxCalculator {
  private country: string;

  constructor(country: "nigeria" = "nigeria") {
    this.country = country;
  }

  /**
   * Calculate annual tax
   */
  calculateAnnual(
    grossIncome: number,
    taxExemptIncome: number = 0,
    annualRentPaid: number = 0,
  ): PITCalculation {
    if (this.country !== "nigeria") {
      throw new Error(
        `Tax calculation for ${this.country} is not yet supported`,
      );
    }

    const taxableIncome = Math.max(
      0,
      grossIncome - taxExemptIncome - calculateRentRelief(annualRentPaid),
    );

    return calculatePIT(taxableIncome);
  }

  /**
   * Calculate estimated monthly tax
   */
  calculateMonthly(monthlyIncome: number, monthlyRent: number = 0): number {
    if (this.country !== "nigeria") {
      throw new Error(
        `Tax calculation for ${this.country} is not yet supported`,
      );
    }

    return calculateMonthlyTax(monthlyIncome, monthlyRent);
  }

  /**
   * Estimate full year tax from year-to-date income
   */
  estimateFromYTD(
    ytdIncome: number,
    currentMonth: number,
    ytdRentPaid: number = 0,
  ): PITCalculation {
    if (this.country !== "nigeria") {
      throw new Error(
        `Tax calculation for ${this.country} is not yet supported`,
      );
    }

    return estimateAnnualTax(ytdIncome, currentMonth, ytdRentPaid);
  }

  /**
   * Check if a category is commonly tax-exempt
   */
  isExemptCategory(category: string): boolean {
    return isCommonlyExempt(category);
  }

  /**
   * Get tax disclaimer text
   */
  getDisclaimer(): string {
    return getDisclaimerText();
  }

  /**
   * Get tax calculation methodology
   */
  getMethodology(): string {
    return getMethodologyText();
  }

  /**
   * Get exemption guidance
   */
  getExemptionGuidance(): string {
    return getExemptionGuidance();
  }
}

// Export for direct use
export {
  calculatePIT,
  calculateMonthlyTax,
  estimateAnnualTax,
} from "./nigeria/pit";
export { isCommonlyExempt, getExemptionGuidance } from "./nigeria/exemptions";
export { getDisclaimerText, getMethodologyText } from "./nigeria/assumptions";
export type { PITCalculation, TaxBandCalculation } from "./nigeria/pit";
