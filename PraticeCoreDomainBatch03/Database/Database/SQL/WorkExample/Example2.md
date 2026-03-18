# Worked Example II — Price Deviation Reporting

## 1. Create Table

```sql
CREATE TABLE MarketPrices (
    SecurityId VARCHAR(20),
    VendorName VARCHAR(50),
    PriceDate DATE,
    Price DECIMAL(10,2)
);
```

---

# 2. Insert Sample Data

```sql
INSERT INTO MarketPrices VALUES
('SEC101','VendorA','2023-01-01',100),
('SEC101','VendorB','2023-01-01',102),
('SEC101','VendorC','2023-01-01',98),

('SEC101','VendorA','2023-01-02',105),
('SEC101','VendorB','2023-01-02',103),
('SEC101','VendorC','2023-01-02',110),

('SEC102','VendorA','2023-01-01',200),
('SEC102','VendorB','2023-01-01',198),
('SEC102','VendorC','2023-01-01',205);
```

Each **SecurityId + PriceDate** combination has prices from **multiple vendors**.

---

# 3. Calculate Mean Price

```sql
SELECT 
    SecurityId,
    PriceDate,
    VendorName,
    Price,
    AVG(Price) OVER (PARTITION BY SecurityId, PriceDate) AS MeanPrice
FROM MarketPrices;
```

---

# 4. Calculate Median Price

```sql
SELECT 
    SecurityId,
    PriceDate,
    VendorName,
    Price,
    PERCENTILE_CONT(0.5) 
    WITHIN GROUP (ORDER BY Price)
    OVER (PARTITION BY SecurityId, PriceDate) AS MedianPrice
FROM MarketPrices;
```

---

# 5. Max, Min and Vendor Count

```sql
SELECT 
    SecurityId,
    PriceDate,
    VendorName,
    Price,
    MAX(Price) OVER (PARTITION BY SecurityId, PriceDate) AS MaxPrice,
    MIN(Price) OVER (PARTITION BY SecurityId, PriceDate) AS MinPrice,
    COUNT(*) OVER (PARTITION BY SecurityId, PriceDate) AS VendorCount
FROM MarketPrices;
```

---

# 6. Calculate Price Variance from Median

```sql
SELECT 
    SecurityId,
    PriceDate,
    VendorName,
    Price,
    PERCENTILE_CONT(0.5) 
    WITHIN GROUP (ORDER BY Price)
    OVER (PARTITION BY SecurityId, PriceDate) AS MedianPrice,
    
    ABS(
        Price -
        PERCENTILE_CONT(0.5) 
        WITHIN GROUP (ORDER BY Price)
        OVER (PARTITION BY SecurityId, PriceDate)
    ) AS PriceDeviation
FROM MarketPrices;
```

---

# 7. Identify Closest Vendor to Median

```sql
SELECT *
FROM (
    SELECT 
        SecurityId,
        PriceDate,
        VendorName,
        Price,
        ABS(
            Price -
            PERCENTILE_CONT(0.5)
            WITHIN GROUP (ORDER BY Price)
            OVER (PARTITION BY SecurityId, PriceDate)
        ) AS Deviation,
        
        RANK() OVER (
            PARTITION BY SecurityId, PriceDate
            ORDER BY ABS(
                Price -
                PERCENTILE_CONT(0.5)
                WITHIN GROUP (ORDER BY Price)
                OVER (PARTITION BY SecurityId, PriceDate)
            )
        ) AS RankDeviation
    FROM MarketPrices
) t
WHERE RankDeviation = 1;
```

Closest vendor = **minimum deviation from median**

---

# 8. Identify Most Variant Vendor (Outlier)

```sql
SELECT *
FROM (
    SELECT 
        SecurityId,
        PriceDate,
        VendorName,
        Price,
        ABS(
            Price -
            PERCENTILE_CONT(0.5)
            WITHIN GROUP (ORDER BY Price)
            OVER (PARTITION BY SecurityId, PriceDate)
        ) AS Deviation,
        
        RANK() OVER (
            PARTITION BY SecurityId, PriceDate
            ORDER BY ABS(
                Price -
                PERCENTILE_CONT(0.5)
                WITHIN GROUP (ORDER BY Price)
                OVER (PARTITION BY SecurityId, PriceDate)
            ) DESC
        ) AS RankDeviation
    FROM MarketPrices
) t
WHERE RankDeviation = 1;
```

Most variant vendor = **largest deviation from median**

---

# Conclusion

Using **analytical functions** we can:

- Calculate **Mean Price**
- Calculate **Median Price**
- Identify **Max and Min prices**
- Measure **price deviation from median**
- Detect **closest vendor price**
- Identify **outlier vendor prices**