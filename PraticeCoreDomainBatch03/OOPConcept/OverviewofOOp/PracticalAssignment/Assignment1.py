# ================= EMPLOYEE CLASS =================
class Employee:
    def __init__(self, employee_id, name, position, salary, performance_rating):
        self.employee_id = employee_id
        self.name = name
        self.position = position
        self.salary = float(salary)
        self.performance_rating = float(performance_rating)

    def update_details(self, name=None, position=None, salary=None, performance_rating=None):
        if name:
            self.name = name
        if position:
            self.position = position
        if salary is not None:
            self.salary = float(salary)
        if performance_rating is not None:
            self.performance_rating = float(performance_rating)

    def __str__(self):
        return (f"ID: {self.employee_id}, Name: {self.name}, "
                f"Position: {self.position}, Salary: {self.salary}, "
                f"Rating: {self.performance_rating}")


# ================= PERFORMANCE REVIEW CLASS =================
class PerformanceReview:
    def __init__(self, employee_id, review_date, rating, comments):
        self.employee_id = employee_id
        self.review_date = review_date
        self.rating = float(rating)
        self.comments = comments

    def update_review(self, rating=None, comments=None):
        if rating is not None:
            self.rating = float(rating)
        if comments:
            self.comments = comments

    def display_review(self):
        print(f"Date: {self.review_date}, Rating: {self.rating}, Comments: {self.comments}")


# ================= EMPLOYEE MANAGEMENT SYSTEM =================
class EmployeeManagementSystem:
    def __init__(self):
        self.employees = []
        self.reviews = []

    # -------- EMPLOYEE OPERATIONS --------
    def add_employee(self):
        emp_id = int(input("Enter Employee ID: "))
        if any(e.employee_id == emp_id for e in self.employees):
            print("Employee ID already exists.\n")
            return

        name = input("Enter Name: ")
        position = input("Enter Position: ")
        salary = float(input("Enter Salary: "))
        rating = float(input("Enter Performance Rating: "))

        self.employees.append(Employee(emp_id, name, position, salary, rating))
        print("Employee added successfully.\n")

    def update_employee(self):
        emp_id = int(input("Enter Employee ID to update: "))
        for emp in self.employees:
            if emp.employee_id == emp_id:
                name = input("Enter new Name (leave blank to skip): ")
                position = input("Enter new Position (leave blank to skip): ")
                salary = input("Enter new Salary (leave blank to skip): ")
                rating = input("Enter new Rating (leave blank to skip): ")

                emp.update_details(
                    name=name if name else None,
                    position=position if position else None,
                    salary=float(salary) if salary else None,
                    performance_rating=float(rating) if rating else None
                )
                print("Employee updated successfully.\n")
                return
        print("Employee not found.\n")

    def display_all_employees(self):
        if not self.employees:
            print("No employees found.\n")
            return
        print("\n--- Employee List ---")
        for emp in self.employees:
            print(emp)
        print()

    # -------- PERFORMANCE REVIEW OPERATIONS --------
    def add_performance_review(self):
        emp_id = int(input("Enter Employee ID: "))
        if not any(e.employee_id == emp_id for e in self.employees):
            print("Employee does not exist.\n")
            return

        date = input("Enter Review Date (YYYY-MM-DD): ")
        rating = float(input("Enter Rating: "))
        comments = input("Enter Comments: ")

        self.reviews.append(PerformanceReview(emp_id, date, rating, comments))
        print("Performance review added.\n")

    def update_performance_review(self):
        emp_id = int(input("Enter Employee ID: "))
        date = input("Enter Review Date to update: ")

        for review in self.reviews:
            if review.employee_id == emp_id and review.review_date == date:
                rating = input("Enter new Rating (leave blank to skip): ")
                comments = input("Enter new Comments (leave blank to skip): ")

                review.update_review(
                    rating=float(rating) if rating else None,
                    comments=comments if comments else None
                )
                print("Review updated successfully.\n")
                return
        print("Review not found.\n")

    def display_reviews_for_employee(self):
        emp_id = int(input("Enter Employee ID: "))
        found = False
        for review in self.reviews:
            if review.employee_id == emp_id:
                review.display_review()
                found = True
        if not found:
            print("No reviews found for this employee.\n")


# ================= MAIN PROGRAM =================
ems = EmployeeManagementSystem()

while True:
    print("===== EMPLOYEE MANAGEMENT SYSTEM =====")
    print("1. Add Employee")
    print("2. Update Employee")
    print("3. Display All Employees")
    print("4. Add Performance Review")
    print("5. Update Performance Review")
    print("6. Display Reviews for Employee")
    print("7. Exit")

    choice = input("Enter your choice: ")

    if choice == "1":
        ems.add_employee()
    elif choice == "2":
        ems.update_employee()
    elif choice == "3":
        ems.display_all_employees()
    elif choice == "4":
        ems.add_performance_review()
    elif choice == "5":
        ems.update_performance_review()
    elif choice == "6":
        ems.display_reviews_for_employee()
    elif choice == "7":
        print("Exiting Employee Management System.")
        break
    else:
        print("Invalid choice. Try again.\n")
