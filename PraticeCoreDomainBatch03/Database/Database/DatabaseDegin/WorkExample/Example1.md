# Worked Example — Slowly Changing Dimension (SCD Type 2)

## Customer Dimension Creation

### Problem Description
A business wants to create a **Customer Dimension Table** in their data warehouse.  
Certain attributes like **customer name, address, email, etc.** should follow **SCD Type 2** so that historical data is preserved.

When any of these attributes change:
- A **new record version** should be created
- The previous record should be **expired**

---

# 1. Dimension Table Design

### Table: DimCustomer

| Column | Description |
|------|-------------|
| CustomerID | Business key identifying the customer |
| SurrogateKey | Auto generated unique key |
| FirstName | Customer first name |
| LastName | Customer last name |
| Email | Customer email |
| Address | Customer address |
| City | Customer city |
| State | Customer state |
| ZipCode | Customer postal code |
| EffectiveStartDate | Record start date |
| EffectiveEndDate | Record end date |
| IsCurrent | Indicates current record (Y/N) |

---

# 2. Business Key

The **business key** for this table is:

**CustomerID**

This uniquely identifies a customer in the source system.

---

# 3. SQL Table Creation

```sql
CREATE TABLE DimCustomer (
    SurrogateKey INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255),
    State VARCHAR(2),
    ZipCode VARCHAR(10),
    EffectiveStartDate DATE,
    EffectiveEndDate DATE,
    IsCurrent CHAR(1)
);
```

---

# 4. Insert Sample Data

```sql
INSERT INTO DimCustomer
(CustomerID, FirstName, LastName, Email, Address, City, State, ZipCode, EffectiveStartDate, EffectiveEndDate, IsCurrent)
VALUES
(101,'John','Smith','john@email.com','12 Park Ave','New York','NY','10001','2025-06-01','9999-12-31','Y'),

(102,'Emily','Clark','emily@email.com','45 Main St','Chicago','IL','60007','2025-06-01','9999-12-31','Y');
```

`9999-12-31` represents the **current active record**.

---

# 5. Handling SCD Type 2 Changes

When a Type-2 attribute changes (for example Address or Email):

### Step 1 — Expire old record

```sql
UPDATE DimCustomer
SET EffectiveEndDate = GETDATE(),
IsCurrent = 'N'
WHERE CustomerID = 101
AND IsCurrent = 'Y';
```

---

### Step 2 — Insert new record version

```sql
INSERT INTO DimCustomer
(CustomerID, FirstName, LastName, Email, Address, City, State, ZipCode, EffectiveStartDate, EffectiveEndDate, IsCurrent)

VALUES
(101,'John','Smith','john@email.com','88 Lake View','New York','NY','10001',GETDATE(),'9999-12-31','Y');
```

---

# 6. Final Table Example (After Change)

| SurrogateKey | CustomerID | Address | StartDate | EndDate | IsCurrent |
|---|---|---|---|---|---|
|1|101|12 Park Ave|2025-06-01|2025-07-01|N|
|3|101|88 Lake View|2025-07-01|9999-12-31|Y|

This keeps **complete historical tracking**.

---

# Conclusion

Using **SCD Type 2** allows:

- Maintaining **full historical data**
- Tracking **attribute changes over time**
- Supporting **time-based analytics**
- Preserving previous versions of records