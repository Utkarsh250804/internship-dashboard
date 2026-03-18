# =================================================
# Policy Classes (Behavior Definitions)
# =================================================

class ConsoleLoggerPolicy:
    @staticmethod
    def log(message):
        print(f"[Console] {message}")


class SilentLoggerPolicy:
    @staticmethod
    def log(message):
        pass


class FileLoggerPolicy:
    @staticmethod
    def log(message):
        with open("log.txt", "a") as f:
            f.write(message + "\n")


# =================================================
# Generic Component (Policy Injection)
# =================================================

class Component:
    def __init__(self, policy):
        self.policy = policy

    def execute(self):
        self.policy.log("Component executing")
        print("Core component logic executed")


# =================================================
# Main Program (Policy Selected Per Environment)
# =================================================

if __name__ == "__main__":

    print("=== Debug Environment ===")
    debug_component = Component(ConsoleLoggerPolicy)
    debug_component.execute()

    print("\n=== Release Environment ===")
    release_component = Component(SilentLoggerPolicy)
    release_component.execute()

    print("\n=== File Logging Environment ===")
    file_component = Component(FileLoggerPolicy)
    file_component.execute()
