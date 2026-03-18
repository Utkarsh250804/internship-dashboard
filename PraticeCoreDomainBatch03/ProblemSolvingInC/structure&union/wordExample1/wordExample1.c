#include <stdio.h>
#include <string.h>

/* Union to store salary (memory efficient) */
union Salary
{
    float monthly;
    float yearly;
};

/* Structure to store employee details */
struct Employee
{
    int emp_id;
    char name[30];
    int age;
    char department[20];
    union Salary salary;
};

/* Add new employee */
void addEmployee()
{
    FILE *fp;
    struct Employee e;

    fp = fopen("employees.dat", "ab");
    if (fp == NULL)
    {
        printf("Error opening file!\n");
        return;
    }

    printf("\nEnter Employee ID: ");
    scanf("%d", &e.emp_id);

    printf("Enter Name: ");
    scanf("%s", e.name);

    printf("Enter Age: ");
    scanf("%d", &e.age);

    printf("Enter Department: ");
    scanf("%s", e.department);

    printf("Enter Monthly Salary: ");
    scanf("%f", &e.salary.monthly);

    fwrite(&e, sizeof(e), 1, fp);
    fclose(fp);

    printf("Employee record added successfully.\n");
}

/* Display all employees */
void displayEmployees()
{
    FILE *fp;
    struct Employee e;

    fp = fopen("employees.dat", "rb");
    if (fp == NULL)
    {
        printf("No records found!\n");
        return;
    }

    printf("\n--- Employee Records ---\n");

    while (fread(&e, sizeof(e), 1, fp))
    {
        printf("\nID         : %d", e.emp_id);
        printf("\nName       : %s", e.name);
        printf("\nAge        : %d", e.age);
        printf("\nDepartment : %s", e.department);
        printf("\nSalary     : %.2f\n", e.salary.monthly);
    }

    fclose(fp);
}

/* Search employee by ID */
void searchEmployee()
{
    FILE *fp;
    struct Employee e;
    int id, found = 0;

    fp = fopen("employees.dat", "rb");
    if (fp == NULL)
    {
        printf("File not found!\n");
        return;
    }

    printf("Enter Employee ID to search: ");
    scanf("%d", &id);

    while (fread(&e, sizeof(e), 1, fp))
    {
        if (e.emp_id == id)
        {
            printf("\nEmployee Found!");
            printf("\nName       : %s", e.name);
            printf("\nAge        : %d", e.age);
            printf("\nDepartment : %s", e.department);
            printf("\nSalary     : %.2f\n", e.salary.monthly);
            found = 1;
            break;
        }
    }

    if (!found)
        printf("Employee not found!\n");

    fclose(fp);
}

/* Update employee record */
void updateEmployee()
{
    FILE *fp;
    struct Employee e;
    int id, found = 0;

    fp = fopen("employees.dat", "rb+");
    if (fp == NULL)
    {
        printf("File not found!\n");
        return;
    }

    printf("Enter Employee ID to update: ");
    scanf("%d", &id);

    while (fread(&e, sizeof(e), 1, fp))
    {
        if (e.emp_id == id)
        {
            printf("Enter New Department: ");
            scanf("%s", e.department);

            printf("Enter New Salary: ");
            scanf("%f", &e.salary.monthly);

            fseek(fp, -sizeof(e), SEEK_CUR);
            fwrite(&e, sizeof(e), 1, fp);
            found = 1;
            printf("Record updated successfully.\n");
            break;
        }
    }

    if (!found)
        printf("Employee not found!\n");

    fclose(fp);
}

/* Delete employee record */
void deleteEmployee()
{
    FILE *fp, *temp;
    struct Employee e;
    int id, found = 0;

    fp = fopen("employees.dat", "rb");
    temp = fopen("temp.dat", "wb");

    if (fp == NULL || temp == NULL)
    {
        printf("File error!\n");
        return;
    }

    printf("Enter Employee ID to delete: ");
    scanf("%d", &id);

    while (fread(&e, sizeof(e), 1, fp))
    {
        if (e.emp_id != id)
            fwrite(&e, sizeof(e), 1, temp);
        else
            found = 1;
    }

    fclose(fp);
    fclose(temp);

    remove("employees.dat");
    rename("temp.dat", "employees.dat");

    if (found)
        printf("Employee deleted successfully.\n");
    else
        printf("Employee not found!\n");
}

/* Main menu */
int main()
{
    int choice;

    do
    {
        printf("\n--- Employee Management System ---\n");
        printf("1. Add Employee\n");
        printf("2. Display Employees\n");
        printf("3. Search Employee\n");
        printf("4. Update Employee\n");
        printf("5. Delete Employee\n");
        printf("6. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice)
        {
        case 1: addEmployee(); break;
        case 2: displayEmployees(); break;
        case 3: searchEmployee(); break;
        case 4: updateEmployee(); break;
        case 5: deleteEmployee(); break;
        case 6: printf("Exiting...\n"); break;
        default: printf("Invalid choice!\n");
        }
    } while (choice != 6);

    return 0;
}
