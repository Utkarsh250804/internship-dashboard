#include<stdio.h>

/*

    Exercise 1
    Integrated Control Structures
    Exercise 
    Develop a menu-driven program that allows users to:
    1.Check if a number is prime
    2.Generate Fibonacci series upto n terms
    3.Check if a number is palindrome
    4. Exit the program

*/

void checkPrime(){
    int n ;
    // taking input from user 
    printf("Enter a number:");
    scanf("%d",&n);

    int  isprime = 1 ;


    // check prime number logic   
    for(int i =2;  i * i <= n ; i++){

        if( n % i == 0){
            isprime = 0 ;
            break;
        }
    }

    // check and print result   
    if( isprime == 1 && n > 1){
        printf("%d is a prime number\n",n);
    }else {
        printf("%d is not a prime number\n",n);
    }

}


void fibonacciSeries(){
    int n;

    // taking input 
    printf("Enter number of terms:");
    scanf("%d",&n);
    int a = 0, b = 1 ;

    for(int i = 0 ; i < n ; i++){
        printf("%d ",a);
        int next = a + b ;
        a = b ;
        b = next ;
    }

}


void checkPalindrome(){
    int n , reversed = 0, num;

    // taking input 

    printf("Enter a number");
    scanf("%d", &n);
    num = n;

    while(n != 0){
        reversed = reversed*10 + n % 10 ;
        n = n / 10 ;
    }

    if( reversed == num){
        printf("%d is a palindrome number\n",num);
    } else {
        printf("%d is not a palindrome number\n",num);
    }
}

int main(){
    
    int choice;

    printf("\n++++++++++++++++++++++++++++++++++++\n");
    printf("\n++++++++++++++++++++++++++++++++++++\n");
    printf("\nWelcome to Our programm\n");
    printf("\n   Menu Options \n");
    printf("1. Check prime number\n");
    printf("2. Generate fibonacci series\n");
    printf("3. check palindrome number \n");
    printf("4. Exit\n");
    printf("\n++++++++++++++++++++++++++++++++++++\n");
    printf("\n++++++++++++++++++++++++++++++++++++\n");

    
    while(1){
        printf("\n\n++++++++++++++\n\n");
        printf("Enter your choice:\n");
        scanf("%d", &choice);
        switch(choice){
            case 1:
                checkPrime();
                break;
            case 2:
                fibonacciSeries();
                break;
            case 3:
                checkPalindrome();
                break;
            case 4:
                printf("\nExiting the program. Goodbye!\n");
                return 0;
            default:
                printf("\nInvalid Choice\n");
        }
    }
    

    return 0;
}