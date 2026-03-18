#include <stdio.h>
#include <ctype.h>   // for isalnum()

int main(int argc, char *argv[])
{
    int total = 0;

    // start from 1 because argv[0] is program name
    for (int i = 1; i < argc; i++)
    {
        for (int j = 0; argv[i][j] != '\0'; j++)
        {
            if (isalnum((unsigned char)argv[i][j]))  // only A-Z, a-z, 0-9
            {
                total++;
            }
        }
    }

    printf("Total characters = %d\n", total);
    return 0;
}
