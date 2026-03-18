# Global variable
g = 100


class Demo:
    count = 0   # static variable

    def show(self):
        # local variable
        l = 10

        Demo.count += 1

        print("Global variable g =", g)
        print("Local variable l =", l)
        print("Static variable count =", Demo.count)
        print("------")


# ---------- MAIN ----------
obj = Demo()

obj.show()
obj.show()
obj.show()
