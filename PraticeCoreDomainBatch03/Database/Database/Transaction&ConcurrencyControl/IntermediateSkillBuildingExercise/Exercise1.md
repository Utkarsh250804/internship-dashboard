# Skill Building Exercise — Transaction & Concurrency Control

## Exercise 1 — Serializable Isolation Level for Booking System

### Problem
Multiple users may try to book the same seat simultaneously.  
Using **SERIALIZABLE isolation level**, we ensure that only one transaction can reserve a seat at a time.

---

# 1. Create Table

```sql
CREATE TABLE Seats (
    SeatID INT PRIMARY KEY,
    IsBooked BIT
);
```

---

# 2. Insert Sample Data

```sql
INSERT INTO Seats VALUES (101,0);
```

Seat 101 is initially **available**.

---

# 3. Transaction T1

Connection 1 attempts to book seat 101.

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

BEGIN TRANSACTION;

SELECT * FROM Seats WHERE SeatID = 101;

UPDATE Seats
SET IsBooked = 1
WHERE SeatID = 101 AND IsBooked = 0;

COMMIT;
```

---

# 4. Transaction T2 (Concurrent Attempt)

Connection 2 tries to book the same seat.

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

BEGIN TRANSACTION;

SELECT * FROM Seats WHERE SeatID = 101;

UPDATE Seats
SET IsBooked = 1
WHERE SeatID = 101 AND IsBooked = 0;

IF @@ROWCOUNT = 0
BEGIN
    PRINT 'Seat already booked';
    ROLLBACK;
END
ELSE
BEGIN
    COMMIT;
END
```

---

# Result

| SeatID | IsBooked |
|------|---------|
|101|1|

Only **one transaction succeeds**, preventing **lost updates**.

---

# Key Benefit

Serializable isolation ensures:

- No **lost updates**
- No **phantom reads**
- Transactions behave as if executed **one after another**

---
