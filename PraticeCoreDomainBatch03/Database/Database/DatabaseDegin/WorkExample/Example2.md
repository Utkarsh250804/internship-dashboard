# Worked Example II — Partition Design for Efficient Load

## Problem Description

A business receives **millions of sales records daily** from different feeds.  
The **Sales table must store at least 2 years of data**, and the continuous growth of the table is slowing down daily data processing.

To improve performance, the database team decides to implement:

- **Table Partitioning**
- **Partition Exchange using a staging table**

This allows **fast loading and efficient data management** without affecting the entire table.

---

# 1. Selecting the Partition Key

Analysis shows that:

- All business queries are based on **SalesDate**
- Data is loaded **daily**

Therefore the ideal partition key is:

**SalesDate**

Partition strategy:
- **Range Partition**
- Partition data **daily or monthly**

---

# 2. Create Partition Function

The partition function defines how the data will be divided.

```sql
CREATE PARTITION FUNCTION SalesDatePartitionFunction (DATE)
AS RANGE RIGHT FOR VALUES
(
'2025-01-01',
'2025-02-01',
'2025-03-01',
'2025-04-01'
);
```

---

# 3. Create Partition Scheme

The partition scheme maps partitions to filegroups.

```sql
CREATE PARTITION SCHEME SalesDatePartitionScheme
AS PARTITION SalesDatePartitionFunction
ALL TO ([PRIMARY]);
```

---

# 4. Create Partitioned Fact Table

```sql
CREATE TABLE FactSalesPartitioned
(
    SaleID INT IDENTITY(1,1),
    SalesDate DATE,
    ProductID INT,
    CustomerID INT,
    Quantity INT,
    Amount DECIMAL(12,2)
)
ON SalesDatePartitionScheme (SalesDate);
```

This table stores **large historical sales data** partitioned by **SalesDate**.

---

# 5. Create Staging Table

The staging table has the **same schema as the partitioned table**.

```sql
CREATE TABLE FactSalesStaging
(
    SaleID INT,
    SalesDate DATE,
    ProductID INT,
    CustomerID INT,
    Quantity INT,
    Amount DECIMAL(12,2)
);
```

Purpose of staging table:

- Load new data
- Apply transformations
- Perform validation before moving data to the main table

---

# 6. Load Data into Partitioned Table

```sql
INSERT INTO FactSalesPartitioned
(SalesDate, ProductID, CustomerID, Quantity, Amount)
VALUES
('2025-02-10',101,1001,2,200),
('2025-02-12',102,1002,1,150);
```

---

# 7. Populate the Staging Table

```sql
INSERT INTO FactSalesStaging
(SaleID, SalesDate, ProductID, CustomerID, Quantity, Amount)
VALUES
(3,'2025-02-15',103,1003,3,300);
```

---

# 8. Partition Exchange Process

Partition exchange moves data **quickly without copying rows**.

```sql
ALTER TABLE FactSalesStaging
SWITCH TO FactSalesPartitioned PARTITION 2;
```

This swaps the staging table data into the specified partition.

---

# 9. Error Handling with TRY–CATCH

```sql
BEGIN TRY
BEGIN TRANSACTION

ALTER TABLE FactSalesStaging
SWITCH TO FactSalesPartitioned PARTITION 2;

COMMIT TRANSACTION

END TRY
BEGIN CATCH

ROLLBACK TRANSACTION
THROW;

END CATCH
```

This ensures **data consistency if an error occurs**.

---

# 10. Benefits of Partition Exchange

- Faster **data loading**
- Improved **query performance**
- Efficient **data maintenance**
- Easier **archiving of old data**
- Minimal locking on the main table

---

# Conclusion

By using **table partitioning with SalesDate as the partition key** and performing data loads through a **staging table with partition exchange**, the system can efficiently process millions of daily records without slowing down the entire sales table.