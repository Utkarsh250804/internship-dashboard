# Exercise — Understanding READ COMMITTED Isolation Level

## Description
This exercise demonstrates how the **READ COMMITTED isolation level** prevents **dirty reads**.  
A transaction can only read **committed data**, not uncommitted changes made by other transactions.

---

# Sample Scenario

Two database connections simulate **concurrent transactions**.

- **Transaction A (Connection 1)** updates a product price.
- **Transaction B (Connection 2)** tries to read the same data before and after the commit.

---

# Step 1 — Connection 1 (Transaction A)

```sql
BEGIN TRANSACTION;

UPDATE Products
SET Price = 60.00
WHERE ProductID = 101;

-- Transaction not committed yet
```

At this stage:
- The price is updated **inside the transaction**
- But the change is **not visible to other transactions yet**

---

# Step 2 — Connection 2 (Transaction B)

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

BEGIN TRANSACTION;

SELECT Price
FROM Products
WHERE ProductID = 101;
```

### Result

```
Price = 50.00
```

Even though Connection 1 updated the value to **60**, Connection 2 still sees **50** because the update is **not committed yet**.

---

# Step 3 — Commit Transaction in Connection 1

```sql
COMMIT;
```

Now the updated price becomes **permanent and visible** to other transactions.

---

# Step 4 — Connection 2 Reads Again

```sql
SELECT Price
FROM Products
WHERE ProductID = 101;
```

### Result

```
Price = 60.00
```

Now Connection 2 can see the updated value.

---

# Key Observation

- **READ COMMITTED isolation level prevents dirty reads**
- Transactions can only see **committed data**
- Uncommitted changes remain **invisible to other transactions**

---

# Summary

| Stage | Connection 1 | Connection 2 Result |
|------|--------------|--------------------|
| Before Commit | Price updated to 60 | Still sees 50 |
| After Commit | Transaction committed | Now sees 60 |

---

# Conclusion

The **READ COMMITTED isolation level** ensures:

- No **dirty reads**
- Data consistency during concurrent transactions
- Transactions only read **committed values**