# =================================================
# Book Class
# =================================================
class Book:
    def __init__(self, book_id, title, author):
        self.book_id = book_id
        self.title = title
        self.author = author

    def to_string(self):
        return f"{self.book_id},{self.title},{self.author}"

    def display(self):
        print(f"ID: {self.book_id}, Title: {self.title}, Author: {self.author}")


# =================================================
# Add Book
# =================================================
def add_book(books, book_id, title, author):
    books.append(Book(book_id, title, author))


# =================================================
# Save Books to File
# =================================================
def save_books_to_file(books, filename):
    try:
        with open(filename, "w") as file:
            for book in books:
                file.write(book.to_string() + "\n")
        print("Books saved successfully.")

    except IOError as e:
        print("Error writing to file:", e)


# =================================================
# Load Books from File
# =================================================
def load_books_from_file(filename):
    books = []

    try:
        with open(filename, "r") as file:
            for line in file:
                if line.strip() == "":
                    continue
                book_id, title, author = line.strip().split(",")
                books.append(Book(int(book_id), title, author))

    except FileNotFoundError:
        print("Error: File not found.")

    except Exception as e:
        print("Error reading file:", e)

    return books


# =================================================
# Display Books
# =================================================
def display_books(books):
    if not books:
        print("No books available.")
        return

    for book in books:
        book.display()


# =================================================
# Main Program
# =================================================
if __name__ == "__main__":

    books = []

    add_book(books, 101, "Python Programming", "Guido van Rossum")
    add_book(books, 102, "Clean Code", "Robert C. Martin")
    add_book(books, 103, "Data Structures", "Mark Allen Weiss")

    filename = "library_books.txt"

    save_books_to_file(books, filename)

    print("\nLoading books from file...\n")
    loaded_books = load_books_from_file(filename)

    print("Library Book Records:")
    display_books(loaded_books)
