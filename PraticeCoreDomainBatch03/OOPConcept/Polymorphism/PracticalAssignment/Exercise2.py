from abc import ABC, abstractmethod

# =================================================
# Base Class: Appliance
# =================================================
class Appliance(ABC):
    def __init__(self, appliance_id, brand):
        self.appliance_id = appliance_id
        self.brand = brand

    @abstractmethod
    def calculate_power_consumption(self):
        pass

    @abstractmethod
    def display_details(self):
        pass


# =================================================
# Derived Class: Light
# =================================================
class Light(Appliance):
    def __init__(self, appliance_id, brand, wattage):
        super().__init__(appliance_id, brand)
        self.wattage = wattage

    def calculate_power_consumption(self):
        return self.wattage  # watts

    def display_details(self):
        print("Appliance Type : Light")
        print(f"Appliance ID   : {self.appliance_id}")
        print(f"Brand          : {self.brand}")
        print(f"Wattage        : {self.wattage} W")
        print(f"Power Usage    : {self.calculate_power_consumption()} W")


# =================================================
# Derived Class: Fan
# =================================================
class Fan(Appliance):
    def __init__(self, appliance_id, brand, speed):
        super().__init__(appliance_id, brand)
        self.speed = speed

    def calculate_power_consumption(self):
        return self.speed * 10  # simple assumption

    def display_details(self):
        print("Appliance Type : Fan")
        print(f"Appliance ID   : {self.appliance_id}")
        print(f"Brand          : {self.brand}")
        print(f"Speed Level    : {self.speed}")
        print(f"Power Usage    : {self.calculate_power_consumption()} W")


# =================================================
# Main Function (Polymorphism Demonstration)
# =================================================
def main():

    appliances = [
        Light(101, "Philips", 60.0),
        Fan(102, "Havells", 3)
    ]

    for appliance in appliances:
        appliance.display_details()
        print("-" * 40)


# =================================================
# Program Entry Point
# =================================================
if __name__ == "__main__":
    main()
