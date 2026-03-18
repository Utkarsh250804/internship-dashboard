#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    // If no arguments passed except program name
    if (argc == 1)
    {
        printf("No command-line arguments provided.\n");
        return 0;
    }

    int maxIndex = 1;  // start from first argument
    int maxLen = strlen(argv[1]);

    for (int i = 2; i < argc; i++)
    {
        int len = strlen(argv[i]);

        // only update when strictly greater (so first one remains if same length)
        if (len > maxLen)
        {
            maxLen = len;
            maxIndex = i;
        }
    }

    printf("Longest argument: %s\n", argv[maxIndex]);
    return 0;
}
