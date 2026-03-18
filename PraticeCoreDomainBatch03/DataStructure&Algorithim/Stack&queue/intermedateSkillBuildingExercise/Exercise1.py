

class Stack:
    def __init__(self):
        self.top = None

class Node:
    def __init__(self, data, nxt=None):
        self.data = data
        self.next = nxt

def isEmpty(s):
    return s.top is None

def push(s, x):
    s.top = Node(x, s.top)

def pop(s):
    if isEmpty(s):
        return None
    x = s.top.data
    s.top = s.top.next
    return x

def peek(s):
    if isEmpty(s):
        return None
    return s.top.data

def sort_stack_using_another_stack(A):
    B = Stack()   # helper stack

    while not isEmpty(A):
        temp = pop(A)

        # Move bigger elements from B back to A
        while not isEmpty(B) and peek(B) > temp:
            push(A, pop(B))

        push(B, temp)

    # Move sorted elements back to A
    while not isEmpty(B):
        push(A, pop(B))

    return A

# ----------- Print Stack (Top -> Bottom) -----------
def print_stack(s):
    curr = s.top
    print("Top -> ", end="")
    while curr:
        print(curr.data, end=" ")
        curr = curr.next
    print()

# ----------- Example -----------
A = Stack()
push(A, 3)
push(A, 1)
push(A, 4)
push(A, 2)

print("Before sorting:")
print_stack(A)

sort_stack_using_another_stack(A)

print("After sorting (Ascending):")
print_stack(A)
