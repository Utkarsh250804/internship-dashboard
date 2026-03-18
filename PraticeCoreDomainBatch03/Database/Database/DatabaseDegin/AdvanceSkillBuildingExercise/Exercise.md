# Exercise 1 — Temporal Database Design with Versioning

## 1. Temporal Schema Design (Valid-Time Model)

To maintain historical versions of account balances, we design a **temporal database schema** using valid-time attributes.

### Accounts Table (Versioned State)

| Column | Description |
|------|-------------|
| AccountID | Unique account identifier |
| Balance | Current balance of the account |
| ValidFrom | Date when this balance became valid |
| ValidTo | Date when this balance stops being valid |

**Primary Key:** (AccountID, ValidFrom)

Example:

| AccountID | Balance | ValidFrom | ValidTo |
|----------|--------|-----------|---------|
| A1001 | 5000 | 2025-06-01 | 9999-12-31 |
| A1002 | 7500 | 2025-05-15 | 9999-12-31 |

`9999-12-31` represents the **current active record**.

---

### Transactions Table

| Column | Description |
|------|-------------|
| TransID | Transaction identifier |
| AccountID | Related account |
| Amount | Amount added or deducted |
| TransDate | Date of transaction |

**Primary Key:** TransID  
**Foreign Key:** AccountID → Accounts(AccountID)

Example:

| TransID | AccountID | Amount | TransDate |
|-------|-----------|-------|-----------|
| T001 | A1001 | +2000 | 2025-06-10 |
| T002 | A1001 | -500 | 2025-06-15 |
| T003 | A1002 | -1500 | 2025-06-18 |

---

# 2. Trigger for Automatic Versioning

When a balance changes:
- Close the previous record by updating **ValidTo**
- Insert a new record with updated balance

Example SQL Trigger (Concept):

```sql
CREATE TRIGGER update_account_version
AFTER UPDATE ON Accounts
FOR EACH ROW
BEGIN
    UPDATE Accounts
    SET ValidTo = CURRENT_DATE
    WHERE AccountID = OLD.AccountID
    AND ValidTo = '9999-12-31';

    INSERT INTO Accounts(AccountID, Balance, ValidFrom, ValidTo)
    VALUES(NEW.AccountID, NEW.Balance, CURRENT_DATE, '9999-12-31');
END;
```

This ensures **historical records are preserved**.

---

# 3. Query to Find Balance at a Historical Date

Find balance of **Account A1001 on 2025-06-12**

```sql
SELECT AccountID, Balance
FROM Accounts
WHERE AccountID = 'A1001'
AND '2025-06-12' BETWEEN ValidFrom AND ValidTo;
```

This retrieves the balance valid during that date.

---

# 4. Indexing Strategy for Efficient Historical Queries

To improve performance:

### Index 1: Account Lookup
```sql
CREATE INDEX idx_account_id
ON Accounts(AccountID);
```

### Index 2: Temporal Range Queries
```sql
CREATE INDEX idx_account_validity
ON Accounts(AccountID, ValidFrom, ValidTo);
```

### Index 3: Transaction Lookup
```sql
CREATE INDEX idx_transaction_account
ON Transactions(AccountID);
```

Benefits:
- Faster **point-in-time queries**
- Efficient retrieval of **current state**
- Optimized **historical data search**

---

# Final Schema

### Accounts (Temporal Table)
- AccountID
- Balance
- ValidFrom
- ValidTo
- **Primary Key:** (AccountID, ValidFrom)

### Transactions
- TransID (PK)
- AccountID (FK)
- Amount
- TransDate

---

# Conclusion

This temporal design allows:

- Tracking **complete balance history**
- Supporting **point-in-time queries**
- Maintaining **data integrity**
- Efficiently retrieving both **current and historical account states**