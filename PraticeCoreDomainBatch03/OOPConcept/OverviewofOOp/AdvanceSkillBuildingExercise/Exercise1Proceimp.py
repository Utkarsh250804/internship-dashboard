# -------- GLOBAL DATA STRUCTURE --------
students = []

# Add student
def add_student():
    name = input("Enter Name: ")
    roll = input("Enter Roll No: ")
    grade = input("Enter Grade: ")

    students.append({"Name": name, "Roll": roll, "Grade": grade})
    print("Student added.\n")

# Update student
def update_student():
    roll = input("Enter Roll No to update: ")
    for s in students:
        if s["Roll"] == roll:
            s["Name"] = input("Enter new Name: ")
            s["Grade"] = input("Enter new Grade: ")
            print("Record updated.\n")
            return
    print("Student not found.\n")

# Delete student
def delete_student():
    roll = input("Enter Roll No to delete: ")
    global students
    students = [s for s in students if s["Roll"] != roll]
    print("Record deleted (if existed).\n")

# Display students
def display_students():
    if not students:
        print("No records.\n")
        return

    print("\nName\tRoll\tGrade")
    print("-" * 25)
    for s in students:
        print(s["Name"], s["Roll"], s["Grade"])
    print()


# -------- MENU --------
while True:
    print("1.Add  2.Update  3.Delete  4.Display  5.Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        add_student()
    elif choice == "2":
        update_student()
    elif choice == "3":
        delete_student()
    elif choice == "4":
        display_students()
    elif choice == "5":
        break
    else:
        print("Invalid choice\n")
