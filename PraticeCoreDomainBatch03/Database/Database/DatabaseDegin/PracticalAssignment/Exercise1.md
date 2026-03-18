# Practice Assignment I — Star Schema Design

## Problem Description

A company wants to design a **data mart** to store pricing transaction data.  
The database should follow a **Star Schema** structure so that analytical queries and cube-based reporting can be executed efficiently.

In a star schema:
- A **Fact Table** stores measurable transaction data.
- Multiple **Dimension Tables** provide descriptive attributes.
- Dimension tables connect **directly to the fact table**.

---

# 1. Fact Table Design

### Table: FactPricing

| Column | Description |
|------|-------------|
| RowId | Surrogate primary key |
| VendorId | Foreign key referencing Vendor dimension |
| FeedId | Foreign key referencing Feed dimension |
| SourceFeedId | Foreign key referencing Source Feed dimension |
| DateId | Foreign key referencing Date dimension |
| ExchangeId | Foreign key referencing Exchange dimension |
| PriceTypeId | Foreign key referencing Price Type dimension |
| SecurityId | Foreign key referencing Security dimension |
| IssueId | Foreign key referencing Issue dimension |
| Price | Pricing transaction value |

---

# SQL — Create Fact Table

```sql
CREATE TABLE FactPricing (
    RowId INT IDENTITY(1,1) PRIMARY KEY,
    VendorId INT,
    FeedId INT,
    SourceFeedId INT,
    DateId INT,
    ExchangeId INT,
    PriceTypeId INT,
    SecurityId INT,
    IssueId INT,
    Price DECIMAL(18,4)
);
```

---

# 2. Dimension Tables

Each dimension table contains:

- **SurrogateKey (Primary Key)**
- **Business attributes**
- Two default records:
  - **UNKNOWN**
  - **NULL**

---

# Vendor Dimension

```sql
CREATE TABLE DimVendor (
    VendorKey INT IDENTITY(1,1) PRIMARY KEY,
    VendorName VARCHAR(255)
);
```

Example Default Rows

| VendorKey | VendorName |
|---|---|
| -1 | UNKNOWN |
| 0 | NULL |

---

# Feed Dimension

```sql
CREATE TABLE DimFeed (
    FeedKey INT IDENTITY(1,1) PRIMARY KEY,
    FeedName VARCHAR(255)
);
```

---

# Source Feed Dimension

```sql
CREATE TABLE DimSourceFeed (
    SourceFeedKey INT IDENTITY(1,1) PRIMARY KEY,
    SourceFeedName VARCHAR(255)
);
```

---

# Date Dimension

```sql
CREATE TABLE DimDate (
    DateKey INT PRIMARY KEY,
    FullDate DATE,
    Year INT,
    Month INT,
    Day INT
);
```

---

# Exchange Dimension

```sql
CREATE TABLE DimExchange (
    ExchangeKey INT IDENTITY(1,1) PRIMARY KEY,
    ExchangeName VARCHAR(255)
);
```

---

# Price Type Dimension

```sql
CREATE TABLE DimPriceType (
    PriceTypeKey INT IDENTITY(1,1) PRIMARY KEY,
    PriceTypeName VARCHAR(255)
);
```

---

# Security Dimension

```sql
CREATE TABLE DimSecurity (
    SecurityKey INT IDENTITY(1,1) PRIMARY KEY,
    SecurityName VARCHAR(255)
);
```

---

# Issue Dimension

```sql
CREATE TABLE DimIssue (
    IssueKey INT IDENTITY(1,1) PRIMARY KEY,
    IssueDescription VARCHAR(255)
);
```

---

# 3. Foreign Key Relationships

Fact table contains **surrogate keys of dimension tables**.

Example constraints:

```sql
ALTER TABLE FactPricing
ADD CONSTRAINT FK_Vendor
FOREIGN KEY (VendorId)
REFERENCES DimVendor(VendorKey);

ALTER TABLE FactPricing
ADD CONSTRAINT FK_Feed
FOREIGN KEY (FeedId)
REFERENCES DimFeed(FeedKey);

ALTER TABLE FactPricing
ADD CONSTRAINT FK_SourceFeed
FOREIGN KEY (SourceFeedId)
REFERENCES DimSourceFeed(SourceFeedKey);
```

(Similar constraints can be created for all other dimension tables.)

---

# 4. Handling UNKNOWN and NULL Values

Rules:

- If a **logical key exists but no matching dimension record exists**, assign the **UNKNOWN key (-1)**.
- If the **logical key itself is missing**, assign the **NULL key (0)**.

This ensures **referential integrity in the fact table**.

---

# 5. Star Schema Structure

```

DimVendor
DimFeed
DimSourceFeed
DimDate
DimExchange
DimPriceType
DimSecurity
DimIssue

↓

FactPricing

```

All dimension tables connect **directly to the FactPricing table**, forming a **Star Schema**.

---

# Conclusion

The star schema design provides:

- Fast **analytical queries**
- Simplified **OLAP cube reporting**
- Easy **data aggregation**
- Clear **fact–dimension relationships**

This structure is widely used in **data warehouses and data marts**.