#include <stdio.h>

/*
    Exercise 1
        Suppose you are given an array of integers and a string as input.
        Perform the following tasks:
            a) Write a recursive function to find the maximum value in the
            array without using the in-built function.
            b) Count the number of vowels in the given string using an
            iterative approach.    
*/


void findMaxRecursive(int arr[], int n, int *maxi){
    if(n == 0){
        return ;
    }
    if(arr[n-1] > *maxi){
        *maxi = arr[n-1];
    }
    return findMaxRecursive(arr, n-1, maxi);
}

int countVowelsIterative(char str[]){
    int count = 0;
    for(int i = 0; str[i] != '\0'; i++){
        char ch = str[i];
        if(ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' ||
           ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U'){
            count++;
        }
    }
    return count;
}


int main (){
    int arr[10];
    printf("Enter the size of array (max 10): ");
    int size;
    scanf("%d", &size);
    printf("Enter %d elements of the array:\n", size);
    for(int i = 0; i < size; i++){
        scanf("%d", &arr[i]);
    }
    int maxi = arr[0];
    findMaxRecursive(arr, size, &maxi);
    printf("Maximum value in the array is: %d\n", maxi);
    char str[100];

    printf("Enter a string: ");
    scanf(" %[^\n]s", str);
    int vowelCount = countVowelsIterative(str);
    printf("Number of vowels in the string: %d\n", vowelCount);
    
    return 0;
}