#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

unsigned int countSetBits(unsigned int x) {
    unsigned int count = 0;
    while (x) {
        count += (x & 1);
        x >>= 1;
    }
    return count;
}

int isPowerOf2(unsigned int x) {
    // power of 2 means only one bit set
    return (x != 0) && ((x & (x - 1)) == 0);
}

unsigned int toggleBits(unsigned int x) {
    return ~x;   // flip all bits
}

unsigned int circularLeftShift(unsigned int x, unsigned int n) {
    unsigned int bits = sizeof(unsigned int) * 8;
    n = n % bits;  // avoid extra shifting

    return (x << n) | (x >> (bits - n));
}

void printBinary(unsigned int x) {
    unsigned int bits = sizeof(unsigned int) * 8;
    for (int i = bits - 1; i >= 0; i--) {
        printf("%d", (x >> i) & 1);
        if (i % 4 == 0) printf(" "); // spacing for readability
    }
}

int main(int argc, char *argv[]) {

    if (argc < 3) {
        printf("Usage: %s <shift_n> <num1> <num2> ...\n", argv[0]);
        printf("Example: %s 3 10 16 7\n", argv[0]);
        return 0;
    }

    unsigned int shiftN = (unsigned int)atoi(argv[1]);

    printf("Circular Left Shift = %u positions\n", shiftN);
    printf("------------------------------------------------------------\n");

    for (int i = 2; i < argc; i++) {
        unsigned int num = (unsigned int)atoi(argv[i]);

        unsigned int setBits = countSetBits(num);
        int power2 = isPowerOf2(num);
        unsigned int toggled = toggleBits(num);
        unsigned int rotated = circularLeftShift(num, shiftN);

        printf("\nNumber: %u\n", num);

        printf("Binary: ");
        printBinary(num);
        printf("\n");

        printf("Set Bits Count: %u\n", setBits);

        printf("Power of 2? : %s\n", power2 ? "YES" : "NO");

        printf("Toggled (~num): %u\n", toggled);
        printf("Binary: ");
        printBinary(toggled);
        printf("\n");

        printf("Circular Left Shift Result: %u\n", rotated);
        printf("Binary: ");
        printBinary(rotated);
        printf("\n");

        printf("------------------------------------------------------------\n");
    }

    return 0;
}
