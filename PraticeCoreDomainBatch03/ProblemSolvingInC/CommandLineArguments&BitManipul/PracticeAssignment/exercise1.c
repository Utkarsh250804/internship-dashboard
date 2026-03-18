#include <stdio.h>
#include <stdlib.h>

unsigned int countSetBits(unsigned int x) {
    unsigned int count = 0;
    while (x) {
        count += (x & 1);
        x >>= 1;
    }
    return count;
}

void printBinary(unsigned int x) {
    int bits = sizeof(unsigned int) * 8;
    for (int i = bits - 1; i >= 0; i--) {
        printf("%d", (x >> i) & 1);
        if (i % 4 == 0) printf(" ");
    }
}

int main(int argc, char *argv[]) {

    if (argc < 2) {
        printf("Usage: %s <num1> <num2> <num3> ...\n", argv[0]);
        return 0;
    }

    unsigned int commonBits;
    unsigned int xorResult = 0;

    // initialize commonBits with first number
    commonBits = (unsigned int)atoi(argv[1]);

    printf("----- Set Bits Count for Each Number -----\n");

    for (int i = 1; i < argc; i++) {
        unsigned int num = (unsigned int)atoi(argv[i]);

        unsigned int setBits = countSetBits(num);
        printf("\nNumber: %u\n", num);
        printf("Binary: ");
        printBinary(num);
        printf("\nSet Bits Count: %u\n", setBits);

        // common set bits using AND
        commonBits &= num;

        // XOR of all numbers
        xorResult ^= num;
    }

    printf("\n==========================================\n");
    printf("Common Set Bits (AND of all numbers): %u\n", commonBits);
    printf("Binary: ");
    printBinary(commonBits);
    printf("\n");

    printf("\nXOR of all numbers: %u\n", xorResult);
    printf("Binary: ");
    printBinary(xorResult);
    printf("\n");

    return 0;
}
