from collections import deque

# ---------- Stack Class ----------
class Stack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)

    def pop(self):
        if self.isEmpty():
            return None
        return self.items.pop()

    def peek(self):
        if self.isEmpty():
            return None
        return self.items[-1]

    def isEmpty(self):
        return len(self.items) == 0


# ---------- Queue Class ----------
class Queue:
    def __init__(self):
        self.q = deque()

    def enqueue(self, x):
        self.q.append(x)

    def dequeue(self):
        if self.isEmpty():
            return None
        return self.q.popleft()

    def front(self):
        if self.isEmpty():
            return None
        return self.q[0]

    def isEmpty(self):
        return len(self.q) == 0


# ---------- Helper Functions ----------
def precedence(op):
    if op in ("+", "-"):
        return 1
    if op in ("*", "/"):
        return 2
    return 0

def apply_operator(a, b, op):
    if op == "+":
        return a + b
    elif op == "-":
        return a - b
    elif op == "*":
        return a * b
    elif op == "/":
        return a // b   # integer division
    return 0


# ---------- Expression Evaluation ----------
def evaluate_expression(expression: str):
    # Tokenize (space separated expression)
    tokens = expression.split()

    # Queue for expression elements
    expr_queue = Queue()
    for t in tokens:
        expr_queue.enqueue(t)

    # Stacks for operands and operators
    values = Stack()
    ops = Stack()

    while not expr_queue.isEmpty():
        token = expr_queue.dequeue()

        # If number
        if token.isdigit():
            values.push(int(token))

        # If opening bracket
        elif token == "(":
            ops.push(token)

        # If closing bracket -> solve inside bracket
        elif token == ")":
            while not ops.isEmpty() and ops.peek() != "(":
                op = ops.pop()
                b = values.pop()
                a = values.pop()
                values.push(apply_operator(a, b, op))
            ops.pop()  # remove '('

        # If operator
        else:
            while (not ops.isEmpty() and precedence(ops.peek()) >= precedence(token)):
                op = ops.pop()
                b = values.pop()
                a = values.pop()
                values.push(apply_operator(a, b, op))
            ops.push(token)

    # Solve remaining operators
    while not ops.isEmpty():
        op = ops.pop()
        b = values.pop()
        a = values.pop()
        values.push(apply_operator(a, b, op))

    return values.pop()


# ---------- Testing ----------
if __name__ == "__main__":
    exp1 = "10 + 2 * 6"
    exp2 = "( 10 + 2 ) * 6"
    exp3 = "100 * ( 2 + 12 ) / 14"

    print("Expression:", exp1, "=> Result:", evaluate_expression(exp1))
    print("Expression:", exp2, "=> Result:", evaluate_expression(exp2))
    print("Expression:", exp3, "=> Result:", evaluate_expression(exp3))
