from typing import Generic, TypeVar

T = TypeVar('T')

# =================================================
# Generic Queue Class
# =================================================
class Queue(Generic[T]):
    def __init__(self):
        self.items = []

    def enqueue(self, item: T):
        self.items.append(item)
        print(f"Enqueued: {item}")

    def dequeue(self) -> T:
        if self.is_empty():
            raise IndexError("Dequeue from empty queue")
        return self.items.pop(0)

    def front(self) -> T:
        if self.is_empty():
            raise IndexError("Front from empty queue")
        return self.items[0]

    def is_empty(self) -> bool:
        return len(self.items) == 0


# =================================================
# Main Program (Testing Generic Queue)
# =================================================
if __name__ == "__main__":

    print("=== Integer Queue ===")
    int_queue = Queue[int]()
    int_queue.enqueue(10)
    int_queue.enqueue(20)
    int_queue.enqueue(30)
    print("Front element:", int_queue.front())
    print("Dequeued:", int_queue.dequeue())
    print("Is queue empty?", int_queue.is_empty())

    print("\n=== String Queue ===")
    str_queue = Queue[str]()
    str_queue.enqueue("Python")
    str_queue.enqueue("Generics")
    print("Front element:", str_queue.front())
    print("Dequeued:", str_queue.dequeue())
    print("Is queue empty?", str_queue.is_empty())
