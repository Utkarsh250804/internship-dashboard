# =================================================
# Product Class
# =================================================
class Product:
    def __init__(self, product_id, name, quantity, price):
        self.product_id = product_id
        self.name = name
        self.quantity = quantity
        self.price = price

    def to_string(self):
        return f"{self.product_id},{self.name},{self.quantity},{self.price}"

    def display(self):
        print(
            f"ID: {self.product_id}, "
            f"Name: {self.name}, "
            f"Quantity: {self.quantity}, "
            f"Price: {self.price}"
        )


# =================================================
# Add Product
# =================================================
def add_product(products, product_id, name, quantity, price):
    products.append(Product(product_id, name, quantity, price))


# =================================================
# Save Products to File
# =================================================
def save_products_to_file(products, filename):
    try:
        with open(filename, "w") as file:
            for product in products:
                file.write(product.to_string() + "\n")
        print("Products saved successfully.")

    except IOError as e:
        print("Error writing to file:", e)


# =================================================
# Load Products from File
# =================================================
def load_products_from_file(filename):
    products = []

    try:
        with open(filename, "r") as file:
            for line in file:
                if line.strip() == "":
                    continue
                product_id, name, quantity, price = line.strip().split(",")
                products.append(
                    Product(int(product_id), name, int(quantity), float(price))
                )

    except FileNotFoundError:
        print("Error: File not found.")

    except Exception as e:
        print("Error reading file:", e)

    return products


# =================================================
# Display Products
# =================================================
def display_products(products):
    if not products:
        print("No products available.")
        return

    for product in products:
        product.display()


# =================================================
# Main Program
# =================================================
if __name__ == "__main__":

    products = []

    add_product(products, 1, "Laptop", 10, 55000.0)
    add_product(products, 2, "Mouse", 50, 500.0)
    add_product(products, 3, "Keyboard", 30, 1500.0)

    filename = "inventory.txt"

    save_products_to_file(products, filename)

    print("\nLoading inventory from file...\n")
    loaded_products = load_products_from_file(filename)

    print("Inventory Details:")
    display_products(loaded_products)
