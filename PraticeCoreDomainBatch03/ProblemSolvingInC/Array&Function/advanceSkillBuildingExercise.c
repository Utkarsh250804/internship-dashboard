/* Exercise 1
Write a program in C to create a generic QuickSort function using function 
pointers to sort arrays of different data types. */


#include <stdio.h>
#include <string.h>
#include <stdio.h>
#include <string.h>

/* 
   Simple swap function
   size = size of one element
*/
void swapData(void *a, void *b, int size)
{
    char temp[100];   // beginner style fixed buffer

    memcpy(temp, a, size);
    memcpy(a, b, size);
    memcpy(b, temp, size);
}

/* 
   Partition logic of quick sort
*/
int getPartition(void *arr, int low, int high, int size,
                 int (*compare)(void *, void *))
{
    char *array = (char *)arr;
    void *pivot = array + high * size;

    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (compare(array + j * size, pivot) < 0) {
            i++;
            swapData(array + i * size, array + j * size, size);
        }
    }

    swapData(array + (i + 1) * size, array + high * size, size);
    return i + 1;
}

/* 
   Generic QuickSort function
*/
void quickSort(void *arr, int low, int high, int size,
               int (*compare)(void *, void *))
{
    if (low < high) {
        int pos = getPartition(arr, low, high, size, compare);

        quickSort(arr, low, pos - 1, size, compare);
        quickSort(arr, pos + 1, high, size, compare);
    }
}

/* Compare integers */
int compareInt(void *a, void *b)
{
    return (*(int *)a - *(int *)b);
}

/* Compare floats */
int compareFloat(void *a, void *b)
{
    float x = *(float *)a;
    float y = *(float *)b;

    if (x > y)
        return 1;
    else if (x < y)
        return -1;
    else
        return 0;
}

/* Main function */
int main()
{
    int arr[] = {7, 2, 5, 1, 9};
    float fArr[] = {2.5, 1.1, 3.6, 0.9};

    int n = 5;
    int m = 4;

    quickSort(arr, 0, n - 1, sizeof(int), compareInt);
    quickSort(fArr, 0, m - 1, sizeof(float), compareFloat);

    printf("Sorted int array:\n");
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);

    printf("\n\nSorted float array:\n");
    for (int i = 0; i < m; i++)
        printf("%.1f ", fArr[i]);

    return 0;
}
