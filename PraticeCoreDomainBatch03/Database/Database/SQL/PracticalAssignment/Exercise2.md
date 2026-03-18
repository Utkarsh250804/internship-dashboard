# Practice Assignment II — Removing Logical Duplicity

## Problem

A table stores distances between cities but contains **logical duplicates**.

Example:

| Source | Destination | Distance_KM |
|------|-------------|-------------|
| Kolkata | New Delhi | 1610 |
| New Delhi | Kolkata | 1610 |

Both represent the **same route**, so only **one record should remain**.

---

# 1. Create Table

```sql
CREATE TABLE CityDistance (
    Id INT PRIMARY KEY,
    Source VARCHAR(50),
    Destination VARCHAR(50),
    Distance_KM INT
);
```

---

# 2. Insert Sample Data

```sql
INSERT INTO CityDistance VALUES
(1,'Kolkata','New Delhi',1610),
(2,'New Delhi','Kolkata',1610),
(3,'Mumbai','Pune',150),
(4,'Pune','Mumbai',150),
(5,'Chennai','Bangalore',350);
```

---

# 3. Identify Logical Duplicates

To treat **A → B** and **B → A** as the same route, create a **normalized pair**.

```sql
SELECT *,
       LEAST(Source, Destination) AS City1,
       GREATEST(Source, Destination) AS City2
FROM CityDistance;
```

This converts both:

```
Kolkata → New Delhi
New Delhi → Kolkata
```

into the same pair:

```
City1 = Kolkata
City2 = New Delhi
```

---

# 4. Find Duplicate Rows

```sql
SELECT
    LEAST(Source, Destination) AS City1,
    GREATEST(Source, Destination) AS City2,
    COUNT(*) AS DuplicateCount
FROM CityDistance
GROUP BY
    LEAST(Source, Destination),
    GREATEST(Source, Destination)
HAVING COUNT(*) > 1;
```

---

# 5. Remove Logical Duplicates

Use **ROW_NUMBER()** analytical function.

```sql
DELETE FROM CityDistance
WHERE Id IN (
    SELECT Id
    FROM (
        SELECT Id,
               ROW_NUMBER() OVER (
                   PARTITION BY
                   LEAST(Source, Destination),
                   GREATEST(Source, Destination)
                   ORDER BY Id
               ) AS rn
        FROM CityDistance
    ) t
    WHERE rn > 1
);
```

Explanation:

- **PARTITION BY normalized city pair**
- **ROW_NUMBER()** assigns ranking
- **rn > 1** → duplicate rows deleted

---

# 6. Final Table

| Source | Destination | Distance |
|------|-------------|----------|
| Kolkata | New Delhi | 1610 |
| Mumbai | Pune | 150 |
| Chennai | Bangalore | 350 |

Logical duplicates are removed.

---

# Conclusion

Using **analytical functions and normalization logic**, we can:

- Detect logical duplicates
- Treat bidirectional routes as identical
- Keep only one valid record
- Maintain clean database tables