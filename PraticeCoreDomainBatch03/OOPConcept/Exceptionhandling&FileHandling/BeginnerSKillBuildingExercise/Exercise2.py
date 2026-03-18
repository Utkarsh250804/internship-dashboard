# Exercise 2: Read numbers from file and divide them

try:
    with open("numbers.txt", "r") as file:
        num1 = int(file.readline())
        num2 = int(file.readline())

    result = num1 / num2
    print("Division Result:", result)

except FileNotFoundError:
    print("Error: File not found.")

except ZeroDivisionError:
    print("Error: Division by zero is not allowed.")

except ValueError:
    print("Error: Invalid number format in file.")

except Exception as e:
    print("Unexpected error:", e)
