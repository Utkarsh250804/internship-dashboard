# Practice Assignment I — Before Delete Trigger

## Problem Description

The DBA noticed that some records are getting deleted from a table without proper tracking.  
To prevent this, a **BEFORE DELETE trigger** should:

1. Log who attempted the delete
2. Record which rows are affected
3. Prevent actual deletion
4. Optionally perform a **soft delete**

---

# 1. Create Main Table

```sql
CREATE TABLE Securities (
    RowId INT PRIMARY KEY,
    SecurityId VARCHAR(50),
    Issuer VARCHAR(100),
    IssuerName VARCHAR(100),
    Issue VARCHAR(100),
    MaturityDate DATE,
    ExpiryDate DATE,
    DeletedFlag BIT DEFAULT 0
);
```

---

# 2. Create Log Table

```sql
CREATE TABLE DeleteLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    RowId INT,
    SecurityId VARCHAR(50),
    DeletedBy VARCHAR(100),
    DeletedDate DATETIME
);
```

This table stores information about:

- Which row was attempted to delete
- Who tried to delete it
- When it happened

---

# 3. Insert Sample Data

```sql
INSERT INTO Securities
VALUES
(1,'SEC101','ABC','ABC Corp','Bond','2030-12-31','2030-12-31',0),
(2,'SEC102','XYZ','XYZ Ltd','Bond','2032-05-31','2032-05-31',0);
```

---

# 4. Create BEFORE DELETE Trigger

```sql
CREATE TRIGGER trg_BeforeDeleteSecurity
ON Securities
INSTEAD OF DELETE
AS
BEGIN

    -- Insert log record
    INSERT INTO DeleteLogs (RowId, SecurityId, DeletedBy, DeletedDate)
    SELECT 
        RowId,
        SecurityId,
        SYSTEM_USER,
        GETDATE()
    FROM deleted;

    -- Soft delete instead of actual delete
    UPDATE Securities
    SET DeletedFlag = 1
    WHERE RowId IN (SELECT RowId FROM deleted);

END;
```

---

# 5. Test the Trigger

Attempt to delete a record:

```sql
DELETE FROM Securities
WHERE RowId = 1;
```

---

# 6. Check Results

### Securities Table

```sql
SELECT * FROM Securities;
```

| RowId | SecurityId | DeletedFlag |
|------|------------|------------|
|1|SEC101|1|
|2|SEC102|0|

Record is **not physically deleted**, only marked as deleted.

---

### Delete Logs

```sql
SELECT * FROM DeleteLogs;
```

| LogID | RowId | SecurityId | DeletedBy | DeletedDate |
|------|------|------------|-----------|------------|
|1|1|SEC101|Admin|2026-03-14|

---

# Conclusion

Using a **BEFORE DELETE trigger** provides:

- Delete activity tracking
- Data protection
- Soft delete implementation
- Improved auditability