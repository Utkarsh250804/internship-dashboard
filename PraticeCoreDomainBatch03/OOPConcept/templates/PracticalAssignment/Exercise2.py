# =================================================
# Generic Set Class
# =================================================
class GenericSet:
    def __init__(self):
        self.elements = set()

    def add(self, element):
        if element in self.elements:
            print(f"{element} already exists in the set")
        else:
            self.elements.add(element)
            print(f"Added: {element}")

    def remove(self, element):
        if element not in self.elements:
            raise KeyError(f"{element} not found in the set")
        self.elements.remove(element)
        print(f"Removed: {element}")

    def contains(self, element):
        return element in self.elements

    def display(self):
        if not self.elements:
            print("Set is empty")
            return
        print("Set elements:")
        for element in self.elements:
            print(element)


# =================================================
# Main Program (Testing Generic Set)
# =================================================
if __name__ == "__main__":

    generic_set = GenericSet()

    print("=== Adding Elements ===")
    generic_set.add(10)
    generic_set.add(20)
    generic_set.add("Python")
    generic_set.add(10)        # duplicate
    generic_set.add(3.14)

    print("\n=== Display Set ===")
    generic_set.display()

    print("\n=== Contains Check ===")
    print("Contains 20?", generic_set.contains(20))
    print("Contains Java?", generic_set.contains("Java"))

    print("\n=== Removing Elements ===")
    generic_set.remove(10)

    print("\n=== Display After Removal ===")
    generic_set.display()
