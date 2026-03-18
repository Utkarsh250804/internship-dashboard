
#include <stdio.h>

// Minimum and maximum element
void  minMax(int arr[], int size) {
	int min = arr[0], max =arr[0];

	for(int i = 0; i< size; i++) {
		if(max < arr[i]) {
			max = arr[i];
		}
		if (min > arr[i]) {
			min = arr[i];
		}
	}

	printf("Maximum Element: %d \n Minimum Element: %d\n", max, min);
}

// find sum and average element
void sumAverage(int arr[], int size) {

	int sum = 0;

	for(int i = 0; i< size; i++) {
		sum += arr[i];
	}


	printf("Sum : %d \n  average : %f\n", sum, sum/size);

}


// reverse Array

void rev(int arr[], int size) {

	int i = 0, e = size-1;

	while(i<=e) {
		int temp = arr[i];
		arr[i] = arr[e];
		arr[e] = temp;
		i++, e--;
	}

	for(int i = 0; i<size; i++) {
		printf("%d ", arr[i]);
	}
}

// binary  Searyc in arry
int   binarySearch(int arr[], int size, int target) {

	int s = 0, e = size-1;
	while(s<=e) {
		int mid = s +  (e-s)/2;

		if(target == arr[mid]) {
			return mid;
		}
		else if (target < arr[mid]) {
			e = mid-1;
		} else {
			s = mid+1;
		}

	}

	return -1;
}


// Bubble sort

void bubbleSort(int arr[], int size ) {

	for(int i = 0; i<size; i++) {
		for(int j = 0; j<size-1; j++) {
			if(arr[j] > arr[j+1] ) {
				int temp = arr[j];
				arr[j] = arr[j+1];
				arr[j+1] = temp;
			}
		}
	}
}

// Display

void print(int arr[], int size) {
	for(int i = 0; i<size; i++) {
		printf("%d ", arr[i]);
	}

	printf("\n");
}



int main()
{
	int arr[50];


	int size, choice;

	// Input Size
	printf("Enter the size of array :");
	scanf("%d", &size);

	// input element
	printf("Enter the array element");
	for(int i = 0; i < size; i++) {
		scanf("%d", &arr[i]);
	}

	int i  = 0;
	do {

		printf("\n=============================================== \n ");
		printf("\n=============================================== \n ");
		printf("Welcome to Our Programm \n");
		printf("Press Key 1 for Find Maximum &minimum \n");
		printf("Press Key 2 for Find Sum & Average \n");
		printf("Press Key 3 for binarySearch \n");
		printf("Press Key 4 for Find Soring a array \n");
		printf("Press Key 5 for Find Reverse Array \n");
		printf("Press Key 6 for Display Array \n ");
		printf("Press Key 7 for Exit \n ");
		printf("\n=============================================== \n ");
		printf("\n=============================================== \n ");
		scanf("%d", &choice);


		switch(choice) {
		case 1:
			printf("\n Minimum & Maximum \n");
			minMax(arr,size);
			break;
		case 2:
			printf("\n sum  & average \n");
			sumAverage(arr,size);
			break;
		case 3:
			printf("\n binarySearch \n");
			printf("\n for binary search  we sort a arary  ");
			bubbleSort(arr,size);
			printf("Enter a target ");
			int target ;
			scanf("%d", &target);
			int ind = binarySearch(arr, size, target);
			printf("Target = %d \t index = %d", target, ind);
			break;
		case 4:
			printf("\n Sort  Array \n");
			bubbleSort(arr,size);
			break;
		case 5:
			printf("\n Reverse Array \n");
			rev(arr,size);
			break;
		case 6:
			printf("\n Display Array  \n");
			print(arr, size);
			break;
		case 7:
			printf("\n Exit \n ");
			break;
		default:
			printf("Invalid Input");

		}
		i++;

	} while(i <5);

	return 0;
}