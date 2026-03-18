#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    // Check if exactly 2 numbers are passed
    if (argc != 3)
    {
        printf("Usage: %s <num1> <num2>\n", argv[0]);
        return 0;
    }

    int a = atoi(argv[1]);
    int b = atoi(argv[2]);

    printf("Before Swap: a = %d, b = %d\n", a, b);

    /*
        XOR Swap Algorithm:
        a = a ^ b
        b = a ^ b
        a = a ^ b

        Explanation:
        - XOR property: x ^ x = 0 and x ^ 0 = x
        - This works because XOR cancels out duplicate bits.
        - No extra memory (temporary variable) is needed.
    */

    a = a ^ b;
    b = a ^ b;
    a = a ^ b;

    printf("After Swap : a = %d, b = %d\n", a, b);

    return 0;
}
