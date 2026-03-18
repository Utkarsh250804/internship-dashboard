#include <stdio.h>


/* Pointer Basics */
void pointerBasics() {
    int a = 10;
    int *p = &a;

    printf("\nPointer Basics:\n");
    printf("Value of a = %d\n", a);
    printf("Address of a = %p\n", &a);
    printf("Value using pointer = %d\n", *p);
}

/* Pointer Arithmetic */
void pointerArithmetic() {
    int arr[3] = {10, 20, 30};
    int *p = arr;
    
    printf("\nPointer Arithmetic:\n");
    printf("First element = %d\n", *p);
    printf("Second element = %d\n", *(p + 1));
    printf("Third element = %d\n", *(p + 2));
}

/* Pointers and Arrays */
void pointerWithArray() {
    int arr[5];
    int *p = arr;
    int i;
    
    printf("\nEnter 5 elements:\n");
    for (i = 0; i < 5; i++) {
        scanf("%d", p + i);
    }
    
    printf("Array elements using pointer:\n");
    for (i = 0; i < 5; i++) {
        printf("%d ", *(p + i));
    }
    printf("\n");
}

/* Pointer to Function */
void pointerToFunction(int (*fun)(int, int)) {
    int x = 5, y = 3;
    int result = fun(x, y);

    printf("\nPointer to Function:\n");
    printf("Addition result = %d\n", result);
}

/* Function used for function pointer */
int add(int a, int b) {
    return a + b;
}
/* ===== main function ===== */
int main() {
    int choice;

    while (1) {
        printf("\n===== Pointer Operations Menu =====\n");
        printf("1. Pointer Basics\n");
        printf("2. Pointer Arithmetic\n");
        printf("3. Pointers and Arrays\n");
        printf("4. Pointers to Functions\n");
        printf("5. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
        case 1:
            pointerBasics();
            break;
        case 2:
            pointerArithmetic();
            break;
        case 3:
            pointerWithArray();
            break;
        case 4:
            pointerToFunction(add);
            break;
        case 5:
            printf("Program exited.\n");
            return 0;
        default:
            printf("Invalid choice!\n");
        }
    }
}
