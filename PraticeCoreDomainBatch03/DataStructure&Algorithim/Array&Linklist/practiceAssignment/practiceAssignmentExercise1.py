course_Registration = []

def register_course(course_ID, course_name, instructor_name, credits, Maximum_Enrollment):
    course = {
        "course_ID": course_ID,
        "course_name": course_name,
        "instructor_name": instructor_name,
        "credits": credits,
        "Maximum_Enrollment": Maximum_Enrollment
    }
    course_Registration.append(course)


def update_course(course_ID, **kwargs):
    for course in course_Registration:
        if course["course_ID"] == course_ID:
            for key, value in kwargs.items():
                if key in course:
                    course[key] = value
            return
    print("Course not found.")


def course_Availability():
    available_courses = []
    for course in course_Registration:
        if course["Maximum_Enrollment"] > 0:
            available_courses.append(course)
    return available_courses



class Student:
    def __init__(self,studint_ID, couse_ID, grade, completion_status, recording_courseCompletion):
        self.studint_ID = studint_ID
        self.couse_ID = couse_ID
        self.grade = grade
        self.completion_status = completion_status
        self.recording_courseCompletion = recording_courseCompletion
        self.next = None


head = None

def add_progress():
    global head
    studint_ID = input("Enter Student ID: ")
    couse_ID = input("Enter Course ID: ")
    grade = input("Enter Grade: ")
    completion_status = input("Enter Completion Status: ")
    recording_courseCompletion = input("Enter Recording Course Completion: ")

    new_student = Student(studint_ID, couse_ID, grade, completion_status, recording_courseCompletion)
    
    if head is None:
        head = new_student
    else:
        current = head
        while current.next:
            current = current.next
        current.next = new_student


def display_progress():
    student_id = input("Enter Student ID to display progress: ")
    current = head
    while current:
        if current.studint_ID == student_id:
            print(f"Student ID: {current.studint_ID}, Course ID: {current.couse_ID}, Grade: {current.grade}, Completion Status: {current.completion_status}, Recording Course Completion: {current.recording_courseCompletion}")
        current = current.next
    

def update_progress():
    student_id = input("Enter Student ID to update progress: ")
    current = head
    while current:
        if current.studint_ID == student_id:
            current.couse_ID = input("Enter new Course ID: ")
            current.grade = input("Enter new Grade: ")
            current.completion_status = input("Enter new Completion Status: ")
            current.recording_courseCompletion = input("Enter new Recording Course Completion: ")
            return
        current = current.next
    print("Student not found.")


def drop_course():
    global head

    student_id = input("Enter student ID to drop course: ")
    course_id = input("Enter course ID to drop: ")

    temp = head
    prev = None

    while temp:
        if temp.studint_ID == student_id and temp.couse_ID == course_id:
            if prev:
                prev.next = temp.next
            else:
                head = temp.next
            return
        prev = temp
        temp = temp.next


while True:
    print("\nCourse Registration System")
    print("1. Register Course")
    print("2. Update Course")
    print("3. Check Course Availability")
    print("4. Add Student Progress")
    print("5. Display Student Progress")
    print("6. Update Student Progress")
    print("7. Drop Course")
    print("8. Exit")

    choice = input("Enter your choice: ")

    if choice == '1':
        course_ID = input("Enter Course ID: ")
        course_name = input("Enter Course Name: ")
        instructor_name = input("Enter Instructor Name: ")
        credits = int(input("Enter Credits: "))
        Maximum_Enrollment = int(input("Enter Maximum Enrollment: "))
        register_course(course_ID, course_name, instructor_name, credits, Maximum_Enrollment)
    elif choice == '2':
        course_ID = input("Enter Course ID to update: ")
        print("Enter new details (leave blank to keep current value):")
        course_name = input("New Course Name: ")
        instructor_name = input("New Instructor Name: ")
        credits = input("New Credits: ")
        Maximum_Enrollment = input("New Maximum Enrollment: ")

        kwargs = {}
        if course_name:
            kwargs["course_name"] = course_name
        if instructor_name:
            kwargs["instructor_name"] = instructor_name
        if credits:
            kwargs["credits"] = int(credits)
        if Maximum_Enrollment:
            kwargs["Maximum_Enrollment"] = int(Maximum_Enrollment)

        update_course(course_ID, **kwargs)
    elif choice == '3':
        available_courses = course_Availability()
        for course in available_courses:
            print(course)
    elif choice == '4':
        add_progress()
    elif choice == '5':
        display_progress()
    elif choice == '6':
        update_progress()
    elif choice == '7':
        drop_course()
    elif choice == '8':
        break
    else:
        print("Invalid choice. Please try again.")