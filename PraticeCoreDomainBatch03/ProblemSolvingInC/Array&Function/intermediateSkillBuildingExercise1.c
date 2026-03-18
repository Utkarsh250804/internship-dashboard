#include <stdio.h>

/*Exercise 1
Write a C program that takes an integer array and a shift value as input. 
Implement a function to perform a circular shift on the array elements.*/



// reverse a array 
void rev(int arr[], int s, int e){
	while(s<=e){
		int temp = arr[s];
		arr[s++] = arr[e];
		arr[e--] = temp;
	}
}

void print(int arr[], int size){
	printf("The array is : ");
	for(int i = 0; i < size;i++){
		printf("%d, ", arr[i]);
	}
	printf("\n");
}

int main(){
	int arr[10], n, shift;
	printf("Enter the size of the array (max[10]):");
	scanf("%d", &n);
	
	printf("Enter the elements of the array:\n");
	for(int i = 0;i<n;i++){
		scanf("%d", &arr[i]);
	}
	
	printf("Enter the number of circular shift:");
	scanf("%d", &shift);

	shift  = shift%n;
	
	printf("\nBefore the shifting \n");
	print(arr,n);
	
	rev(arr,0,n-1);
	rev(arr,0, shift-1);
	rev(arr, shift, n-1);
	
	printf("\n After the shifting\n");
	print(arr, n);


	
	
	
	return 0;
}