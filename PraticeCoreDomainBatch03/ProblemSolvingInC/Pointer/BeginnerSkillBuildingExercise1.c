#include <stdio.h>
#include <stdlib.h>

int *allocate()
{
    int *ptr = (int *)malloc(sizeof(int));
    *ptr = 5;
    return ptr;
}

int main()
{
    int *a = allocate();
    a = allocate();
    printf("%d", *a);

    free(a);
    return 0;
}