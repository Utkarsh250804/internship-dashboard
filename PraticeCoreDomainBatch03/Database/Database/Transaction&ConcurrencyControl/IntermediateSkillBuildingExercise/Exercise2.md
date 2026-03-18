
# Exercise 2 — Optimistic Concurrency Control for Inventory

### Problem
Multiple operators update inventory simultaneously.  
Instead of locking records, we use **version numbers** to detect conflicts.

---

# 1. Create Tables

```sql
CREATE TABLE Inventory (
    ProductID INT PRIMARY KEY,
    Stock INT,
    VersionNo INT
);

CREATE TABLE InventoryAudit (
    AuditID INT IDENTITY(1,1),
    ProductID INT,
    ChangeQty INT,
    ChangeDate DATETIME
);
```

---

# 2. Insert Sample Data

```sql
INSERT INTO Inventory VALUES (1001,500,1);
```

---

# 3. Stored Procedure for Safe Stock Update

```sql
CREATE PROCEDURE UpdateInventory
    @ProductID INT,
    @QtyChange INT
AS
BEGIN

DECLARE @CurrentStock INT
DECLARE @Version INT

SELECT 
    @CurrentStock = Stock,
    @Version = VersionNo
FROM Inventory
WHERE ProductID = @ProductID;

UPDATE Inventory
SET Stock = Stock + @QtyChange,
    VersionNo = VersionNo + 1
WHERE ProductID = @ProductID
AND VersionNo = @Version;

IF @@ROWCOUNT = 0
BEGIN
    PRINT 'Version conflict detected. Retry transaction.';
END
ELSE
BEGIN
    INSERT INTO InventoryAudit(ProductID,ChangeQty,ChangeDate)
    VALUES(@ProductID,@QtyChange,GETDATE());

    PRINT 'Stock updated successfully';
END

END;
```

---

# 4. Simulate Concurrent Transactions

### Transaction T1

```sql
EXEC UpdateInventory 1001, -20;
```

### Transaction T2

```sql
EXEC UpdateInventory 1001, -30;
```

If both transactions try updating the same version:

- One succeeds
- The other detects **version conflict**

---

# Final Inventory Example

| ProductID | Stock | VersionNo |
|---------|------|-----------|
|1001|450|3|

---

# Conclusion

Using **Optimistic Concurrency Control**:

- Avoids heavy locking
- Detects conflicts via **version numbers**
- Maintains **audit trail**
- Ensures **data consistency in concurrent environments**