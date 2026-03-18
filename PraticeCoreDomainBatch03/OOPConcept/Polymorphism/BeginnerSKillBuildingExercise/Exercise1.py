from abc import ABC, abstractmethod

# ================= Base Class =================
class Instrument(ABC):

    # -------- Function Overloading (Simulated) --------
    def read_data(self, data):
        if isinstance(data, int):
            print(f"Reading integer data: {data}")
        elif isinstance(data, float):
            print(f"Reading float data: {data}")
        elif isinstance(data, str):
            print(f"Reading data from external source: {data}")
        else:
            print("Unsupported data format")

    # -------- Virtual Function --------
    @abstractmethod
    def process_data(self):
        pass


# ================= Derived Class 1 =================
class Thermometer(Instrument):
    def process_data(self):
        print("Processing temperature data (°C → °F)")


# ================= Derived Class 2 =================
class PressureSensor(Instrument):
    def process_data(self):
        print("Processing pressure data (Pascal normalization)")


# ================= Main Program =================
if __name__ == "__main__":

    thermo = Thermometer()
    pressure = PressureSensor()

    # ---- Function Overloading (Simulated) ----
    thermo.read_data(25)              # integer data
    thermo.read_data(36.5)            # float data
    thermo.read_data("USB Sensor")    # external source

    print()

    # ---- Runtime Polymorphism ----
    instruments = [thermo, pressure]

    for inst in instruments:
        inst.process_data()
