# Ledgerly System Architecture

Ledgerly follows a modular monorepo architecture to separate financial logic, tax computation, and application services.

## High Level Architecture

User → Frontend (Next.js) → API (Express) → Database (PostgreSQL)

### Frontend

Responsible for:

- Calendar UI
- Financial input
- Tax dashboard

### Backend

Handles:

- Authentication
- Financial records
- Tax computation

### Tax Engine

Encapsulates all tax logic including:

- Taxable income calculation
- Progressive band computation
- Relief deductions
- Tax projections

### Shared Package

Contains:

- Constants
- Tax bands
- Currency settings
- Validation limits

---

## Design Principles

Ledgerly was designed around the following principles:

- Separation of financial and tax logic
- Modular tax computation engine
- Scalable monorepo architecture
- Clear domain boundaries
