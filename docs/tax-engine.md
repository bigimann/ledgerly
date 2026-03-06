# Nigerian Personal Income Tax Engine

The Ledgerly tax engine implements progressive Personal Income Tax computation based on Nigerian tax legislation.

## Computation Flow

1. Calculate Net Income

Net Income = Income – Expenses

2. Apply Reliefs

Example:

- Rent Relief

3. Determine Taxable Income

Taxable Income = Net Income – Reliefs

4. Apply Progressive Tax Bands

Example:

| Band | Income Range             | Rate |
| ---- | ------------------------ | ---- |
| 1    | 0 – ₦800,000             | 0%   |
| 2    | ₦800,001 – ₦3,000,000    | 15%  |
| 3    | ₦3,000,001 – ₦12,000,000 | 18%  |

Tax is computed progressively per band.

---

## Example Calculation

Taxable Income: ₦7,000,000

Band 1:
₦800,000 @ 0%

Band 2:
₦2,200,000 @ 15% = ₦330,000

Remaining:
₦4,000,000

Band 3:
₦4,000,000 @ 18% = ₦720,000

Total Tax:
₦1,050,000
