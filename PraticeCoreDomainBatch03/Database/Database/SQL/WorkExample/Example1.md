# Worked Example — Employee Salary Reporting (LEAD & LAG)

## 1. Create Table

```sql
CREATE TABLE EmployeeSalary (
    EmployeeId VARCHAR(20),
    Year INT,
    Salary DECIMAL(10,2),
    Department VARCHAR(50),
    Currency VARCHAR(10)
);
```

---

## 2. Insert Sample Data

```sql
INSERT INTO EmployeeSalary VALUES
('E101',2019,50000,'IT','USD'),
('E101',2020,52000,'IT','USD'),
('E101',2021,55000,'IT','USD'),
('E101',2022,58000,'IT','USD'),
('E101',2023,60000,'IT','USD'),

('E102',2019,45000,'HR','USD'),
('E102',2020,47000,'HR','USD'),
('E102',2021,49000,'HR','USD'),
('E102',2022,52000,'HR','USD'),
('E102',2023,54000,'HR','USD');
```

---

## 3. Query Using `LAG()` (Previous Year Salary)

```sql
SELECT 
    EmployeeId,
    Year,
    Salary,
    LAG(Salary) OVER (
        PARTITION BY EmployeeId
        ORDER BY Year
    ) AS PreviousYearSalary
FROM EmployeeSalary;
```

---

## 4. Query Using `LEAD()` (Next Year Salary)

```sql
SELECT 
    EmployeeId,
    Year,
    Salary,
    LEAD(Salary) OVER (
        PARTITION BY EmployeeId
        ORDER BY Year
    ) AS NextYearSalary
FROM EmployeeSalary;
```

---

## 5. Final Reporting View (Previous + Next Salary)

```sql
CREATE VIEW EmployeeSalaryReport AS
SELECT
    EmployeeId,
    Year,
    Salary,
    LAG(Salary) OVER (PARTITION BY EmployeeId ORDER BY Year) AS PreviousYearSalary,
    LEAD(Salary) OVER (PARTITION BY EmployeeId ORDER BY Year) AS NextYearSalary
FROM EmployeeSalary;
```

---

## 6. Final Query to View Report

```sql
SELECT * FROM EmployeeSalaryReport
ORDER BY EmployeeId, Year;
```

---

## Example Output

| EmployeeId | Year | Salary | PreviousYearSalary | NextYearSalary |
|-------------|------|--------|--------------------|----------------|
| E101 | 2019 | 50000 | NULL | 52000 |
| E101 | 2020 | 52000 | 50000 | 55000 |
| E101 | 2021 | 55000 | 52000 | 58000 |
| E101 | 2022 | 58000 | 55000 | 60000 |
| E101 | 2023 | 60000 | 58000 | NULL |