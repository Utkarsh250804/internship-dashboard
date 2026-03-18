'''
Docstring for Array&Linklist.AdvanceSkillBuildingExercise.AdvanceSkillBuildingExercise1a
Given a linked list, write a program to reverse the nodes of the list in 
groups of size k. If the number of nodes is not a multiple of k, leave 
the remaining nodes as they are.
What is the time complexity of your approach for reversing nodes in 
groups of size k and how does the size of k affect the overall time 
complexity?
'''
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class Linklist:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def append(self, data):
        new_node = Node(data)
        self.size += 1
        if not self.head:
            self.head = new_node
            self.tail = new_node
            return

        temp = self.head
        while temp.next:
            temp = temp.next
        temp.next = new_node
        self.tail = new_node

    
    def display(self):
        curr = self.head

        while curr:
            print(f"{curr.data} ->",end=" ")
            curr = curr.next
        
    
def reverseKgroup(list, k):
    def rev(list, k):
        prev = None 
        curr = list
        temp = None
        count = 0
        while curr and count < k:
            temp = curr.next
            curr.next = prev
            prev = curr
            curr = temp
            count += 1
        
        return prev, curr

    no_of_groups = list.size // k

    prev_head = list.head
    new_head, rem = rev(list.head, k)
    list.head.next = rem 
    list.head = new_head

    while no_of_groups > 1:
        temp_head = rem
        rev_head, rem = rev(temp_head, k)
        prev_head.next = rev_head
        temp_head.next = rem
        prev_head = temp_head
        no_of_groups -= 1
    
    return list



node = Linklist()

for i in range(1, 11):
    node.append(i)

k = 3
node.display()
print()

reversed_list = reverseKgroup(node, k)
reversed_list.display()


       

