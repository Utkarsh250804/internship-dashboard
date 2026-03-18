# =================================================
# Generic Dictionary Class 
# =================================================
class GenericDictionary:
    def __init__(self):
        self.data = {}

    def add(self, key, value):
        if key in self.data:
            raise KeyError("Duplicate key not allowed")
        self.data[key] = value
        print(f"Added: {key} -> {value}")

    def remove(self, key):
        if key not in self.data:
            raise KeyError("Key not found")
        del self.data[key]
        print(f"Removed key: {key}")

    def get(self, key):
        if key not in self.data:
            raise KeyError("Key not found")
        return self.data[key]

    def display(self):
        if not self.data:
            print("Dictionary is empty")
            return
        for key, value in self.data.items():
            print(f"{key} -> {value}")


# =================================================
# Main Program (Testing Generic Dictionary)
# =================================================
if __name__ == "__main__":

    print("=== Integer → String Dictionary ===")
    dict1 = GenericDictionary()
    dict1.add(1, "One")
    dict1.add(2, "Two")
    print("Value for key 1:", dict1.get(1))
    dict1.display()

    print("\n=== String → Float Dictionary ===")
    dict2 = GenericDictionary()
    dict2.add("Apple", 120.5)
    dict2.add("Banana", 45.0)
    print("Value for key 'Apple':", dict2.get("Apple"))
    dict2.display()

    print("\nRemoving key 'Banana'")
    dict2.remove("Banana")
    dict2.display()
