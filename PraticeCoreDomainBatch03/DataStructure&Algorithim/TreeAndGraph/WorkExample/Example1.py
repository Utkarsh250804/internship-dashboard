class Node:
    def __init__(self, value):
        self.value = value
        self.left = None 
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        if self.root is None :
            self.root = Node(value)
        else:
            self._insert_rec(self.root, value)

    def _insert_rec(self, root, value):
        if value < root.value:
            if root.left is None:
                root.left = Node(value)
            else:
                self._insert_rec(root.left, value)
        else:
            if root.right is None:
                root.right = Node(value)
            else:
                self._insert_rec(root.right, value)


    def search(self, value):
        def _search_rec(node, value):
            if node is None or node.value == value:
                return node
            if value < node.value:
                return _search_rec(node.left, value)
            return _search_rec(node.right, value)

        return _search_rec(self.root, value)

    def delete(self, value):
        def _delete_rec(node, value):
            if node is None:
                return node

            if value < node.value:
                node.left = _delete_rec(node.left, value)
            elif value > node.value:
                node.right = _delete_rec(node.right, value)
            else:
                # Node with only one child or no child
                if node.left is None:
                    return node.right
                elif node.right is None:
                    return node.left

                # Node with two children: Get the inorder successor (smallest in the right subtree)
                temp = self._min_value_node(node.right)
                node.value = temp.value
                node.right = _delete_rec(node.right, temp.value)

            return node

        self.root = _delete_rec(self.root, value)

    def _min_value_node(self, node):
        current = node
        while current.left is not None:
            current = current.left
        return current
    
    
    def inorder_traversal(self):
        def _inorder_rec(node):
            if node:
                _inorder_rec(node.left)
                print(node.value, end=" ")
                _inorder_rec(node.right)

        _inorder_rec(self.root)
    
    def preorder_traversal(self):
        def _preorder_rec(node):
            if node:
                print(node.value, end=" ")
                _preorder_rec(node.left)
                _preorder_rec(node.right)

        _preorder_rec(self.root)
    
    def postorder_traversal(self):
        def _postorder_rec(node):
            if node:
                _postorder_rec(node.left)
                _postorder_rec(node.right)
                print(node.value, end=" ")

        _postorder_rec(self.root)


# --------- MAIN PROGRAM ----------
bst = BST()
values_to_insert = [50, 30, 20, 40, 70, 60, 80]
for value in values_to_insert:
    bst.insert(value)
print("Inorder Traversal:")
bst.inorder_traversal() 
print("\nPreorder Traversal:")
bst.preorder_traversal()
print("\nPostorder Traversal:")
bst.postorder_traversal()