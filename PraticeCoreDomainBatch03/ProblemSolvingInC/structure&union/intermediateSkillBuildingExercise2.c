#include <stdio.h>
#include <string.h>

// structure definition
struct Student
{
    char name[50];
    int roll;
    float marks;
};

// function to update student details
void updateStudent(struct Student *s)
{
    printf("\n--- Enter Student Details ---\n");

    printf("Enter Name  : ");
    fgets(s->name, sizeof(s->name), stdin);
    s->name[strcspn(s->name, "\n")] = '\0';  // remove newline

    printf("Enter Roll  : ");
    scanf("%d", &s->roll);

    printf("Enter Marks : ");
    scanf("%f", &s->marks);
}

// function to display details
void displayStudent(struct Student *s)
{
    printf("\n--- Student Details ---\n");
    printf("Name  : %s\n", s->name);
    printf("Roll  : %d\n", s->roll);
    printf("Marks : %.2f\n", s->marks);
}

int main()
{
    struct Student s1;

    updateStudent(&s1);     // pass by reference
    displayStudent(&s1);    // reflect updated values

    return 0;
}
