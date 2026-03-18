from collections import deque
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None 
        self.right = None





def insert(root, value):
    if root is None:
        return Node(value)
    
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    
    return root



def inorder_traversal(root):
    temp = deque()
    temp.append(root)

    while temp:
        front = temp.popleft()
        print(front.value, end =" ")
        
        if front.left:
            temp.append(front.left)
        if front.right:
            temp.append(front.right)



node  = Node(10)
insert(node, 5)
insert(node, 15)
insert(node, 3)
insert(node, 7)
insert(node, 12)

inorder_traversal(node)

    
