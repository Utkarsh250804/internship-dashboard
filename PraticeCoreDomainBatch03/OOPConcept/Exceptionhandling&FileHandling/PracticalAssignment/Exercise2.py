# =================================================
# Employee Class
# =================================================
class Employee:
    def __init__(self, emp_id, name, position, salary):
        self.emp_id = emp_id
        self.name = name
        self.position = position
        self.salary = salary

    def to_string(self):
        return f"{self.emp_id},{self.name},{self.position},{self.salary}"

    def display(self):
        print(
            f"ID: {self.emp_id}, "
            f"Name: {self.name}, "
            f"Position: {self.position}, "
            f"Salary: {self.salary}"
        )


# =================================================
# Add Employee
# =================================================
def add_employee(employees, emp_id, name, position, salary):
    employees.append(Employee(emp_id, name, position, salary))


# =================================================
# Save Employees to File
# =================================================
def save_employees_to_file(employees, filename):
    try:
        with open(filename, "w") as file:
            for emp in employees:
                file.write(emp.to_string() + "\n")
        print("Employees saved successfully.")

    except IOError as e:
        print("Error writing to file:", e)


# =================================================
# Load Employees from File
# =================================================
def load_employees_from_file(filename):
    employees = []

    try:
        with open(filename, "r") as file:
            for line in file:
                if line.strip() == "":
                    continue
                emp_id, name, position, salary = line.strip().split(",")
                employees.append(
                    Employee(int(emp_id), name, position, float(salary))
                )

    except FileNotFoundError:
        print("Error: File not found.")

    except Exception as e:
        print("Error reading file:", e)

    return employees


# =================================================
# Display Employees
# =================================================
def display_employees(employees):
    if not employees:
        print("No employee records available.")
        return

    for emp in employees:
        emp.display()


# =================================================
# Main Program
# =================================================
if __name__ == "__main__":

    employees = []

    add_employee(employees, 101, "Amit Kumar", "Software Engineer", 60000.0)
    add_employee(employees, 102, "Riya Sharma", "Data Analyst", 55000.0)
    add_employee(employees, 103, "Rahul Verma", "Project Manager", 80000.0)

    filename = "employees.txt"

    save_employees_to_file(employees, filename)

    print("\nLoading employees from file...\n")
    loaded_employees = load_employees_from_file(filename)

    print("Employee Records:")
    display_employees(loaded_employees)
