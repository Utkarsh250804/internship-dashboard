#include<stdio.h>

/*Exercise 2
Write a C program that takes an integer array as input and finds the 
second largest element using a function.*/

void second_Largest(int arr[], int size){
    int i , first = arr[0], second = arr[0];

    for(i = 0; i < size; i++){
        if(arr[i] > first){
            second = first;
            first = arr[i];
        }else if (arr[i] > second && arr[i] != first){
            second = arr[i];
        }
    }

    printf("The second largest element is: %d\n", second);
}


int main(){
    int arr[10], n;
    printf("Enter the size of the array (max 10):");
    scanf("%d", &n);
    printf("Enter the elements of the array:\n");
    for(int i = 0;i< n;i++){
        scanf("%d", &arr[i]);
    }

    second_Largest(arr, n);


    return 0;
}