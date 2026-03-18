#include <stdio.h>

/* Structure definition */
struct Student
{
    int roll_no;
    char name[30];
    float marks;
};

/* Function to write student records to file */
void writeToFile()
{
    FILE *fp;
    struct Student s;
    int i, n = 3;

    fp = fopen("transactions.txt", "w");
    if (fp == NULL)
    {
        printf("Error opening file for writing!\n");
        return;
    }

    printf("Enter details of %d students:\n", n);

    for (i = 0; i < n; i++)
    {
        printf("\nStudent %d\n", i + 1);

        printf("Enter Roll No : ");
        scanf("%d", &s.roll_no);

        printf("Enter Name    : ");
        scanf("%s", s.name);   // normal string (no spaces)

        printf("Enter Marks   : ");
        scanf("%f", &s.marks);

        /* normal control string */
        fprintf(fp, "%d %s %f\n", s.roll_no, s.name, s.marks);
    }

    fclose(fp);
}

/* Function to read student records from file */
void readFromFile()
{
    FILE *fp;
    struct Student s;

    fp = fopen("transactions.txt", "r");
    if (fp == NULL)
    {
        printf("Error opening file for reading!\n");
        return;
    }

    printf("\n--- Student Records ---\n");
    printf("%-10s %-20s %-10s\n", "Roll No", "Name", "Marks");
    printf("--------------------------------------------\n");

    /* normal control string with fscanf */
    while (fscanf(fp, "%d %s %f",
                  &s.roll_no, s.name, &s.marks) != EOF)
    {
        printf("%-10d %-20s %-10.2f\n",
               s.roll_no, s.name, s.marks);
    }

    fclose(fp);
}

int main()
{
    writeToFile();   // write data
    readFromFile(); // read data

    return 0;
}
