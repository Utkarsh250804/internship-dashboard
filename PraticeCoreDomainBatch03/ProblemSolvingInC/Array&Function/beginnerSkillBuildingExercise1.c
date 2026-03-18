#include<stdio.h>

/*
Exercise 1
Write a C program that takes an array of integers as input and 
finds the smallest element using a function
*/



// find mininum element in array 
void mini(int arr[], int size)
{ 	
	int mini = arr[0];
	for(int i = 0;i<size;i++){
		mini = mini > arr[i]? arr[i]:mini;
	}
	
	printf("The minimum element in array is %d.", mini);
}


int main(){
    int arr[10], n;
    printf("Enter number of elements:");
    scanf("%d", &n);
	printf("Enter the elements of array:");


	for(int i = 0;i<n;i++){
	scanf("%d", &arr[i]);
	}

	mini(arr,n);

    return 0;

}