from collections import deque

def interleave_queue(q: deque):
    n = len(q)
    if n % 2 != 0:
        print("Queue size must be even!")
        return

    half = n // 2
    stack = []

    # Step 1: Push first half into stack
    for _ in range(half):
        stack.append(q.popleft())

    # Step 2: Push stack back into queue (reverses first half)
    while stack:
        q.append(stack.pop())

    # Step 3: Move first half (reversed) to back
    for _ in range(half):
        q.append(q.popleft())

    # Step 4: Again push first half into stack
    for _ in range(half):
        stack.append(q.popleft())

    # Step 5: Interleave stack (first half) and queue (second half)
    while stack:
        q.append(stack.pop())      # from first half
        q.append(q.popleft())      # from second half

# -------- Example ----------
q = deque([1, 2, 3, 4, 5, 6])

print("Before:", list(q))
interleave_queue(q)
print("After :", list(q))
