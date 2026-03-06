# Ledgerly API Documentation

## Base URL

```
/api
```

---

## Transactions

### Create Transaction

POST /transactions

Request:

```
{
  "amount": 500000,
  "type": "income",
  "date": "2026-03-01",
  "category": "salary"
}
```

---

### Get Monthly Transactions

GET /transactions?month=3&year=2026

---

## Tax Endpoints

### Annual Tax Calculation

GET /tax/annual

Response:

```
{
  "taxableIncome": 7000000,
  "totalTax": 1050000,
  "effectiveRate": 14.6
}
```

---

### Year-to-Date Tax Projection

GET /tax/ytd

Returns projected annual tax based on YTD income.
