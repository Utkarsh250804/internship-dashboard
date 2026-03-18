#include<stdio.h>


void NullPtrFunc(){

    // Initialize a null pointer

    int *ptr = NULL;

}

void DanglingPtrFunc(){
    // Dangling pointer 

    int *ptr = (int *) malloc(sizeof(int));
    *ptr = 10;

    free(ptr);  // ptr is now a dangling pointer

    // Accessing dangling pointer (undefined behavior)
}

void WildPtrFunc(){
    // Wild pointer

    int *ptr;  // Uninitialized pointer (wild pointer)

    // Accessing wild pointer (undefined behavior)
}


int main(){

    NullPtrFunc();
    DanglingPtrFunc();
    WildPtrFunc();

    return 0;
}