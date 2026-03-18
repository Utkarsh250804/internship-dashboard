#include<stdio.h>


// Determine the LCM of two numbers
// Exercise  : Write a C program to find the LCM of two numbers and then verify it by listing several common multiples.


void verify_LCM (int lcm, int arr[]){
    for(int i = 0;i<10;i++){
        if(lcm%arr[i] == 0){
            printf("%d is multiple of %d So LCM is verified\n", lcm, arr[i]);
        }
    }
}

void LCM_of_TwoNumbers(){




    int arr[10] = {0};
    int index = 0;
    int lcm = 1;
    int num = 2;
    int a,b, temp1, temp2;

    printf("Enter two numbers to find LCM:");
    scanf("%d %d", &a, &b);
    
    temp1 = a, temp2  = b;
    while(temp1>1 && temp2>1){

        if(temp1%num == 0 && temp2%num == 0){
            arr[index] != num && index<10?  arr[index++] = num : 0;
            temp1 = temp1/num;
            temp2 = temp2/num;
            lcm *=num;
        }
        else if(temp1%num == 0){
            arr[index] != num && index<10?  arr[index++] = num : 0;
                temp1 = temp1/num;
            lcm *=num;

        }
        else if(temp2%num == 0){
            arr[index] != num && index<10?  arr[index++] = num : 0;
            temp2 = temp2/num;
            lcm *=num;

        }
        else{
            num++;
        }
    }



    printf("LCM of %d and %d is: %d\n", a, b, lcm);


    verify_LCM(lcm, arr);
    
}



// Exercise 2 : Sum of First N Natural Numbers 
void  sumOfN_Number(){
    int n ;
    printf("Enter a number N to find sum of first N number:");
    scanf("%d", &n);
    int sum =  (n*(n+1))/2;
    printf("Sum of first %d natural numbers is: %d\n", n, sum);
}



int main(){

    printf("\n++++++++++++++++++++++++++++++++\n");
    printf("\n++++++++++++++++++++++++++++++++\n");
    
    printf("For Lcm Choose 1 \n For Sum of N Natural Numbers Choose 2\n");
    int choice;
    scanf("%d", &choice);

    if(choice == 1){
        LCM_of_TwoNumbers();
    }
    else if(choice == 2){
        sumOfN_Number();    
    }else {
        printf("Invalid Choice\n");
    }

    return 0;
}