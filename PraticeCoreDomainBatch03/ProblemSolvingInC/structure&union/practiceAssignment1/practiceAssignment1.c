#include <stdio.h>
#include <string.h>

#define MAX_COURSES 5

/* Union to store course data */
union Courses
{
    char courseNames[MAX_COURSES][30];  // list of courses
};

/* Structure to store student information */
struct Student
{
    int student_id;
    char name[30];
    float grade;
    int course_count;
    union Courses courses;
};

/* Function to add a new student record */
void addStudent()
{
    FILE *fp;
    struct Student s;
    int i;

    fp = fopen("students.dat", "ab");
    if (fp == NULL)
    {
        printf("Error opening file!\n");
        return;
    }

    printf("\nEnter Student ID: ");
    scanf("%d", &s.student_id);

    printf("Enter Name: ");
    scanf("%s", s.name);

    printf("Enter Grade: ");
    scanf("%f", &s.grade);

    printf("Enter number of courses (max %d): ", MAX_COURSES);
    scanf("%d", &s.course_count);

    for (i = 0; i < s.course_count; i++)
    {
        printf("Enter Course %d: ", i + 1);
        scanf("%s", s.courses.courseNames[i]);
    }

    fwrite(&s, sizeof(s), 1, fp);
    fclose(fp);

    printf("Student record added successfully.\n");
}

/* Function to display all student records */
void displayStudents()
{
    FILE *fp;
    struct Student s;
    int i;

    fp = fopen("students.dat", "rb");
    if (fp == NULL)
    {
        printf("No records found!\n");
        return;
    }

    printf("\n--- Student Records ---\n");

    while (fread(&s, sizeof(s), 1, fp))
    {
        printf("\nID    : %d", s.student_id);
        printf("\nName  : %s", s.name);
        printf("\nGrade : %.2f", s.grade);
        printf("\nCourses:\n");

        for (i = 0; i < s.course_count; i++)
        {
            printf("  - %s\n", s.courses.courseNames[i]);
        }
    }

    fclose(fp);
}

/* Function to modify a student record */
void modifyStudent()
{
    FILE *fp;
    struct Student s;
    int id, found = 0, i;

    fp = fopen("students.dat", "rb+");
    if (fp == NULL)
    {
        printf("Error opening file!\n");
        return;
    }

    printf("Enter Student ID to modify: ");
    scanf("%d", &id);

    while (fread(&s, sizeof(s), 1, fp))
    {
        if (s.student_id == id)
        {
            found = 1;

            printf("Enter New Name: ");
            scanf("%s", s.name);

            printf("Enter New Grade: ");
            scanf("%f", &s.grade);

            printf("Enter number of courses: ");
            scanf("%d", &s.course_count);

            for (i = 0; i < s.course_count; i++)
            {
                printf("Enter Course %d: ", i + 1);
                scanf("%s", s.courses.courseNames[i]);
            }

            fseek(fp, -sizeof(s), SEEK_CUR);
            fwrite(&s, sizeof(s), 1, fp);
            printf("Record updated successfully.\n");
            break;
        }
    }

    if (!found)
        printf("Student record not found.\n");

    fclose(fp);
}

/* Main function */
int main()
{
    int choice;

    do
    {
        printf("\n--- Student Management System ---\n");
        printf("1. Add Student\n");
        printf("2. Display Students\n");
        printf("3. Modify Student\n");
        printf("4. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice)
        {
        case 1:
            addStudent();
            break;
        case 2:
            displayStudents();
            break;
        case 3:
            modifyStudent();
            break;
        case 4:
            printf("Exiting program...\n");
            break;
        default:
            printf("Invalid choice!\n");
        }
    } while (choice != 4);

    return 0;
}
