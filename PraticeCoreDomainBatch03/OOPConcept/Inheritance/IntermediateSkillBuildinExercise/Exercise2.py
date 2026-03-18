def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2

        # Divide the array
        left = arr[:mid]
        right = arr[mid:]

        # Recursive calls
        merge_sort(left)
        merge_sort(right)

        i = j = k = 0

        # Merge the two halves
        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1

        # Copy remaining elements
        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1

        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1


# Input array
arr = [12, 11, 13, 5, 6, 7]

merge_sort(arr)
print("Sorted Array:", arr)
