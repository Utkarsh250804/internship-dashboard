# Practice Assignment II — Snowflake Schema Design

## Problem Description

A company wants to design a **data mart** for pricing transaction data using a **Snowflake Schema**.

In a snowflake schema:

- A **Fact Table** stores transaction data.
- **Dimension tables** store descriptive attributes.
- Some dimension tables are **normalized into sub-dimension tables**.
- Sub-dimension tables connect to the related dimension tables.

This structure helps store **granular and normalized data**.

---

# 1. Fact Table Design

### Table: FactPricing

| Column | Description |
|------|-------------|
| RowId | Surrogate primary key |
| VendorId | Foreign key referencing Vendor |
| FeedId | Foreign key referencing Feed |
| SourceFeedId | Foreign key referencing Source Feed |
| DateId | Foreign key referencing Date |
| ExchangeId | Foreign key referencing Exchange |
| PriceTypeId | Foreign key referencing Price Type |
| SecurityId | Foreign key referencing Security |
| IssueId | Foreign key referencing Issue |
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

- Surrogate Key
- Business Attributes
- Default rows for **UNKNOWN** and **NULL**

---

## Feed Dimension

```sql
CREATE TABLE DimFeed (
    FeedKey INT IDENTITY(1,1) PRIMARY KEY,
    FeedName VARCHAR(255)
);
```

Example Default Records

| FeedKey | FeedName |
|---|---|
| -1 | UNKNOWN |
| 0 | NULL |

---

## Date Dimension

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

## Exchange Dimension

```sql
CREATE TABLE DimExchange (
    ExchangeKey INT IDENTITY(1,1) PRIMARY KEY,
    ExchangeName VARCHAR(255)
);
```

---

## Price Type Dimension

```sql
CREATE TABLE DimPriceType (
    PriceTypeKey INT IDENTITY(1,1) PRIMARY KEY,
    PriceTypeName VARCHAR(255)
);
```

---

## Security Dimension

```sql
CREATE TABLE DimSecurity (
    SecurityKey INT IDENTITY(1,1) PRIMARY KEY,
    SecurityName VARCHAR(255)
);
```

---

# 3. Sub-Dimension Tables (Snowflake Structure)

These tables normalize the dimensions.

---

## Source Feed (Related to Feed)

```sql
CREATE TABLE DimSourceFeed (
    SourceFeedKey INT IDENTITY(1,1) PRIMARY KEY,
    FeedKey INT,
    SourceFeedName VARCHAR(255),
    FOREIGN KEY (FeedKey) REFERENCES DimFeed(FeedKey)
);
```

---

## Vendor (Related to SourceFeed)

```sql
CREATE TABLE DimVendor (
    VendorKey INT IDENTITY(1,1) PRIMARY KEY,
    SourceFeedKey INT,
    VendorName VARCHAR(255),
    FOREIGN KEY (SourceFeedKey) REFERENCES DimSourceFeed(SourceFeedKey)
);
```

---

## Issue (Related to Security)

```sql
CREATE TABLE DimIssue (
    IssueKey INT IDENTITY(1,1) PRIMARY KEY,
    SecurityKey INT,
    IssueDescription VARCHAR(255),
    FOREIGN KEY (SecurityKey) REFERENCES DimSecurity(SecurityKey)
);
```

---

# 4. Fact Table Foreign Key Relationships

```sql
ALTER TABLE FactPricing
ADD CONSTRAINT FK_Feed
FOREIGN KEY (FeedId)
REFERENCES DimFeed(FeedKey);

ALTER TABLE FactPricing
ADD CONSTRAINT FK_Date
FOREIGN KEY (DateId)
REFERENCES DimDate(DateKey);

ALTER TABLE FactPricing
ADD CONSTRAINT FK_Exchange
FOREIGN KEY (ExchangeId)
REFERENCES DimExchange(ExchangeKey);

ALTER TABLE FactPricing
ADD CONSTRAINT FK_PriceType
FOREIGN KEY (PriceTypeId)
REFERENCES DimPriceType(PriceTypeKey);

ALTER TABLE FactPricing
ADD CONSTRAINT FK_Security
FOREIGN KEY (SecurityId)
REFERENCES DimSecurity(SecurityKey);
```

---

# 5. Handling UNKNOWN and NULL Keys

Rules:

- If **logical key exists but no dimension record exists**, assign **UNKNOWN (-1)**.
- If **logical key is missing**, assign **NULL (0)**.

This maintains **referential integrity** in the fact table.

---

# 6. Snowflake Schema Structure

```

DimVendor
↓
DimSourceFeed
↓
DimFeed

DimIssue
↓
DimSecurity

DimDate
DimExchange
DimPriceType

↓

FactPricing

```

Unlike star schema, dimension tables are **normalized into multiple related tables**.

---

# Conclusion

The **Snowflake Schema** provides:

- Better **data normalization**
- Reduced **data redundancy**
- Detailed **granular data storage**
- Efficient **data management for large data marts**