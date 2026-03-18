# Worked Example I — Data Entry Checkpoints through Trigger

## Problem Description

Business wants to validate product and category data at the **database layer** because the UI layer is managed by a third-party system.

Two tables exist:

- **Products**
- **Categories**

A view **vw_ProductDetails** shows:

- Product Name
- Category Name

The business wants to **INSERT data into the view**, and a trigger should automatically:

1. Insert the category if it does not exist.
2. Insert the product referencing the correct category.

---

# 1. Create Tables

```sql
CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName VARCHAR(100)
);

CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100),
    CategoryID INT,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
```

---

# 2. Insert Sample Data

```sql
INSERT INTO Categories (CategoryName)
VALUES ('Electronics'), ('Furniture');

INSERT INTO Products (ProductName, CategoryID)
VALUES ('Laptop',1),
       ('Table',2);
```

---

# 3. Create View

```sql
CREATE VIEW vw_ProductDetails
AS
SELECT 
    p.ProductName,
    c.CategoryName
FROM Products p
JOIN Categories c
ON p.CategoryID = c.CategoryID;
```

---

# 4. Check View Content

```sql
SELECT * FROM vw_ProductDetails;
```

Example Output:

| ProductName | CategoryName |
|-------------|-------------|
| Laptop | Electronics |
| Table | Furniture |

---

# 5. Attempt Insert into View (Will Fail)

```sql
INSERT INTO vw_ProductDetails (ProductName, CategoryName)
VALUES ('Mobile','Electronics');
```

Error occurs because the **view is based on multiple tables**.

---

# 6. Create INSTEAD OF INSERT Trigger

This trigger intercepts inserts into the view and performs logic on base tables.

```sql
CREATE TRIGGER trg_InsertProductDetails
ON vw_ProductDetails
INSTEAD OF INSERT
AS
BEGIN

    DECLARE @CategoryID INT

    -- Check if category exists
    SELECT @CategoryID = CategoryID
    FROM Categories
    WHERE CategoryName = (SELECT CategoryName FROM inserted)

    -- If category does not exist, insert it
    IF @CategoryID IS NULL
    BEGIN
        INSERT INTO Categories (CategoryName)
        SELECT CategoryName FROM inserted

        SELECT @CategoryID = SCOPE_IDENTITY()
    END

    -- Insert product
    INSERT INTO Products (ProductName, CategoryID)
    SELECT ProductName, @CategoryID
    FROM inserted

END;
```

---

# 7. Test the Trigger

Now insert into the view:

```sql
INSERT INTO vw_ProductDetails (ProductName, CategoryName)
VALUES ('Smartphone','Electronics');

INSERT INTO vw_ProductDetails (ProductName, CategoryName)
VALUES ('Chair','Office');
```

---

# 8. Verify Results

```sql
SELECT * FROM Products;
SELECT * FROM Categories;
SELECT * FROM vw_ProductDetails;
```

Example Result:

| ProductName | CategoryName |
|-------------|-------------|
| Laptop | Electronics |
| Table | Furniture |
| Smartphone | Electronics |
| Chair | Office |

Notice that **Office category was automatically created**.

---

# Conclusion

Using **INSTEAD OF INSERT triggers** allows:

- Data validation at database level
- Automatic creation of related records
- Maintaining referential integrity
- Allowing inserts into complex views