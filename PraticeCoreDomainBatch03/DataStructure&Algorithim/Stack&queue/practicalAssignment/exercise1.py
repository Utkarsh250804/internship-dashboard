from collections import deque

# ---------- Stack Management (LIFO) ----------
class TaskStack:
    def __init__(self):
        self.stack = []

    def push(self, task):
        self.stack.append(task)
        print(f"Task Added (Push): {task}")

    def pop(self):
        if self.isEmpty():
            print("Stack is empty! No task to remove.")
            return None
        removed = self.stack.pop()
        print(f"Task Removed (Pop): {removed}")
        return removed

    def peek(self):
        if self.isEmpty():
            print("Stack is empty! No recent task.")
            return None
        return self.stack[-1]

    def isEmpty(self):
        return len(self.stack) == 0


# ---------- Queue Management (FIFO) ----------
class TaskQueue:
    def __init__(self):
        self.queue = deque()

    def enqueue(self, task):
        self.queue.append(task)
        print(f"Task Added (Enqueue): {task}")

    def dequeue(self):
        if self.isEmpty():
            print("Queue is empty! No task to remove.")
            return None
        removed = self.queue.popleft()
        print(f"Task Removed (Dequeue): {removed}")
        return removed

    def front(self):
        if self.isEmpty():
            print("Queue is empty! No oldest task.")
            return None
        return self.queue[0]

    def isEmpty(self):
        return len(self.queue) == 0


# ---------- Testing the System ----------
if __name__ == "__main__":
    print("===== Task Management Using Stack (LIFO) =====")
    task_stack = TaskStack()

    task_stack.push("Write Assignment")
    task_stack.push("Practice DSA")
    task_stack.push("Submit Project")

    print("Most Recent Task (Peek):", task_stack.peek())
    task_stack.pop()
    print("Most Recent Task (Peek):", task_stack.peek())
    print("Is Stack Empty?:", task_stack.isEmpty())

    print("\n===== Task Management Using Queue (FIFO) =====")
    task_queue = TaskQueue()

    task_queue.enqueue("Write Assignment")
    task_queue.enqueue("Practice DSA")
    task_queue.enqueue("Submit Project")

    print("Oldest Task (Front):", task_queue.front())
    task_queue.dequeue()
    print("Oldest Task (Front):", task_queue.front())
    print("Is Queue Empty?:", task_queue.isEmpty())
