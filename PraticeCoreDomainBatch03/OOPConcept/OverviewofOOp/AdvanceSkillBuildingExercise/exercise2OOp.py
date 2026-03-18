# -------- STUDENT CLASS --------
class Student:
    def __init__(self, name, roll, grade):
        self.name = name
        self.roll = roll
        self.grade = grade


# -------- RECORD MANAGER CLASS --------
class RecordManager:
    def __init__(self):
        self.students = []

    def add_student(self):
        name = input("Enter Name: ")
        roll = input("Enter Roll No: ")
        grade = input("Enter Grade: ")
        self.students.append(Student(name, roll, grade))
        print("Student added.\n")

    def update_student(self):
        roll = input("Enter Roll No to update: ")
        for s in self.students:
            if s.roll == roll:
                s.name = input("Enter new Name: ")
                s.grade = input("Enter new Grade: ")
                print("Record updated.\n")
                return
        print("Student not found.\n")

    def delete_student(self):
        roll = input("Enter Roll No to delete: ")
        self.students = [s for s in self.students if s.roll != roll]
        print("Record deleted (if existed).\n")

    def display_students(self):
        if not self.students:
            print("No records.\n")
            return

        print("\nName\tRoll\tGrade")
        print("-" * 25)
        for s in self.students:
            print(s.name, s.roll, s.grade)
        print()


# -------- MAIN PROGRAM --------
manager = RecordManager()

while True:
    print("1.Add  2.Update  3.Delete  4.Display  5.Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        manager.add_student()
    elif choice == "2":
        manager.update_student()
    elif choice == "3":
        manager.delete_student()
    elif choice == "4":
        manager.display_students()
    elif choice == "5":
        break
    else:
        print("Invalid choice\n")
