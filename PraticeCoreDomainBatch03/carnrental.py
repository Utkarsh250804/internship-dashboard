from datetime import datetime


class Car:
    def _init_(self, car_no, wheels):
        self.car_no = car_no
        self.wheels = wheels 
        self.isrentAvailable = True
        self.rentTime = None
    
    def _str_(self):
        status = "Available"
        if not self.isrentAvailable:
            status = "Rent"
        
        return f"Car No: {self.car_no}, Wheels: {self.wheels}, Status: {status}"


class CarRental:
    def _init_(self):
        self.cars = []
    
    def addCar(self):
        try:
            car_no = input("Enter Car Number:").strip()
            if self.find_car(car_no):
                print("Car with this number already exists!")
                return
            
            wheels = int(input("Enter Number of Wheels:").strip())
            car = Car(car_no, wheels)
            self.cars.append(car)

            print("Car Added successfully")

        except ValueError as e:
            print("Error", e)
        
    def find_car(self, car_no):
        for car in self.cars:
            if car.car_no == car_no:
                return car
        return None
    
    def rentCar(self):
        try:
            car_no = input("Enter Car Number:").strip()
            car = self.find_car(car_no)

            if not car:
                print("Car is already rented")
                return

            car.isrentAvailable = False
            car.rentTime = datetime.now()

            print(f" Car rented at {car.rentTime}")

        except Exception as e:
            print(f"Error : {e}")
    
    def return_car(self):
        try:
            car_no = input("Enter Car Number:").strip()
            car = self.find_car(car_no)

            if not car:
                print("Car not Found !")
                return 
            if car.isrentAvailable:
                print("Carr Alreay available!")
                return 
            
            car.isrentAvailable = True
            print("Car return Sucessfully!")
        except Exception as e:
            print(f"Error : {e}")

    def check_availability(self):
        car_no = input("Enter Car Number:").strip()
        car = self.find_car(car_no)

        if not car:
            print("Car not Found !")
            return 
        
        if car.isrentAvailable:
            print("Car is Available")
        else:
            print("Car is Rented")
    def display_cars(self):
        if not self.cars:
            print("No Car in System")
            return
    
        print("\n-------  Car List -------")
        for car in self.cars:
            print(car)

        print("------------------------")



def main():
    system = CarRental()
    while True:
        print("+++++++++++++++Car Rental System++++++++++++")
        print("\n1. Add Car\n2. Rent Car\n3.Return Car \n4. Check Availability \n5. Display all Cars\n6. Exit")

        choice = input("Enter your choice:").strip()

        if choice == '1':
            system.addCar()
        elif choice == '2':
            system.rentCar()
        elif choice == '3':
            system.return_car()
        elif choice == '4':
            system.check_availability()
        elif choice == '5':
            system.display_cars()
        elif choice == '6':
            print("Exiting Car Rental System. Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")

if _name_ == "_main_":
    main()