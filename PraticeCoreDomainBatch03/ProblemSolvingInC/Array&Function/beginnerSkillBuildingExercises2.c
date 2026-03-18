#include<stdio.h>

/*Write a C program that takes an array of integers as input and  
reverses it using a function.*/

void rev(int arr[], int size){
	int s = 0, e = size-1;
	while(s<e){
		int temp = arr[s];
		arr[s] = arr[e];
		arr[e] = temp;
		s++, e--;
	}
	
}


void print(int arr[], int size){
	for(int i = 0;i<size;i++){
		printf("%d, ",arr[i]);
	}
	printf("\n");
}


int main(){


	int arr[20], n;

	printf("Enter the number:");
	scanf("%d",&n);
	
	printf("Enter the elements of an array:");
	for(int i = 0;i<n;i++){
		scanf("%d",&arr[i]);
	}

	printf("\nBefore Reverse the array: ");
	print(arr, n);
	
	rev(arr, n);
	printf("\nAfter Reverse the array : ");
	print(arr, n);
	

    return 0;
}