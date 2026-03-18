# Practice Assignment II — After Delete or Update Trigger

## Problem Description

A company wants to maintain **audit history** of data changes.  
Whenever a record in the **Issue table** is **updated or deleted**, the system should:

- Store the **old values**
- Store the **new values**
- Record the **date of change**
- Maintain an **audit log**

The main table will store **only current data**, while the **history table stores previous records**.

---

# 1. Create Main Table

```sql
CREATE TABLE Issues (
    RowId INT PRIMARY KEY,
    SecurityId VARCHAR(50),
    Issuer VARCHAR(100),
    IssuerName VARCHAR(100),
    Issue VARCHAR(100),
    MaturityDate DATE,
    ExpiryDate DATE
);
```

---

# 2. Create Audit / History Table

```sql
CREATE TABLE IssueAuditLog (
    LogID INT IDENTITY(1,1) PRIMARY KEY,

    RowId INT,
    SecurityId VARCHAR(50),

    OldIssuer VARCHAR(100),
    OldIssuerName VARCHAR(100),
    OldIssue VARCHAR(100),
    OldMaturityDate DATE,
    OldExpiryDate DATE,

    NewIssuer VARCHAR(100),
    NewIssuerName VARCHAR(100),
    NewIssue VARCHAR(100),
    NewMaturityDate DATE,
    NewExpiryDate DATE,

    ActionType VARCHAR(20),
    ActionDate DATETIME
);
```

This table stores:

- Old values
- New values
- Action type (UPDATE or DELETE)
- Timestamp

---

# 3. Insert Sample Data

```sql
INSERT INTO Issues VALUES
(1,'SEC101','ABC','ABC Corp','Bond','2030-12-31','2030-12-31'),
(2,'SEC102','XYZ','XYZ Ltd','Bond','2032-05-31','2032-05-31');
```

---

# 4. Create AFTER UPDATE Trigger

```sql
CREATE TRIGGER trg_AfterUpdateIssues
ON Issues
AFTER UPDATE
AS
BEGIN

INSERT INTO IssueAuditLog
(
RowId, SecurityId,
OldIssuer, OldIssuerName, OldIssue, OldMaturityDate, OldExpiryDate,
NewIssuer, NewIssuerName, NewIssue, NewMaturityDate, NewExpiryDate,
ActionType, ActionDate
)

SELECT
d.RowId,
d.SecurityId,

d.Issuer,
d.IssuerName,
d.Issue,
d.MaturityDate,
d.ExpiryDate,

i.Issuer,
i.IssuerName,
i.Issue,
i.MaturityDate,
i.ExpiryDate,

'UPDATE',
GETDATE()

FROM deleted d
JOIN inserted i
ON d.RowId = i.RowId;

END;
```

---

# 5. Create AFTER DELETE Trigger

```sql
CREATE TRIGGER trg_AfterDeleteIssues
ON Issues
AFTER DELETE
AS
BEGIN

INSERT INTO IssueAuditLog
(
RowId, SecurityId,
OldIssuer, OldIssuerName, OldIssue, OldMaturityDate, OldExpiryDate,
ActionType, ActionDate
)

SELECT
RowId,
SecurityId,
Issuer,
IssuerName,
Issue,
MaturityDate,
ExpiryDate,
'DELETE',
GETDATE()

FROM deleted;

END;
```

---

# 6. Test UPDATE Trigger

```sql
UPDATE Issues
SET IssuerName = 'ABC Global'
WHERE RowId = 1;
```

---

# 7. Test DELETE Trigger

```sql
DELETE FROM Issues
WHERE RowId = 2;
```

---

# 8. Verify Audit Log

```sql
SELECT * FROM IssueAuditLog;
```

Example Output:

| LogID | RowId | ActionType | ActionDate |
|------|------|------------|-----------|
|1|1|UPDATE|2026-03-14|
|2|2|DELETE|2026-03-14|

---

# Conclusion

Using **AFTER UPDATE and AFTER DELETE triggers** allows:

- Tracking all changes
- Maintaining audit history
- Ensuring data accountability
- Supporting compliance and debugging