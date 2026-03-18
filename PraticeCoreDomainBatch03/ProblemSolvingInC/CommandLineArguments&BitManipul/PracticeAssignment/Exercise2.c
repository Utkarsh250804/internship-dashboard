#include <stdio.h>
#include <stdlib.h>

// ---------- Function to parse integer from command line ----------
int parseArg(char *arg)
{
    return atoi(arg);
}

// ---------- Bit Manipulation Functions ----------
int checkBit(int num, int pos)
{
    return (num & (1 << pos)) != 0;
}

int setBit(int num, int pos)
{
    return num | (1 << pos);
}

int clearBit(int num, int pos)
{
    return num & ~(1 << pos);
}

int toggleBit(int num, int pos)
{
    return num ^ (1 << pos);
}

int leftShift(int num, int n)
{
    return num << n;
}

int rightShift(int num, int n)
{
    return num >> n;
}

// ---------- Main Program ----------
int main(int argc, char *argv[])
{
    if (argc != 4)
    {
        printf("Usage: %s <number> <bit_position> <shift>\n", argv[0]);
        printf("Example: %s 10 1 2\n", argv[0]);
        return 0;
    }

    int num = parseArg(argv[1]);
    int pos = parseArg(argv[2]);
    int shift = parseArg(argv[3]);

    printf("\n========== Efficient Data Handling ==========\n");
    printf("Input Number   : %d\n", num);
    printf("Bit Position   : %d\n", pos);
    printf("Shift Value    : %d\n", shift);
    printf("============================================\n");

    // Check bit
    printf("\n[1] Check Bit\n");
    printf("Bit at position %d is: %d\n", pos, checkBit(num, pos));

    // Set bit
    printf("\n[2] Set Bit\n");
    printf("After setting bit %d : %d\n", pos, setBit(num, pos));

    // Clear bit
    printf("\n[3] Clear Bit\n");
    printf("After clearing bit %d: %d\n", pos, clearBit(num, pos));

    // Toggle bit
    printf("\n[4] Toggle Bit\n");
    printf("After toggling bit %d: %d\n", pos, toggleBit(num, pos));

    // Basic bitwise operations (demo with a sample value)
    int demo = 5;
    printf("\n[5] Basic Bitwise Operations (with demo value = %d)\n", demo);
    printf("num AND demo : %d\n", num & demo);
    printf("num OR demo  : %d\n", num | demo);
    printf("num XOR demo : %d\n", num ^ demo);
    printf("NOT num      : %d\n", ~num);

    // Shifting
    printf("\n[6] Shift Operations\n");
    printf("Left Shift  by %d: %d\n", shift, leftShift(num, shift));
    printf("Right Shift by %d: %d\n", shift, rightShift(num, shift));

    printf("\n========== Program Completed Successfully ==========\n");

    return 0;
}
