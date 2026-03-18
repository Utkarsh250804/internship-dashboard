#include <stdio.h>

int main(int argc, char *argv[])
{
    // If no arguments passed except program name
    if (argc == 1)
    {
        printf("No command-line arguments provided.\n");
        return 0;
    }

    printf("Arguments in reverse order:\n");

    // Start from last argument and go till argv[1]
    for (int i = argc - 1; i >= 1; i--)
    {
        printf("%s\n", argv[i]);
    }

    return 0;
}
