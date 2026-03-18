from abc import ABC, abstractmethod

# =================================================
# Base Class / Interface
# =================================================
class Notification(ABC):
    """
    Base interface for all notifications.
    """

    @abstractmethod
    def send(self, message):
        pass


# =================================================
# Concrete Notification Implementations
# =================================================
class EmailNotification(Notification):
    def send(self, message):
        print(f"Sending EMAIL notification: {message}")


class SMSNotification(Notification):
    def send(self, message):
        print(f"Sending SMS notification: {message}")


class PushNotification(Notification):
    def send(self, message):
        print(f"Sending PUSH notification: {message}")


# =================================================
# New Notification Type (Added without changing core logic)
# =================================================
class SlackNotification(Notification):
    def send(self, message):
        print(f"Sending SLACK notification: {message}")


# =================================================
# Core Logic (Does NOT change)
# =================================================
def notify_user(notification: Notification, message):
    notification.send(message)


# =================================================
# Main Program (Runtime Polymorphism)
# =================================================
if __name__ == "__main__":

    notifications = [
        EmailNotification(),
        SMSNotification(),
        PushNotification(),
        SlackNotification()   # New type added easily
    ]

    for n in notifications:
        notify_user(n, "Your order has been shipped!")
