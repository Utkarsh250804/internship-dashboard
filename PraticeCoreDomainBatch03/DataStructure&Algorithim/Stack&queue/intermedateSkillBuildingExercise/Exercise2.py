from collections import deque

def is_palindrome_queue(q: deque) -> bool:
    n = len(q)
    if n <= 1:
        return True

    # helper to get element at index idx without changing final queue
    def get_at_index(idx):
        val = None
        for i in range(n):
            x = q.popleft()
            if i == idx:
                val = x
            q.append(x)  # rotate back
        return val

    # compare symmetric elements
    for i in range(n // 2):
        left = get_at_index(i)
        right = get_at_index(n - 1 - i)
        if left != right:
            return False

    return True


# ----------- Testing -----------
q1 = deque([1, 2, 3, 2, 1])
q2 = deque([1, 2, 3, 4])

print(is_palindrome_queue(q1))  # True
print(q1)                       # original restored

print(is_palindrome_queue(q2))  # False
print(q2)                       # original restored
