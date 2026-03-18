#include <stdio.h>
#include <string.h>
#include <ctype.h>

/* Input String */
void inputString(char str[])
{
    printf("Enter a string: ");
    fgets(str, 100, stdin);
    str[strcspn(str, "\n")] = '\0';   // remove newline
}

/* Display String */
void displayString(char str[])
{
    printf("String is: %s\n", str);
}

/* Count Vowels */
int countVowels(char str[])
{
    int count = 0;

    for (int i = 0; str[i] != '\0'; i++) {
        char ch = tolower(str[i]);
        if (ch == 'a' || ch == 'e' || ch == 'i' ||
            ch == 'o' || ch == 'u') {
            count++;
        }
    }
    return count;
}

/* Count Consonants */
int countConsonants(char str[])
{
    int count = 0;

    for (int i = 0; str[i] != '\0'; i++) {
        if (isalpha(str[i])) {
            char ch = tolower(str[i]);
            if (!(ch == 'a' || ch == 'e' || ch == 'i' ||
                  ch == 'o' || ch == 'u')) {
                count++;
            }
        }
    }
    return count;
}

/* Reverse String */
void reverseString(char str[])
{
    int i = 0;
    int j = strlen(str) - 1;

    while (i < j) {
        char temp = str[i];
        str[i] = str[j];
        str[j] = temp;
        i++;
        j--;
    }
}

/* Convert to Uppercase */
void toUpperCase(char str[])
{
    for (int i = 0; str[i] != '\0'; i++)
        str[i] = toupper(str[i]);
}

/* Convert to Lowercase */
void toLowerCase(char str[])
{
    for (int i = 0; str[i] != '\0'; i++)
        str[i] = tolower(str[i]);
}

/* Main Function */
int main()
{
    char str[100];
    int choice;

    inputString(str);

    do {
        printf("\n-------------------------\n");
        printf("\n-------------------------\n");
        printf("1. Display String\n");
        printf("2. Count Vowels\n");
        printf("3. Count Consonants\n");
        printf("4. Reverse String\n");
        printf("5. Convert to Uppercase\n");
        printf("6. Convert to Lowercase\n");
        printf("0. Exit\n");

        printf("Enter your choice: ");
        scanf("%d", &choice);
        getchar();   // clear newline

        switch (choice) {
            case 1:
                displayString(str);
                break;

            case 2:
                printf("Vowels: %d\n", countVowels(str));
                break;

            case 3:
                printf("Consonants: %d\n", countConsonants(str));
                break;

            case 4:
                reverseString(str);
                printf("String reversed\n");
                break;

            case 5:
                toUpperCase(str);
                printf("Converted to uppercase\n");
                break;

            case 6:
                toLowerCase(str);
                printf("Converted to lowercase\n");
                break;

            case 0:
                printf("Program exited\n");
                break;

            default:
                printf("Invalid choice\n");
        }

    } while (choice != 0);

    return 0;
}
