# ---------------- SORTING ALGORITHMS ----------------

# Insertion Sort
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr


# Heap Sort
def heap_sort(arr):
    n = len(arr)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)

    return arr


def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left

    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)


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

# Employee salaries
salaries = [45000, 72000, 56000, 38000, 91000, 60000]

print("Original Salaries:", salaries)

# Insertion Sort
ins_sorted = insertion_sort(salaries.copy())
print("Insertion Sort Result:", ins_sorted)

# Heap Sort
heap_sorted = heap_sort(salaries.copy())
print("Heap Sort Result:", heap_sorted)

# Searching
search_salary = 60000

# Linear Search
index = linear_search(salaries, search_salary)
if index != -1:
    print("Linear Search: Salary found at index", index)
else:
    print("Linear Search: Salary not found")

# Binary Search (on sorted array)
index = binary_search(heap_sorted, search_salary)
if index != -1:
    print("Binary Search: Salary found at index", index)
else:
    print("Binary Search: Salary not found")
