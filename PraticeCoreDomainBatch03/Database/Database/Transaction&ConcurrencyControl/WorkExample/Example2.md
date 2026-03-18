# Worked Example II — Data Entry in Underlying Table of View

## Problem Description

The UI layer interacts with a **view** that joins multiple underlying tables.  
However, when the UI tries to insert data into the view, it fails because the view is based on multiple tables.

To solve this problem:

- Create an **INSTEAD OF INSERT trigger** on the view
- The trigger will perform the required **DML operations on the underlying tables**
- It must handle **multi-row inserts**

---

# 1. Create Tables

### Categories Table

```sql
CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName VARCHAR(100)
);
```

### Products Table

```sql
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100),
    CategoryID INT,
    Price DECIMAL(10,2),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
```

---

# 2. Insert Sample Data

```sql
INSERT INTO Categories (CategoryName)
VALUES ('Electronics'), ('Furniture');

INSERT INTO Products (ProductName, CategoryID, Price)
VALUES ('Laptop',1,800),
       ('Table',2,200);
```

---

# 3. Create the View

```sql
CREATE VIEW vw_ProductDetails
AS
SELECT 
    p.ProductName,
    c.CategoryName,
    p.Price
FROM Products p
JOIN Categories c
ON p.CategoryID = c.CategoryID;
```

---

# 4. Attempt Insert into View (Fails)

```sql
INSERT INTO vw_ProductDetails (ProductName, CategoryName, Price)
VALUES ('Mobile','Electronics',600);
```

Error occurs because **the view is based on multiple tables**.

---

# 5. Create Email Validation Function (Optional Business Rule)

```sql
CREATE FUNCTION fn_validate_email (@email VARCHAR(255))
RETURNS BIT
AS
BEGIN
    IF @email LIKE '%_@_%._%'
        RETURN 1
    RETURN 0
END;
```

(This step shows how validation functions can be added if needed.)

---

# 6. Create INSTEAD OF INSERT Trigger

```sql
CREATE TRIGGER trg_InsertProductDetails
ON vw_ProductDetails
INSTEAD OF INSERT
AS
BEGIN

    -- Step 1: Insert any new categories that do not exist
    INSERT INTO Categories (CategoryName)
    SELECT DISTINCT i.CategoryName
    FROM inserted i
    WHERE NOT EXISTS (
        SELECT 1
        FROM Categories c
        WHERE c.CategoryName = i.CategoryName
    );

    -- Step 2: Insert products using the correct CategoryID
    INSERT INTO Products (ProductName, CategoryID, Price)
    SELECT 
        i.ProductName,
        c.CategoryID,
        i.Price
    FROM inserted i
    JOIN Categories c
    ON i.CategoryName = c.CategoryName;

END;
```

---

# 7. Test Multi-Row Insert

```sql
INSERT INTO vw_ProductDetails (ProductName, CategoryName, Price)
VALUES 
('Phone','Electronics',500),
('Chair','Office',150),
('Monitor','Electronics',300);
```

This multi-row insert will:

- Insert **Office category automatically**
- Insert all products correctly

---

# 8. Verify Results

### Categories Table

```sql
SELECT * FROM Categories;
```

| CategoryID | CategoryName |
|------------|--------------|
|1|Electronics|
|2|Furniture|
|3|Office|

---

### Products Table

```sql
SELECT * FROM Products;
```

| ProductID | ProductName | CategoryID | Price |
|-----------|-------------|------------|------|
|1|Laptop|1|800|
|2|Table|2|200|
|3|Phone|1|500|
|4|Chair|3|150|
|5|Monitor|1|300|

---

# Conclusion

Using **INSTEAD OF INSERT triggers on views** allows:

- DML operations through complex views
- Automatic handling of related tables
- Support for **multi-row inserts**
- Better abstraction between **UI layer and database layer**