# ---------- CLASS DEFINITION ----------
class ArrayOperations:
    
    # Method to find maximum element
    def find_max(self, arr):
        max_value = arr[0]
        for i in range(1, len(arr)):
            if arr[i] > max_value:
                max_value = arr[i]
        return max_value


# ---------- MAIN PROGRAM ----------
n = int(input("Enter size of array: "))

arr = []
print("Enter array elements:")
for i in range(n):
    arr.append(int(input()))

# Create object of class
obj = ArrayOperations()

# Call method and pass array
result = obj.find_max(arr)

print("Maximum element in the array is:", result)
