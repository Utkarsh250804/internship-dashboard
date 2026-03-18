# ---------- CLASS FOR FIBONACCI ----------
class Fibonacci:
    
    def find_fib(self, n):
        if n == 0:
            return 0
        elif n == 1:
            return 1
        else:
            return self.find_fib(n - 1) + self.find_fib(n - 2)


# ---------- MAIN PROGRAM ----------
n = int(input("Enter value of n: "))

obj = Fibonacci()
result = obj.find_fib(n)

print("Fibonacci number at position", n, "is:", result)
