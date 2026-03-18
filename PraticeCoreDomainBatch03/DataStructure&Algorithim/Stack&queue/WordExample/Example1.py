
# ---------- Stack Class ----------
class HistoryStack:
    def __init__(self):
        self.stack = []

    def push(self, url):
        self.stack.append(url)
        print(f"Visited (Push): {url}")

    def pop(self):
        if self.isEmpty():
            print("Stack is empty! No history to remove.")
            return None
        removed = self.stack.pop()
        print(f"Removed (Pop): {removed}")
        return removed

    def peek(self):
        if self.isEmpty():
            print("Stack is empty! No recent page.")
            return None
        return self.stack[-1]

    def isEmpty(self):
        return len(self.stack) == 0


# ---------- Queue Class ----------
class HistoryQueue:
    def __init__(self):
        self.queue = []

    def enqueue(self, url):
        self.queue.append(url)
        print(f"Added (Enqueue): {url}")

    def dequeue(self):
        if self.isEmpty():
            print("Queue is empty! No history to remove.")
            return None
        removed = self.queue.pop(0)
        print(f"Removed (Dequeue): {removed}")
        return removed

    def front(self):
        if self.isEmpty():
            print("Queue is empty! No oldest page.")
            return None
        return self.queue[0]

    def isEmpty(self):
        return len(self.queue) == 0


# ---------- Testing Browser History ----------
print("===== Browser History Using Stack =====")
stackHistory = HistoryStack()
stackHistory.push("google.com")
stackHistory.push("youtube.com")
stackHistory.push("leetcode.com")

print("Recent Page (Peek):", stackHistory.peek())
stackHistory.pop()
print("Recent Page (Peek):", stackHistory.peek())

print("\n===== Browser History Using Queue =====")
queueHistory = HistoryQueue()
queueHistory.enqueue("google.com")
queueHistory.enqueue("youtube.com")
queueHistory.enqueue("leetcode.com")

print("Oldest Page (Front):", queueHistory.front())
queueHistory.dequeue()
print("Oldest Page (Front):", queueHistory.front())
