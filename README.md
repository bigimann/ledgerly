# Ledgerly

**Ledgerly** is a Nigerian tax-aware income and expense tracking platform designed to help individuals and small businesses estimate Personal Income Tax (PIT) under the Nigerian 2026 Tax Act.

The platform combines financial tracking with an integrated tax engine that automatically estimates tax obligations using progressive tax bands and statutory reliefs.

---

## Key Features

* 📅 **Calendar-Based Financial Tracking**
  Record daily income and expenses using a structured monthly calendar.

* 💰 **Net Income Computation**
  Automatically calculates net income from recorded financial activities.

* 🧾 **Nigerian Personal Income Tax Engine**
  Implements progressive PIT computation based on current Nigerian tax policy.

* 🏠 **Rent Relief Calculation**
  Applies statutory rent relief (20% capped at ₦500,000).

* 📊 **Monthly & Annual Tax Estimates**
  Provides projections to help users understand future tax obligations.

* 📈 **Year-to-Date Tax Forecasting**
  Predicts annual tax liabilities based on current income trends.

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* TailwindCSS

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Prisma ORM

### Monorepo Management

* pnpm workspaces

---

## Project Structure

ledgerly/
│
├── apps/
│   ├── api/        # Backend API
│   └── web/        # Next.js frontend
│
├── packages/
│   ├── shared/     # Shared constants, utilities, types
│   └── tax-engine/ # Nigerian PIT computation engine
│
├── prisma/         # Database schema & migrations
│
├── docs/           # System documentation
│
└── README.md

---

## Tax Engine Overview

Ledgerly includes a modular **tax engine** designed to compute Nigerian Personal Income Tax progressively.

Steps:

1. Determine **Net Income**
2. Apply **Tax Reliefs**
3. Compute **Taxable Income**
4. Apply **Progressive Tax Bands**
5. Calculate **Total Annual Tax**

The engine also supports:

* Monthly PAYE estimates
* Year-to-date tax projections
* Relief calculations

---

## Installation

Clone the repository:

```bash
git clone https://github.com/bigimann/ledgerly.git
cd ledgerly
```

Install dependencies:

```bash
pnpm install
```

Run development servers:

```bash
pnpm dev
```

---

## Roadmap

* User authentication
* Financial calendar UI
* Automated tax reports
* CSV export for tax filing
* Multi-income source tracking

---

## License

MIT License
