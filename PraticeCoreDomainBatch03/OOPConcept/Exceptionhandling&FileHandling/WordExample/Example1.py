# =================================================
# Student Class
# =================================================
class Student:
    def __init__(self, student_id, name):
        self.student_id = student_id
        self.name = name


# =================================================
# Grade Class
# =================================================
class Grade:
    def __init__(self, student, subject, grade):
        self.student = student
        self.subject = subject
        self.grade = grade

    def to_string(self):
        return f"{self.student.student_id},{self.student.name},{self.subject},{self.grade}"


# =================================================
# File Operations
# =================================================
def save_grades_to_file(grades, filename):
    try:
        with open(filename, "w") as file:
            for g in grades:
                file.write(g.to_string() + "\n")
        print("Grades saved successfully.")

    except IOError as e:
        print("Error writing to file:", e)


def load_grades_from_file(filename):
    grades = []

    try:
        with open(filename, "r") as file:
            for line in file:
                student_id, name, subject, grade = line.strip().split(",")
                student = Student(int(student_id), name)
                grades.append(Grade(student, subject, grade))

    except FileNotFoundError:
        print("Error: File not found.")

    except Exception as e:
        print("Error reading file:", e)

    return grades


# =================================================
# Display Grades
# =================================================
def display_grades(grades):
    for g in grades:
        print(
            f"ID: {g.student.student_id}, "
            f"Name: {g.student.name}, "
            f"Subject: {g.subject}, "
            f"Grade: {g.grade}"
        )


# =================================================
# Main Program
# =================================================
if __name__ == "__main__":

    grades = [
        Grade(Student(1, "Amit"), "Math", "A"),
        Grade(Student(2, "Riya"), "Science", "B"),
        Grade(Student(3, "Rahul"), "English", "A")
    ]

    filename = "grades.txt"

    save_grades_to_file(grades, filename)

    loaded_grades = load_grades_from_file(filename)

    print("\nStudent Grades:")
    display_grades(loaded_grades)
