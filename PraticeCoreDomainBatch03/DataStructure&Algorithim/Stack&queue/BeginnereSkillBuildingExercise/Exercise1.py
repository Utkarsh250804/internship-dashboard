
class Stack:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("pop from empty stack")

    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        raise IndexError("peek from empty stack")

    def size(self):
        return len(self.items)



def insertAtBottom(stk, item):
    if stk.is_empty():
        stk.push(item)
        return
    temp = stk.pop()
    insertAtBottom(stk, item)
    stk.push(temp)

def revereStack(stk):
    if stk.is_empty():
        return
    temp = stk.pop()
    revereStack(stk)
    insertAtBottom(stk, temp)


stk = Stack()
stk.push(1)
stk.push(2)
stk.push(3)


revereStack(stk)


while not stk.is_empty():
    print(stk.pop())
