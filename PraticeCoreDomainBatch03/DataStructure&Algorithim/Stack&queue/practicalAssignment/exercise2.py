from collections import deque

# ---------- Stack Management (LIFO) ----------
class BookingStack:
    def __init__(self):
        self.stack = []

    def push(self, booking):
        self.stack.append(booking)
        print(f"Booking Added (Push): {booking}")

    def pop(self):
        if self.isEmpty():
            print("Stack is empty! No booking to remove.")
            return None
        removed = self.stack.pop()
        print(f"Booking Removed (Pop): {removed}")
        return removed

    def peek(self):
        if self.isEmpty():
            print("Stack is empty! No recent booking.")
            return None
        return self.stack[-1]

    def isEmpty(self):
        return len(self.stack) == 0


# ---------- Queue Management (FIFO) ----------
class BookingQueue:
    def __init__(self):
        self.queue = deque()

    def enqueue(self, booking):
        self.queue.append(booking)
        print(f"Booking Added (Enqueue): {booking}")

    def dequeue(self):
        if self.isEmpty():
            print("Queue is empty! No booking to remove.")
            return None
        removed = self.queue.popleft()
        print(f"Booking Removed (Dequeue): {removed}")
        return removed

    def front(self):
        if self.isEmpty():
            print("Queue is empty! No oldest booking.")
            return None
        return self.queue[0]

    def isEmpty(self):
        return len(self.queue) == 0



# ---------- Testing the System ----------
print("===== Ticket Booking System Using Stack (LIFO) =====")
booking_stack = BookingStack()

booking_stack.push("Booking#101 - Amit - Movie Ticket")
booking_stack.push("Booking#102 - Rahul - Train Ticket")
booking_stack.push("Booking#103 - Neha - Flight Ticket")

print("Most Recent Booking (Peek):", booking_stack.peek())
booking_stack.pop()
print("Most Recent Booking (Peek):", booking_stack.peek())
print("Is Stack Empty?:", booking_stack.isEmpty())

print("\n===== Ticket Booking System Using Queue (FIFO) =====")
booking_queue = BookingQueue()

booking_queue.enqueue("Booking#201 - Amit - Movie Ticket")
booking_queue.enqueue("Booking#202 - Rahul - Train Ticket")
booking_queue.enqueue("Booking#203 - Neha - Flight Ticket")

print("Oldest Booking (Front):", booking_queue.front())
booking_queue.dequeue()
print("Oldest Booking (Front):", booking_queue.front())
print("Is Queue Empty?:", booking_queue.isEmpty())
