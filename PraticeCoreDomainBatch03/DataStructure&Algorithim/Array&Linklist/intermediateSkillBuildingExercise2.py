'''
Exercise 2
Remove Duplicates from Unsorted Linked List
Write a program to remove duplicates from an unsorted linked list?
Input: 1 -> 2 -> 3 -> 2 -> 4 -> 3
Output: 1 -> 2 -> 3 -> 4
What is the time complexity of your solution for removing duplicates 
from the unsorted linked list?'''


#create a Node class 
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

#create A linklist 
class LinkedList:
    def __init__(self):
        self.head = None

    def insertAtHead(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node


    def append(self, data):

        new_node = Node(data)
        if self.head is None:
            self.head = new_node
            return 
        
        temp = self.head
        while temp.next:
            temp = temp.next
        temp.next = new_node

    def display(self):

        if self.head is None:
            print("Linklist is empty ")
        temp = self.head

        while temp.next:
            print(f"{temp.data} -> ", end="")
            temp = temp.next
        print(temp.data)
        

def removeDuplicates(list):
    curr = list.head
    prev = None

    while curr:
        next = curr.next
        while next is not None and next.data != curr.data :
            prev = next
            next = next.next
        
        if next is not None:
            prev.next = next.next 
        
        curr = curr.next



node = LinkedList()

size = int(input("Enter the size of the linked list: "))

for i in range(size):
    data = int(input(f"Enter the {i} element: "))
    node.append(data)

print("The original linked list is :")
node.display()

print("The linked list after removing duplicates is :")
removeDuplicates(node)
node.display()

