#include <stdio.h>
#include <stdlib.h>


struct DoubleNode{
    int data;
    struct DoubleNode* prev;
    struct DoubleNode* next;
};

struct circularNode{
    int data;
    struct circularNode* next;
};


void createDoubleNode(struct DoubleNode** head ,int data){
    struct DoubleNode* temp ;

    if (*head == NULL){
        temp = (struct DoubleNode*) malloc(sizeof(struct DoubleNode));
        temp->data = data;
        temp->prev = NULL;
        temp->next = NULL;
        *head = temp;
    }
    else{
        struct DoubleNode* curr = *head;
        while (curr->next != NULL){
            curr = curr->next;
        }
        temp = (struct DoubleNode*)malloc(sizeof(struct DoubleNode));
        temp->data = data;
        temp->prev = curr;
        temp->next = NULL;
        curr->next = temp;
    }
}

void createCircularNode(struct circularNode** head, int data){
    struct circularNode* temp;

    if (*head == NULL){
        temp = (struct circularNode*)malloc(sizeof(struct circularNode));
        temp->data = data;
        temp->next = temp; 
        *head = temp;
    }
    else{
        struct circularNode* curr = *head;
        while (curr->next != *head){
            curr = curr->next;
        }
        temp = (struct circularNode*)malloc(sizeof(struct circularNode));
        temp->data = data;
        temp->next = *head; 
        curr->next = temp;
    }
}


void displayDoubleNode(struct DoubleNode* head){
    struct DoubleNode* curr = head;
    while (curr != NULL){
        printf("%d ", curr->data);
        curr = curr->next;
    }
    printf("\n");
}

void displayCircularNode(struct circularNode* head){
    if (head == NULL) return;

    struct circularNode* curr = head;
    do {
        printf("%d ", curr->data);
        curr = curr->next;
    } while (curr != head);
    printf("\n");
}


void insertAtBeginningDoubly(struct DoubleNode *head, int position){
    struct DoubleNode *curr = head;
    int i = 1;
    while(i<position){
        curr = curr ->next;
        i++;
    }
    
    
}
int main() { 
    struct DoubleNode* doubleHead = NULL;
    struct circularNode* circularHead = NULL;

    createDoubleNode(&doubleHead, 10);
    createDoubleNode(&doubleHead, 20);
    createDoubleNode(&doubleHead, 30);

    createCircularNode(&circularHead, 1);
    createCircularNode(&circularHead, 2);
    createCircularNode(&circularHead, 3);

    printf("Doubly Linked List: ");
    displayDoubleNode(doubleHead);

    printf("Circular Linked List: ");
    displayCircularNode(circularHead);

    return 0;
}