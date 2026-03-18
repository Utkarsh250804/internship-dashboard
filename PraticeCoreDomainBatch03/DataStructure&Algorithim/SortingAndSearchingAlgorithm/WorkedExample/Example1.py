# ---------------- SORTING ALGORITHMS ----------------

# Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr


# Quick Sort
def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)


# ---------------- SEARCHING ALGORITHMS ----------------

# Linear Search
def linear_search(arr, key):
    for i in range(len(arr)):
        if arr[i] == key:
            return i
    return -1


# Binary Search (Iterative)
def binary_search(arr, key):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == key:
            return mid
        elif arr[mid] < key:
            low = mid + 1
        else:
            high = mid - 1

    return -1


# ---------------- MAIN PROGRAM ----------------

# Input array
arr = [64, 34, 25, 12, 22, 11, 90]

print("Original Array:", arr)

# Bubble Sort
bubble_sorted = bubble_sort(arr.copy())
print("Bubble Sort Result:", bubble_sorted)

# Quick Sort
quick_sorted = quick_sort(arr.copy())
print("Quick Sort Result:", quick_sorted)

# Searching
key = 22

# Linear Search
index = linear_search(arr, key)
if index != -1:
    print("Linear Search: Element found at index", index)
else:
    print("Linear Search: Element not found")

# Binary Search (must be sorted)
index = binary_search(quick_sorted, key)
if index != -1:
    print("Binary Search: Element found at index", index)
else:
    print("Binary Search: Element not found")
