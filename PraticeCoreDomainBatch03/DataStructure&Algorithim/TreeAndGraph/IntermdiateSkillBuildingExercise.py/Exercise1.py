# Node class
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


# Function to calculate diameter
def diameter_of_tree(root):
    diameter = 0

    def height(node):
        nonlocal diameter
        if node is None:
            return 0

        left_height = height(node.left)
        right_height = height(node.right)

        # update diameter (number of edges)
        diameter = max(diameter, left_height + right_height)

        return 1 + max(left_height, right_height)

    height(root)
    return diameter



root = Node(1)
root.left = Node(2)
root.right = Node(3)
root.left.left = Node(4)
root.left.right = Node(5)

# -------- OUTPUT SECTION --------
result = diameter_of_tree(root)
print("Diameter of the Binary Tree is:", result)
