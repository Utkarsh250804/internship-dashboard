size =  int(input("Enter the size of the array: "))
arr = [int(input(f"Enter the {i} element:")) for i in range(size)]
target = int(input("Enter the target value: "))

# find the pair of target value  using list comprehension 
ans = [(arr[i], j)   for i in range(size)   for j in arr[i+1:]  if arr[i] + j == target]

print("The pairs with the target sum arr:", ans)
