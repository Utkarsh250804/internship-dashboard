#include <stdio.h>

struct employee
{
    char name[50];
    int id;
    char department[30];
    union
    {
        float hourly_wage;
        float monthly_salary;
    } salary;
    int is_hourly; // 1 = hourly, 0 = monthly
};

void inputEmployeeData(struct employee *emp)
{
    printf("Enter Employee Name: ");
    scanf(" %[^\n]", emp->name);

    printf("Enter Employee ID: ");
    scanf("%d", &emp->id);

    printf("Enter Department: ");
    scanf(" %[^\n]", emp->department);

    printf("Is employee hourly paid? (1-Yes / 0-No): ");
    scanf("%d", &emp->is_hourly);

    if (emp->is_hourly == 1)
    {
        printf("Enter Hourly Wage: ");
        scanf("%f", &emp->salary.hourly_wage);
    }
    else
    {
        printf("Enter Monthly Salary: ");
        scanf("%f", &emp->salary.monthly_salary);
    }
}

void displayEmployeeData(struct employee emp)
{
    printf("\n----------------------------");
    printf("\nName       : %s", emp.name);
    printf("\nID         : %d", emp.id);
    printf("\nDepartment : %s", emp.department);

    if (emp.is_hourly == 1)
        printf("\nHourly Wage: %.2f", emp.salary.hourly_wage);
    else
        printf("\nMonthly Salary: %.2f", emp.salary.monthly_salary);

    printf("\n----------------------------\n");
}

int main()
{
    FILE *fp;
    struct employee emp;
    int choice, n;

    do
    {
        printf("\n===============================");
        printf("\nEmployee Record Management");
        printf("\n===============================");
        printf("\n1. Add Employee Record");
        printf("\n2. Display Employee Records");
        printf("\n0. Exit");
        printf("\nEnter choice: ");
        scanf("%d", &choice);

        switch (choice)
        {
        case 1:
            fp = fopen("employee_records.dat", "ab"); // append mode
            if (fp == NULL)
            {
                printf("File cannot be opened!\n");
                break;
            }

            printf("Enter number of employees: ");
            scanf("%d", &n);

            for (int i = 0; i < n; i++)
            {
                printf("\nEnter details for Employee %d\n", i + 1);
                inputEmployeeData(&emp);
                fwrite(&emp, sizeof(struct employee), 1, fp);
            }

            fclose(fp);
            break;

        case 2:
            fp = fopen("employee_records.dat", "rb");
            if (fp == NULL)
            {
                printf("No records found!\n");
                break;
            }

            printf("\n--- Employee Records ---\n");
            while (fread(&emp, sizeof(struct employee), 1, fp))
            {
                displayEmployeeData(emp);
            }

            fclose(fp);
            break;

        case 0:
            printf("Exiting program...\n");
            break;

        default:
            printf("Invalid choice!\n");
            
        }

    } while (choice != 0);

    return 0;
}
