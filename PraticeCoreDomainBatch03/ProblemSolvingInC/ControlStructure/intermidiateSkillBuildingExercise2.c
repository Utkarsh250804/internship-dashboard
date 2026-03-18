#include<stdio.h>



/*
    Exercise 2
    Pyramid Pattern Printing 
    Exercise 
    Create a program that prints the following pattern using nested for 
    loops:
    *
    * *
    * * *
    * * * *
    * * * * *
*/
int main(){
    int n;
    printf("Enter the number:");
    scanf("%d", &n);

    for(int i = 0;i<n;i++){
        for(int j = 0;j<n;j++){
            if(j<=i){
                printf("*");
            }
        }
        printf("\n");
    }
}