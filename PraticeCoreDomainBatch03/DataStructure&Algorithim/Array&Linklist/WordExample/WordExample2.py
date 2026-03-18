# ------------------ PRODUCT CATALOG (ARRAY / LIST) ------------------

products = []  # array/list for product catalog


def add_product():
    pid = int(input("Enter Product ID: "))
    name = input("Enter Product Name: ")
    price = float(input("Enter Price: "))
    stock = int(input("Enter Stock Quantity: "))

    products.append({
        "id": pid,
        "name": name,
        "price": price,
        "stock": stock
    })

    print("✅ Product Added Successfully!\n")


def find_product(pid):
    for p in products:
        if p["id"] == pid:
            return p
    return None


def update_product():
    pid = int(input("Enter Product ID to Update: "))
    product = find_product(pid)

    if not product:
        print("❌ Product Not Found!\n")
        return

    print("\nWhat do you want to update?")
    print("1. Name")
    print("2. Price")
    print("3. Stock")

    choice = int(input("Enter choice: "))

    if choice == 1:
        product["name"] = input("Enter New Name: ")
    elif choice == 2:
        product["price"] = float(input("Enter New Price: "))
    elif choice == 3:
        product["stock"] = int(input("Enter New Stock: "))
    else:
        print("❌ Invalid choice!\n")
        return

    print("✅ Product Updated Successfully!\n")


def display_products():
    if not products:
        print("❌ No products in catalog.\n")
        return

    print("\n------ PRODUCT CATALOG ------")
    for p in products:
        print(f"\nID: {p['id']}")
        print(f"Name: {p['name']}")
        print(f"Price: ₹{p['price']}")
        print(f"Stock: {p['stock']}")
        print("----------------------------")
    print()


# ------------------ ORDERS (LINKED LIST) ------------------

class OrderNode:
    def __init__(self, order_id, product_id, quantity, status):
        self.order_id = order_id
        self.product_id = product_id
        self.quantity = quantity
        self.status = status  # Placed / Cancelled
        self.next = None


order_head = None


def place_order():
    global order_head

    order_id = int(input("Enter Order ID: "))
    pid = int(input("Enter Product ID: "))
    qty = int(input("Enter Quantity: "))

    product = find_product(pid)
    if not product:
        print("❌ Product not found!\n")
        return

    if product["stock"] < qty:
        print("❌ Not enough stock available!\n")
        return

    # reduce stock
    product["stock"] -= qty

    new_order = OrderNode(order_id, pid, qty, "Placed")
    new_order.next = order_head
    order_head = new_order

    print("✅ Order Placed Successfully! Stock Updated.\n")


def cancel_order():
    global order_head

    order_id = int(input("Enter Order ID to Cancel: "))

    temp = order_head
    while temp:
        if temp.order_id == order_id and temp.status == "Placed":
            temp.status = "Cancelled"

            product = find_product(temp.product_id)
            if product:
                product["stock"] += temp.quantity  # stock back

            print("✅ Order Cancelled & Stock Restored!\n")
            return

        temp = temp.next

    print("❌ Order not found or already cancelled!\n")


def display_orders():
    if not order_head:
        print("❌ No orders available.\n")
        return

    temp = order_head
    print("\n------ ORDER LIST ------")
    while temp:
        print(f"\nOrder ID: {temp.order_id}")
        print(f"Product ID: {temp.product_id}")
        print(f"Quantity: {temp.quantity}")
        print(f"Status: {temp.status}")
        print("------------------------")
        temp = temp.next
    print()


# ------------------ RETURNS (LINKED LIST) ------------------

class ReturnNode:
    def __init__(self, return_id, order_id, product_id, quantity, refund_status):
        self.return_id = return_id
        self.order_id = order_id
        self.product_id = product_id
        self.quantity = quantity
        self.refund_status = refund_status  # Refunded / Pending
        self.next = None


return_head = None


def return_product():
    global return_head

    return_id = int(input("Enter Return ID: "))
    order_id = int(input("Enter Order ID for Return: "))

    # find order
    temp = order_head
    while temp:
        if temp.order_id == order_id and temp.status == "Placed":
            product = find_product(temp.product_id)
            if product:
                product["stock"] += temp.quantity  # stock increase

            new_return = ReturnNode(return_id, order_id, temp.product_id, temp.quantity, "Refunded")
            new_return.next = return_head
            return_head = new_return

            temp.status = "Returned"

            print("✅ Return Processed! Stock Updated & Refund Done.\n")
            return

        temp = temp.next

    print("❌ Order not found / Cancelled / Already Returned!\n")


def display_returns():
    if not return_head:
        print("❌ No returns available.\n")
        return

    temp = return_head
    print("\n------ RETURN LIST ------")
    while temp:
        print(f"\nReturn ID: {temp.return_id}")
        print(f"Order ID: {temp.order_id}")
        print(f"Product ID: {temp.product_id}")
        print(f"Quantity: {temp.quantity}")
        print(f"Refund Status: {temp.refund_status}")
        print("------------------------")
        temp = temp.next
    print()


# ------------------ MAIN MENU ------------------

def main():
    while True:
        print("========== E-Commerce Management System ==========")
        print("1. Add Product (Array)")
        print("2. Update Product (Array)")
        print("3. Display Products (Array)")
        print("4. Place Order (Linked List)")
        print("5. Cancel Order (Linked List)")
        print("6. Display Orders (Linked List)")
        print("7. Return Product (Linked List)")
        print("8. Display Returns (Linked List)")
        print("9. Exit")

        choice = int(input("Enter your choice: "))

        if choice == 1:
            add_product()
        elif choice == 2:
            update_product()
        elif choice == 3:
            display_products()
        elif choice == 4:
            place_order()
        elif choice == 5:
            cancel_order()
        elif choice == 6:
            display_orders()
        elif choice == 7:
            return_product()
        elif choice == 8:
            display_returns()
        elif choice == 9:
            print("Exiting... Thank you!")
            break
        else:
            print("❌ Invalid choice! Try again.\n")


if __name__ == "__main__":
    main()
