class Notification:
    def __init__(self, content):
        self.content = content

    def send(self):
        print("Notification:", self.content)


# Demonstration with different data types
n1 = Notification("Disk space low")
n2 = Notification(404)
n3 = Notification(True)

n1.send()
n2.send()
n3.send()
