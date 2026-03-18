# ================= ROOM CLASS =================
class Room:
    def __init__(self, room_id, room_type, price):
        self.room_id = room_id
        self.room_type = room_type
        self.price = float(price)
        self.available = True

    def display_room(self):
        status = "Available" if self.available else "Booked"
        print(f"{self.room_id}\t{self.room_type}\t{status}\t{self.price}")


# ================= GUEST CLASS =================
class Guest:
    def __init__(self, guest_id, name):
        self.guest_id = guest_id
        self.name = name
        self.booked_rooms = []

    def display_guest(self):
        print(f"Guest ID: {self.guest_id}")
        print(f"Name: {self.name}")
        if not self.booked_rooms:
            print("Booked Rooms: None")
        else:
            print("Booked Rooms:")
            for room in self.booked_rooms:
                print(f"- Room {room.room_id} ({room.room_type})")
        print()

    def generate_bill(self):
        total = sum(room.price for room in self.booked_rooms)
        return total


# ================= HOTEL CLASS =================
class Hotel:
    def __init__(self):
        self.rooms = []
        self.guests = []

    # ---------- ROOM MANAGEMENT ----------
    def add_room(self):
        room_id = int(input("Enter Room ID: "))
        room_type = input("Enter Room Type: ")
        price = float(input("Enter Price: "))
        self.rooms.append(Room(room_id, room_type, price))
        print("Room added successfully.\n")

    def display_all_rooms(self):
        if not self.rooms:
            print("No rooms available.\n")
            return
        print("\nRoomID\tType\tStatus\tPrice")
        print("-" * 35)
        for room in self.rooms:
            room.display_room()
        print()

    # ---------- GUEST MANAGEMENT ----------
    def add_guest(self):
        guest_id = int(input("Enter Guest ID: "))
        name = input("Enter Guest Name: ")
        self.guests.append(Guest(guest_id, name))
        print("Guest added successfully.\n")

    def display_all_guests(self):
        if not self.guests:
            print("No guests found.\n")
            return
        for guest in self.guests:
            guest.display_guest()

    # ---------- HOTEL OPERATIONS ----------
    def check_in(self):
        guest_id = int(input("Enter Guest ID: "))
        room_id = int(input("Enter Room ID: "))

        guest = next((g for g in self.guests if g.guest_id == guest_id), None)
        room = next((r for r in self.rooms if r.room_id == room_id), None)

        if not guest or not room:
            print("Guest or Room not found.\n")
            return

        if not room.available:
            print("Room is already booked.\n")
            return

        room.available = False
        guest.booked_rooms.append(room)
        print("Check-in successful. Room booked.\n")

    def check_out(self):
        guest_id = int(input("Enter Guest ID for checkout: "))
        guest = next((g for g in self.guests if g.guest_id == guest_id), None)

        if not guest or not guest.booked_rooms:
            print("Guest not found or no rooms booked.\n")
            return

        total_bill = guest.generate_bill()

        # Make all rooms available again
        for room in guest.booked_rooms:
            room.available = True

        guest.booked_rooms.clear()
        print(f"Checkout successful. Total Bill: ₹{total_bill}\n")


# ================= MAIN PROGRAM =================
hotel = Hotel()

while True:
    print("===== HOTEL MANAGEMENT SYSTEM =====")
    print("1. Add Room")
    print("2. Display All Rooms")
    print("3. Add Guest")
    print("4. Display All Guests")
    print("5. Check-in Guest (Book Room)")
    print("6. Check-out Guest (Generate Bill)")
    print("7. Exit")

    choice = input("Enter your choice: ")

    if choice == "1":
        hotel.add_room()
    elif choice == "2":
        hotel.display_all_rooms()
    elif choice == "3":
        hotel.add_guest()
    elif choice == "4":
        hotel.display_all_guests()
    elif choice == "5":
        hotel.check_in()
    elif choice == "6":
        hotel.check_out()
    elif choice == "7":
        print("Exiting Hotel Management System.")
        break
    else:
        print("Invalid choice. Try again.\n")
