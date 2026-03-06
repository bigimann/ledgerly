import { NIGERIA_TAX_BANDS } from "@ledgerly/shared";

/**
 * Represents tax calculated within a specific band.
 */
export interface TaxBandCalculation {
  band: number;
  minAmount: number;
  maxAmount: number;
  rate: number;
  taxableAmount: number;
  tax: number;
}

/**
 * Final Personal Income Tax (PIT) computation result.
 */
export interface PITCalculation {
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  bands: TaxBandCalculation[];
}

/**
 * Rounds a number to 2 decimal places safely.
 */
const round = (value: number): number => Math.round(value * 100) / 100;

/**
 * Calculates Personal Income Tax (PIT) using
 * Nigeria's progressive tax bands.
 *
 * IMPORTANT:
 * - `taxableIncome` must already reflect:
 *   income - expenses - reliefs
 * - This function performs tax computation ONLY.
 */
export const calculatePIT = (taxableIncome: number): PITCalculation => {
  const income = Math.max(0, taxableIncome);
  let remainingIncome = income;
  let totalTax = 0;
  const bandBreakdown: TaxBandCalculation[] = [];

  for (const band of NIGERIA_TAX_BANDS) {
    if (remainingIncome <= 0) break;

    const bandWidth =
      band.maxAmount === Infinity
        ? remainingIncome
        : band.maxAmount - band.minAmount;

    const taxableInBand = Math.min(remainingIncome, bandWidth);
    const bandTax = taxableInBand * band.rate;

    bandBreakdown.push({
      band: band.band,
      minAmount: band.minAmount,
      maxAmount: band.maxAmount,
      rate: band.rate,
      taxableAmount: round(taxableInBand),
      tax: round(bandTax),
    });

    totalTax += bandTax;
    remainingIncome -= taxableInBand;
  }

  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    taxableIncome: round(income),
    totalTax: round(totalTax),
    effectiveRate: round(effectiveRate),
    bands: bandBreakdown,
  };
};

export const calculateMonthlyTax = (
  monthlyIncome: number,
  monthlyRent: number = 0,
): number => {
  const annualIncome = monthlyIncome * 12;
  const annualRent = monthlyRent * 12;

  const rentRelief = calculateRentRelief(annualRent);

  const taxableIncome = Math.max(0, annualIncome - rentRelief);

  const result = calculatePIT(taxableIncome);

  return round(result.totalTax / 12);
};

export const estimateAnnualTax = (
  ytdIncome: number,
  currentMonth: number,
  ytdRentPaid: number = 0,
): PITCalculation => {
  if (currentMonth < 1 || currentMonth > 12) {
    throw new Error("currentMonth must be between 1 and 12");
  }

  const avgMonthlyIncome = ytdIncome / currentMonth;
  const projectedAnnualIncome = avgMonthlyIncome * 12;

  const avgMonthlyRent = ytdRentPaid / currentMonth;
  const projectedAnnualRent = avgMonthlyRent * 12;

  const rentRelief = calculateRentRelief(projectedAnnualRent);

  const taxableIncome = Math.max(0, projectedAnnualIncome - rentRelief);

  return calculatePIT(taxableIncome);
};

/**
 * Calculate Rent Relief (2026 Tax Act)
 * Rent Relief is the lower of:
 * - 20% of annual rent paid
 * - ₦500,000 cap
 */
export const calculateRentRelief = (annualRentPaid: number): number => {
  const RENT_RELIEF_PERCENTAGE = 0.2;
  const RENT_RELIEF_CAP = 500000;
  const calculatedRelief = annualRentPaid * RENT_RELIEF_PERCENTAGE;
  return Math.min(calculatedRelief, RENT_RELIEF_CAP);
};
