# Exercise — Savepoints and Partial Rollbacks in Complex Transactions

## Problem
A logistics company processes a shipment update with three steps:

1. Update shipment status
2. Update inventory
3. Record billing

If **inventory update fails**, only **inventory and billing operations** should be rolled back, but **shipment status should remain updated**.

---

# 1. Sample Tables

```sql
CREATE TABLE Shipments (
    ShipmentID INT PRIMARY KEY,
    Status VARCHAR(50)
);

CREATE TABLE Inventory (
    ProductID INT PRIMARY KEY,
    Quantity INT
);

CREATE TABLE Billing (
    BillID INT PRIMARY KEY,
    ShipmentID INT,
    Amount DECIMAL(10,2)
);
```

---

# 2. Transaction with Savepoint

```sql
BEGIN TRANSACTION;

-- Step 1: Update shipment status
UPDATE Shipments
SET Status = 'Shipped'
WHERE ShipmentID = 1001;

-- Create Savepoint after shipment update
SAVEPOINT shipment_updated;

BEGIN TRY

    -- Step 2: Update inventory
    UPDATE Inventory
    SET Quantity = Quantity - 10
    WHERE ProductID = 501;

    -- Step 3: Record billing
    INSERT INTO Billing (BillID, ShipmentID, Amount)
    VALUES (2001,1001,500);

    COMMIT;

END TRY

BEGIN CATCH

    -- Rollback only inventory and billing
    ROLLBACK TO shipment_updated;

    PRINT 'Inventory update failed. Shipment status retained.';

    COMMIT;

END CATCH;
```

---

# 3. Explanation

**BEGIN TRANSACTION**

Starts the transaction.

**SAVEPOINT shipment_updated**

Marks a checkpoint after the shipment status update.

**ROLLBACK TO shipment_updated**

If inventory fails, the system rolls back only the steps after the savepoint.

**COMMIT**

Finalizes the transaction while keeping the shipment update intact.

---

# Example Result

| Step | Result |
|-----|------|
| Shipment Status | Updated |
| Inventory Update | Rolled Back |
| Billing Entry | Rolled Back |

---

# Conclusion

Using **SAVEPOINT** allows:

- Partial rollback in complex transactions
- Preserving important updates
- Better error handling in multi-step processes
- Maintaining data integrity