#include <stdio.h>

/* Structure definition */
struct Student {
    char name[30];
    int roll_no;
    float marks;
};

/* Function to sort students by marks (descending order) */
void sortStudents(struct Student s[], int n) {
    struct Student temp;

    for(int i = 0; i < n - 1; i++) {
        for(int j = i + 1; j < n; j++) {
            if(s[i].marks < s[j].marks) {
                temp = s[i];
                s[i] = s[j];
                s[j] = temp;
            }
        }
    }
}

int main() {
    int n;

    printf("Enter number of students: ");
    scanf("%d", &n);

    struct Student s[n];

    /* Input student data */
    for(int i = 0; i < n; i++) {
        printf("\nEnter details of student %d\n", i + 1);

        printf("Name: ");
        scanf("%s", s[i].name);

        printf("Roll No: ");
        scanf("%d", &s[i].roll_no);

        printf("Marks: ");
        scanf("%f", &s[i].marks);
    }

    /* Sort students */
    sortStudents(s, n);

    /* Display sorted list */
    printf("\n--- Students Sorted by Marks (Descending) ---\n");
    for(int i = 0; i < n; i++) {
        printf("\nName: %s", s[i].name);
        printf("\nRoll No: %d", s[i].roll_no);
        printf("\nMarks: %.2f\n", s[i].marks);
    }

    return 0;
}
