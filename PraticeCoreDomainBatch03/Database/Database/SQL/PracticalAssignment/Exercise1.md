# Practice Assignment I — Employee Reporting Hierarchy Matrix

## 1. Create Table

```sql
CREATE TABLE EmployeeHierarchy (
    Entry_Id VARCHAR(10),
    Employee_Name VARCHAR(50),
    Supervisor_Name VARCHAR(50)
);
```

---

# 2. Insert Sample Data

```sql
INSERT INTO EmployeeHierarchy VALUES ('1','Jennifer',NULL);
INSERT INTO EmployeeHierarchy VALUES ('2','Andrew','Jennifer');
INSERT INTO EmployeeHierarchy VALUES ('3','Collin','Andrew');
INSERT INTO EmployeeHierarchy VALUES ('4','Michael','Collin');
INSERT INTO EmployeeHierarchy VALUES ('5','Sara','Michael');
```

Hierarchy Example:

Jennifer  
↓  
Andrew  
↓  
Collin  
↓  
Michael  
↓  
Sara  

---

# 3. Query to Generate Reporting Hierarchy

```sql
SELECT 
    Entry_Id,
    Employee_Name,
    LTRIM(SYS_CONNECT_BY_PATH(Employee_Name,' -> '),' -> ') AS Reporting_Hierarchy
FROM EmployeeHierarchy
START WITH Supervisor_Name IS NULL
CONNECT BY PRIOR Employee_Name = Supervisor_Name;
```

---

# 4. Explanation

**START WITH Supervisor_Name IS NULL**

Root employee (top manager) identify karta hai.

**CONNECT BY PRIOR Employee_Name = Supervisor_Name**

Employee → Supervisor relationship follow karta hai.

**SYS_CONNECT_BY_PATH(Employee_Name,' -> ')**

Hierarchy ko string format me build karta hai.

---

# 5. Example Output

| Entry_Id | Employee_Name | Reporting_Hierarchy |
|--------|---------------|--------------------|
|1|Jennifer|Jennifer|
|2|Andrew|Jennifer -> Andrew|
|3|Collin|Jennifer -> Andrew -> Collin|
|4|Michael|Jennifer -> Andrew -> Collin -> Michael|
|5|Sara|Jennifer -> Andrew -> Collin -> Michael -> Sara|

---

# Final Result

Collin ki hierarchy example:

```

Jennifer -> Andrew -> Collin

```

Is query se **har employee ke liye complete reporting chain mil jati hai**.