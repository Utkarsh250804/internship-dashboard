# ================= BOOK CLASS =================
class Book:
    def __init__(self, book_id, title, author):
        self.book_id = book_id
        self.title = title
        self.author = author
        self.available = True

    def display_book(self):
        status = "Available" if self.available else "Not Available"
        print(f"{self.book_id}\t{self.title}\t{self.author}\t{status}")


# ================= MEMBER CLASS =================
class Member:
    def __init__(self, member_id, name):
        self.member_id = member_id
        self.name = name
        self.borrowed_books = []

    def display_member(self):
        print(f"Member ID: {self.member_id}")
        print(f"Name: {self.name}")
        if not self.borrowed_books:
            print("Borrowed Books: None")
        else:
            print("Borrowed Books:")
            for book in self.borrowed_books:
                print(f"- {book.title}")
        print()


# ================= LIBRARY CLASS =================
class Library:
    def __init__(self):
        self.books = []
        self.members = []

    # ---------- BOOK MANAGEMENT ----------
    def add_book(self):
        book_id = int(input("Enter Book ID: "))
        title = input("Enter Title: ")
        author = input("Enter Author: ")
        self.books.append(Book(book_id, title, author))
        print("Book added successfully!\n")

    def display_all_books(self):
        if not self.books:
            print("No books available.\n")
            return
        print("\nBookID\tTitle\tAuthor\tStatus")
        print("-" * 40)
        for book in self.books:
            book.display_book()
        print()

    # ---------- MEMBER MANAGEMENT ----------
    def add_member(self):
        member_id = int(input("Enter Member ID: "))
        name = input("Enter Name: ")
        self.members.append(Member(member_id, name))
        print("Member added successfully!\n")

    def display_all_members(self):
        if not self.members:
            print("No members found.\n")
            return
        for member in self.members:
            member.display_member()

    # ---------- LIBRARY OPERATIONS ----------
    def borrow_book(self):
        member_id = int(input("Enter Member ID: "))
        book_id = int(input("Enter Book ID: "))

        member = None
        for m in self.members:
            if m.member_id == member_id:
                member = m
                break

        book = None
        for b in self.books:
            if b.book_id == book_id:
                book = b
                break

        if member is None or book is None:
            print("Member or Book not found.\n")
            return

        if book.available:
            book.available = False
            member.borrowed_books.append(book)
            print("Book borrowed successfully.\n")
        else:
            print("Book is already borrowed.\n")

    def return_book(self):
        member_id = int(input("Enter Member ID: "))
        book_id = int(input("Enter Book ID: "))

        for member in self.members:
            if member.member_id == member_id:
                for book in member.borrowed_books:
                    if book.book_id == book_id:
                        book.available = True
                        member.borrowed_books.remove(book)
                        print("Book returned successfully.\n")
                        return
                print("Book not found in member's borrowed list.\n")
                return

        print("Member not found.\n")


# ================= MAIN PROGRAM =================
library = Library()

while True:
    print("===== LIBRARY MANAGEMENT SYSTEM =====")
    print("1. Add Book")
    print("2. Display All Books")
    print("3. Add Member")
    print("4. Display All Members")
    print("5. Borrow Book")
    print("6. Return Book")
    print("7. Exit")

    choice = input("Enter your choice: ")

    if choice == "1":
        library.add_book()
    elif choice == "2":
        library.display_all_books()
    elif choice == "3":
        library.add_member()
    elif choice == "4":
        library.display_all_members()
    elif choice == "5":
        library.borrow_book()
    elif choice == "6":
        library.return_book()
    elif choice == "7":
        print("Exiting Library Management System.")
        break
    else:
        print("Invalid choice. Try again.\n")
