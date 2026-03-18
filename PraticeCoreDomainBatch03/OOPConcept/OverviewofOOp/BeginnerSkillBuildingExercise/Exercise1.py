# ---------- STUDENT CLASS ----------
# TODO 1: Create a student class
class Student:
    def __init__(self, name, roll, grade):
        self.name = name
        self.roll = roll
        self.grade = grade

# TODO 2: Create a Student Manager Class
# ---------- STUDENT MANAGER CLASS ----------
class StudentManager:
    def __init__(self):
        self.students = []

    def addStudent(self):
        # add student in list
        name = input("Enter your name: ")
        roll = input("Enter your roll number")
        grade = input("Enter your grade:")
        student = Student(name, roll, grade)
        self.students.append(student)

    def displayStudents(self):
        # display a student
        for student in self.students:
            print(f"| {student.name} | {student.roll} | {student.grade}")
        print()


def main():
    manager = StudentManager()

    while True:
        print("________________________")
        print("___Student Manager___")
        print("1. Add Student")
        print("2. Display Students")
        print("3. Exit")
        choice = input("Enter your choice: ")
        if choice == "1":
            manager.addStudent()
        elif choice == '2':
            manager.displayStudents()
        elif choice == '3':
            break
        else :
            print("Invalid Choice")
    print("_______________________")
    print("______Thank You _______")



if __name__ == "__main__":
    main()