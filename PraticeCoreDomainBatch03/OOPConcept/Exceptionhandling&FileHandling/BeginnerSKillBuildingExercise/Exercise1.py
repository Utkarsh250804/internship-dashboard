# Exercise 1: Write and Read a File

try:
    # Writing to file
    with open("example.txt", "w") as file:
        file.write("Welcome to file handling!")

    # Reading from file
    with open("example.txt", "r") as file:
        content = file.read()
        print("File Content:")
        print(content)

except IOError as e:
    print("File error occurred:", e)
