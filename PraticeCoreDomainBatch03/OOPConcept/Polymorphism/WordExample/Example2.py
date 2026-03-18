from abc import ABC, abstractmethod
import math

# =================================================
# Base Class: Shape
# =================================================
class Shape(ABC):
    def __init__(self, shape_id, color):
        self.shape_id = shape_id
        self.color = color

    @abstractmethod
    def calculate_area(self):
        pass

    @abstractmethod
    def display_details(self):
        pass


# =================================================
# Derived Class: Circle
# =================================================
class Circle(Shape):
    def __init__(self, shape_id, color, radius):
        super().__init__(shape_id, color)
        self.radius = radius

    def calculate_area(self):
        return math.pi * self.radius * self.radius

    def display_details(self):
        print("Shape Type : Circle")
        print(f"Shape ID   : {self.shape_id}")
        print(f"Color      : {self.color}")
        print(f"Radius     : {self.radius}")
        print(f"Area       : {self.calculate_area():.2f}")


# =================================================
# Derived Class: Rectangle
# =================================================
class Rectangle(Shape):
    def __init__(self, shape_id, color, width, height):
        super().__init__(shape_id, color)
        self.width = width
        self.height = height

    def calculate_area(self):
        return self.width * self.height

    def display_details(self):
        print("Shape Type : Rectangle")
        print(f"Shape ID   : {self.shape_id}")
        print(f"Color      : {self.color}")
        print(f"Width      : {self.width}")
        print(f"Height     : {self.height}")
        print(f"Area       : {self.calculate_area():.2f}")


# =================================================
# Main Function (Polymorphism Demonstration)
# =================================================
def main():

    shapes = [
        Circle(1, "Red", 5.0),
        Rectangle(2, "Blue", 4.0, 6.0)
    ]

    for shape in shapes:
        shape.display_details()
        print("-" * 40)


# =================================================
# Program Entry Point
# =================================================
if __name__ == "__main__":
    main()
