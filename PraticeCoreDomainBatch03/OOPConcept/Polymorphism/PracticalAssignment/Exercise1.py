from abc import ABC, abstractmethod

# =================================================
# Base Class: Shape
# =================================================
class Shape(ABC):
    def __init__(self, shape_id, color):
        self.shape_id = shape_id
        self.color = color

    @abstractmethod
    def draw(self):
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

    def draw(self):
        print("Drawing a Circle")

    def display_details(self):
        print("Shape Type : Circle")
        print(f"Shape ID   : {self.shape_id}")
        print(f"Color      : {self.color}")
        print(f"Radius     : {self.radius}")


# =================================================
# Derived Class: Rectangle
# =================================================
class Rectangle(Shape):
    def __init__(self, shape_id, color, width, height):
        super().__init__(shape_id, color)
        self.width = width
        self.height = height

    def draw(self):
        print("Drawing a Rectangle")

    def display_details(self):
        print("Shape Type : Rectangle")
        print(f"Shape ID   : {self.shape_id}")
        print(f"Color      : {self.color}")
        print(f"Width      : {self.width}")
        print(f"Height     : {self.height}")


# =================================================
# Main Program (Polymorphism Demonstration)
# =================================================
if __name__ == "__main__":

    shapes = [
        Circle(1, "Red", 5.5),
        Rectangle(2, "Blue", 4.0, 6.0)
    ]

    for shape in shapes:
        shape.draw()
        shape.display_details()
        print("-" * 40)
