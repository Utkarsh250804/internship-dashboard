# ================= MOVIE CLASS =================
class Movie:
    def __init__(self, movie_id, title, genre, duration):
        self.movie_id = movie_id
        self.title = title
        self.genre = genre
        self.duration = duration  # in minutes

    def update_details(self, title=None, genre=None, duration=None):
        if title:
            self.title = title
        if genre:
            self.genre = genre
        if duration:
            self.duration = duration

    def display_movie(self):
        print(f"ID: {self.movie_id}, Title: {self.title}, "
              f"Genre: {self.genre}, Duration: {self.duration} mins")


# ================= CUSTOMER CLASS =================
class Customer:
    def __init__(self, customer_id, name):
        self.customer_id = customer_id
        self.name = name
        self.booked_tickets = []

    def update_details(self, name=None):
        if name:
            self.name = name

    def display_customer(self):
        print(f"Customer ID: {self.customer_id}, Name: {self.name}")
        if not self.booked_tickets:
            print("Booked Tickets: None")
        else:
            print("Booked Tickets:")
            for booking in self.booked_tickets:
                print(f"- Booking ID {booking.booking_id} for movie {booking.movie.title}")
        print()


# ================= BOOKING CLASS =================
class Booking:
    def __init__(self, booking_id, customer, movie, seats, price_per_seat=150):
        self.booking_id = booking_id
        self.customer = customer
        self.movie = movie
        self.seats = seats
        self.total_amount = seats * price_per_seat

    def update_booking(self, seats):
        self.seats = seats
        self.total_amount = seats * 150

    def display_booking(self):
        print(f"Booking ID: {self.booking_id}, "
              f"Customer: {self.customer.name}, "
              f"Movie: {self.movie.title}, "
              f"Seats: {self.seats}, "
              f"Total Amount: ₹{self.total_amount}")


# ================= THEATER CLASS =================
class Theater:
    def __init__(self):
        self.movies = []
        self.customers = []
        self.bookings = []

    # -------- MOVIE MANAGEMENT --------
    def add_movie(self):
        movie_id = int(input("Enter Movie ID: "))
        title = input("Enter Title: ")
        genre = input("Enter Genre: ")
        duration = int(input("Enter Duration (minutes): "))
        self.movies.append(Movie(movie_id, title, genre, duration))
        print("Movie added successfully.\n")

    def display_all_movies(self):
        if not self.movies:
            print("No movies available.\n")
            return
        print("\n--- Movies List ---")
        for movie in self.movies:
            movie.display_movie()
        print()

    # -------- CUSTOMER MANAGEMENT --------
    def add_customer(self):
        customer_id = int(input("Enter Customer ID: "))
        name = input("Enter Customer Name: ")
        self.customers.append(Customer(customer_id, name))
        print("Customer added successfully.\n")

    def display_all_customers(self):
        if not self.customers:
            print("No customers found.\n")
            return
        print("\n--- Customers List ---")
        for customer in self.customers:
            customer.display_customer()

    # -------- BOOKING MANAGEMENT --------
    def book_tickets(self):
        booking_id = int(input("Enter Booking ID: "))
        customer_id = int(input("Enter Customer ID: "))
        movie_id = int(input("Enter Movie ID: "))
        seats = int(input("Enter number of seats: "))

        customer = next((c for c in self.customers if c.customer_id == customer_id), None)
        movie = next((m for m in self.movies if m.movie_id == movie_id), None)

        if not customer or not movie:
            print("Customer or Movie not found.\n")
            return

        booking = Booking(booking_id, customer, movie, seats)
        self.bookings.append(booking)
        customer.booked_tickets.append(booking)
        print("Booking successful.\n")

    def display_all_bookings(self):
        if not self.bookings:
            print("No bookings found.\n")
            return
        print("\n--- Bookings List ---")
        for booking in self.bookings:
            booking.display_booking()
        print()


# ================= MAIN PROGRAM =================
theater = Theater()

while True:
    print("===== MOVIE TICKET BOOKING SYSTEM =====")
    print("1. Add Movie")
    print("2. Display All Movies")
    print("3. Add Customer")
    print("4. Display All Customers")
    print("5. Book Tickets")
    print("6. Display All Bookings")
    print("7. Exit")

    choice = input("Enter your choice: ")

    if choice == "1":
        theater.add_movie()
    elif choice == "2":
        theater.display_all_movies()
    elif choice == "3":
        theater.add_customer()
    elif choice == "4":
        theater.display_all_customers()
    elif choice == "5":
        theater.book_tickets()
    elif choice == "6":
        theater.display_all_bookings()
    elif choice == "7":
        print("Exiting Movie Ticket Booking System.")
        break
    else:
        print("Invalid choice. Try again.\n")
