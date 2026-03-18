# ---------------- SORTING ALGORITHMS ----------------

# Selection Sort
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr


# Merge Sort
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result


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

# Product prices (input)
prices = [1200, 450, 899, 1500, 700, 300]

print("Original Product Prices:", prices)

# Selection Sort
sel_sorted = selection_sort(prices.copy())
print("Selection Sort Result:", sel_sorted)

# Merge Sort
merge_sorted = merge_sort(prices.copy())
print("Merge Sort Result:", merge_sorted)

# Searching
search_price = 700

# Linear Search
index = linear_search(prices, search_price)
if index != -1:
    print("Linear Search: Price found at index", index)
else:
    print("Linear Search: Price not found")

# Binary Search (on sorted list)
index = binary_search(merge_sorted, search_price)
if index != -1:
    print("Binary Search: Price found at index", index)
else:
    print("Binary Search: Price not found")
