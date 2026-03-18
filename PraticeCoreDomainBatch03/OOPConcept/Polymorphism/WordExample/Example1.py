from abc import ABC, abstractmethod

# =================================================
# Base Class: Payment Method
# =================================================
class PaymentMethod(ABC):
    def __init__(self, payment_id, amount):
        self.payment_id = payment_id
        self.amount = amount

    @abstractmethod
    def process_payment(self):
        pass

    @abstractmethod
    def display_details(self):
        pass


# =================================================
# Derived Class: Credit Card Payment
# =================================================
class CreditCardPayment(PaymentMethod):
    def __init__(self, payment_id, amount, card_number, card_holder):
        super().__init__(payment_id, amount)
        self.card_number = card_number
        self.card_holder = card_holder

    def process_payment(self):
        print("Processing credit card payment...")

    def display_details(self):
        print("Payment Method : Credit Card")
        print(f"Payment ID     : {self.payment_id}")
        print(f"Amount         : {self.amount}")
        print(f"Card Holder    : {self.card_holder}")
        print(f"Card Number    : {self.card_number}")


# =================================================
# Derived Class: PayPal Payment
# =================================================
class PayPalPayment(PaymentMethod):
    def __init__(self, payment_id, amount, email):
        super().__init__(payment_id, amount)
        self.email = email

    def process_payment(self):
        print("Processing PayPal payment...")

    def display_details(self):
        print("Payment Method : PayPal")
        print(f"Payment ID     : {self.payment_id}")
        print(f"Amount         : {self.amount}")
        print(f"PayPal Email   : {self.email}")


# =================================================
# Main Program (Polymorphism Demonstration)
# =================================================
if __name__ == "__main__":

    payments = [
        CreditCardPayment(101, 2500.50, "1234-5678-9012-3456", "Amit Kumar"),
        PayPalPayment(102, 1800.00, "amit@example.com")
    ]

    for payment in payments:
        payment.process_payment()
        payment.display_details()
        print("-" * 40)
