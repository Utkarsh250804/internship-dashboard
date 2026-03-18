from typing import Generic, TypeVar

T = TypeVar('T')

# =================================================
# Generic Stack Class
# =================================================
class Stack(Generic[T]):
    def __init__(self):
        self.items = []

    def push(self, item: T):
        self.items.append(item)
        print(f"Pushed: {item}")

    def pop(self) -> T:
        if self.is_empty():
            raise IndexError("Pop from empty stack")
        return self.items.pop()

    def peek(self) -> T:
        if self.is_empty():
            raise IndexError("Peek from empty stack")
        return self.items[-1]

    def is_empty(self) -> bool:
        return len(self.items) == 0


# =================================================
# Main Program (Testing Generic Stack)
# =================================================
if __name__ == "__main__":

    print("=== Integer Stack ===")
    int_stack = Stack[int]()
    int_stack.push(10)
    int_stack.push(20)
    print("Top element:", int_stack.peek())
    print("Popped:", int_stack.pop())

    print("\n=== String Stack ===")
    str_stack = Stack[str]()
    str_stack.push("Python")
    str_stack.push("Templates")
    print("Top element:", str_stack.peek())
    print("Popped:", str_stack.pop())
