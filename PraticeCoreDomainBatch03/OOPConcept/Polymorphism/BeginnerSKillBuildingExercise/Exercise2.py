from abc import ABC, abstractmethod

# Base class / Interface
class Animal(ABC):

    @abstractmethod
    def makeSound(self):
        pass


# Derived class: Dog
class Dog(Animal):
    def makeSound(self):
        print("Dog says: Woof")


# Derived class: Cat
class Cat(Animal):
    def makeSound(self):
        print("Cat says: Meow")


# Derived class: Cow
class Cow(Animal):
    def makeSound(self):
        print("Cow says: Moo")


# Demonstrating polymorphism
if __name__ == "__main__":
    animals = [Dog(), Cat(), Cow()]

    for animal in animals:
        animal.makeSound()
