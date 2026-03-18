#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    if (argc != 3)
    {
        printf("Usage: %s <number> <bit_position>\n", argv[0]);
        printf("Example: %s 10 1\n", argv[0]);
        return 0;
    }

    int num = atoi(argv[1]);
    int pos = atoi(argv[2]);

    printf("Original Number = %d\n", num);

    // Check bit
    if (num & (1 << pos))
        printf("Bit at position %d is: 1\n", pos);
    else
        printf("Bit at position %d is: 0\n", pos);

    // Set bit
    int setBit = num | (1 << pos);
    printf("After Setting bit %d : %d\n", pos, setBit);

    // Clear bit
    int clearBit = num & ~(1 << pos);
    printf("After Clearing bit %d: %d\n", pos, clearBit);

    // Toggle bit
    int toggleBit = num ^ (1 << pos);
    printf("After Toggling bit %d: %d\n", pos, toggleBit);

    // Left shift
    printf("Left Shift by 1: %d\n", num << 1);

    // Right shift
    printf("Right Shift by 1: %d\n", num >> 1);

    return 0;
}
