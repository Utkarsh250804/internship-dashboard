from abc import ABC, abstractmethod

# ================= Base Class =================
class MathUtility(ABC):

    # -------- Compile-Time Polymorphism (Simulated) --------
    def add(self, a, b):
        print(f"Addition result: {a + b}")

    def subtract(self, a, b):
        print(f"Subtraction result: {a - b}")

    # -------- Runtime Polymorphism (Virtual Method) --------
    @abstractmethod
    def advanced_operation(self, expression):
        pass


# ================= Derived Class: Integration =================
class Integration(MathUtility):
    def advanced_operation(self, expression):
        print(f"Integrating the expression: {expression}")


# ================= Derived Class: Differentiation =================
class Differentiation(MathUtility):
    def advanced_operation(self, expression):
        print(f"Differentiating the expression: {expression}")


# ================= Main Program =================
if __name__ == "__main__":

    # Basic arithmetic operations
    math_tool = Integration()
    math_tool.add(10, 5)
    math_tool.subtract(10, 5)

    print()

    # Runtime polymorphism using common reference
    utilities = [Integration(), Differentiation()]

    for util in utilities:
        util.advanced_operation("x^2 + 3x + 1")
