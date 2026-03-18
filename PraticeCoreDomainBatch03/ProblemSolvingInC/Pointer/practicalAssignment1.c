#include <stdio.h>
#include <stdlib.h>


/* Add elements */
void addElement(int **arr, int *size) {
    int n, i;
    printf("Enter number of elements to add: ");
    scanf("%d", &n);

    *arr = realloc(*arr, (*size + n) * sizeof(int));

    for (i = *size; i < *size + n; i++) {
        printf("Enter element %d: ", i + 1);
        scanf("%d", &(*arr)[i]);
    }
    *size = *size + n;
}

/* Remove element */
void removeElement(int **arr, int *size) {
    int pos, i;

    if (*size == 0) {
        printf("Array is empty!\n");
        return;
    }

    printf("Enter position to remove (1 to %d): ", *size);
    scanf("%d", &pos);

    if (pos < 1 || pos > *size) {
        printf("Invalid position!\n");
        return;
    }

    for (i = pos - 1; i < *size - 1; i++) {
        (*arr)[i] = (*arr)[i + 1];
    }

    (*size)--;
    *arr = realloc(*arr, (*size) * sizeof(int));
    printf("Element removed successfully.\n");
}

/* Display array */
void displayArray(int *arr, int size) {
    int i;

    if (size == 0) {
        printf("Array is empty!\n");
        return;
    }

    printf("Array elements: ");
    for (i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/* Resize array */
void resizeArray(int **arr, int *size) {
    int newSize, i;

    printf("Enter new size: ");
    scanf("%d", &newSize);

    *arr = realloc(*arr, newSize * sizeof(int));

    if (newSize > *size) {
        for (i = *size; i < newSize; i++) {
            (*arr)[i] = 0;
        }
    }

    *size = newSize;
    printf("Array resized successfully.\n");
}

/* Search element */
void searchElement(int *arr, int size) {
    int value, i, found = 0;

    if (size == 0) {
        printf("Array is empty!\n");
        return;
    }

    printf("Enter element to search: ");
    scanf("%d", &value);

    for (i = 0; i < size; i++) {
        if (arr[i] == value) {
            printf("Element found at position %d\n", i + 1);
            found = 1;
            break;
        }
    }

    if (!found) {
        printf("Element not found!\n");
    }
}

int main() {
    int *arr = NULL;
    int size = 0;
    int choice;

    while (1) {
        printf("\n===== Dynamic Array Menu =====\n");
        printf("1. Add elements\n");
        printf("2. Remove an element\n");
        printf("3. Display elements\n");
        printf("4. Reallocate array size\n");
        printf("5. Search an element\n");
        printf("6. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
        case 1:
            addElement(&arr, &size);
            break;
        case 2:
            removeElement(&arr, &size);
            break;
        case 3:
            displayArray(arr, size);
            break;
        case 4:
            resizeArray(&arr, &size);
            break;
        case 5:
            searchElement(arr, size);
            break;
        case 6:
            free(arr);
            printf("Memory freed. Program exited.\n");
            return 0;
        default:
            printf("Invalid choice!\n");
        }
    }
}
