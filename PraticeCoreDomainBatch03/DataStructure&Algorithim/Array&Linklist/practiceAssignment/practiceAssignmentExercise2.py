food_item = []

def addNew_Food():
    itemId = input("Enter Food ID: ")
    itemName = input("Enter Food Name: ")
    price = float(input("Enter Food Price: "))
    quantity = int(input("Enter Food Quantity: "))
    food_item.append({
        "itemId": itemId,
        "itemName": itemName,
        "price": price,
        "quantity": quantity
    })
    print("Food item added successfully!\n")


def searchFood():
    itemId = input("Enter Food ID to search: ")
    for item in food_item:
        if item["itemId"] == itemId:
            print(f"Food Item Found: ID: {item['itemId']}, Name: {item['itemName']}, Price: {item['price']}, Quantity: {item['quantity']}\n")
            return
    print("Food Item not found!\n")


def updateQuantity():
    itemId = input("Enter Food ID to update quantity: ")
    for item in food_item:
        if item["itemId"] == itemId:
            new_quantity = int(input("Enter new quantity: "))
            item["quantity"] = new_quantity
            print("Quantity updated successfully!\n")
            return
    print("Food Item not found!\n")


def displayFoodItems():
    if not food_item:
        print("No food items available!\n")
        return
    print("\n------ FOOD ITEMS ------")
    for item in food_item:
        print(f"\nID: {item['itemId']}  , name: {item['itemName']}  , Price: ₹{item['price']}  , Quantity: {item['quantity']}")

    print()



class Order:
    def __init__(self, orderId, customerName, itemId, quantity, orderData):
        self.orderId = orderId
        self.customerName = customerName
        self.itemId = itemId
        self.quantity = quantity
        self.orderData = orderData
        self.next = None


order_head = None

def placeOrder():
    global order_head
    orderId = input("Enter Order ID: ")
    customerName = input("Enter Customer Name: ")
    itemId = input("Enter Food Item ID: ")
    quantity = int(input("Enter Quantity: "))
    orderData = input("Enter Order Date: ")

    # Check if food item exists and has enough quantity
    for item in food_item:
        if item["itemId"] == itemId:
            if item["quantity"] >= quantity:
                item["quantity"] -= quantity  # Reduce stock
                new_order = Order(orderId, customerName, itemId, quantity, orderData)
                new_order.next = order_head
                order_head = new_order
                print("Order placed successfully!\n")
                return
            else:
                print("Insufficient quantity available!\n")
                return
    print("Food Item not found!\n")


def displayOrders():
    global order_head
    if order_head is None:
        print("No orders placed yet!\n")
        return
    current = order_head
    print("\n------ ORDERS ------")
    while current:
        print(f"\nOrder ID: {current.orderId}  , Customer Name: {current.customerName}  , Item ID: {current.itemId}  , Quantity: {current.quantity}  , Order Date: {current.orderData}")
        current = current.next
    print()


def cancelOrder():
    global order_head
    orderId = input("Enter Order ID to cancel: ")
    current = order_head
    prev = None
    while current:
        if current.orderId == orderId:
            # Restore the quantity back to food items
            for item in food_item:
                if item["itemId"] == current.itemId:
                    item["quantity"] += current.quantity
                    break
            if prev:
                prev.next = current.next
            else:
                order_head = current.next
            print("Order cancelled successfully!\n")
            return
        prev = current
        current = current.next
    print("Order ID not found!\n")



while True:
    print("========== Restaurant Management System ==========")
    print("1. Add New Food Item")
    print("2. Search Food Item by ID")
    print("3. Update Food Item Quantity")
    print("4. Display All Food Items")
    print("5. Place Order")
    print("6. Display All Orders")
    print("7. Cancel Order")
    print("8. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        addNew_Food()
    elif choice == 2:
        searchFood()
    elif choice == 3:
        updateQuantity()
    elif choice == 4:
        displayFoodItems()
    elif choice == 5:
        placeOrder()
    elif choice == 6:
        displayOrders()
    elif choice == 7:
        cancelOrder()
    elif choice == 8:
        print("Exiting Restaurant Management System. Goodbye!")
        break
    else:
        print("Invalid choice! Please try again.\n")
        
