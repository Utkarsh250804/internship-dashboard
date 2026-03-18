from collections import deque

class Graph:
    def __init__(self):
        self.graph = {}

    def add_edge(self, u, v):
        if u not in self.graph:
            self.graph[u] = []
        if v not in self.graph:
            self.graph[v] = []

        # Undirected graph
        self.graph[u].append(v)
        self.graph[v].append(u)

    def display(self):
        print("Graph (Adjacency List):")
        for node in self.graph:
            print(node, "->", self.graph[node])


def shortest_path_bfs(graph, start, end):
    # If start or end not in graph
    if start not in graph or end not in graph:
        return []

    queue = deque([start])
    visited = set([start])
    parent = {start: None}   # To track path

    while queue:
        node = queue.popleft()

        # Stop when destination is found
        if node == end:
            break

        for neighbour in graph[node]:
            if neighbour not in visited:
                visited.add(neighbour)
                parent[neighbour] = node
                queue.append(neighbour)

    # If end not reached
    if end not in parent:
        return []

    # Reconstruct path from end to start
    path = []
    curr = end
    while curr is not None:
        path.append(curr)
        curr = parent[curr]

    return path[::-1]   # Reverse path


# ---------------- MAIN PROGRAM ----------------

g = Graph()

# Add edges
g.add_edge('A', 'B')
g.add_edge('A', 'C')
g.add_edge('B', 'D')
g.add_edge('B', 'E')
g.add_edge('C', 'F')
g.add_edge('E', 'F')

# Display graph
g.display()

# Find shortest path
start_node = 'A'
end_node = 'F'

path = shortest_path_bfs(g.graph, start_node, end_node)

if path:
    print("\nShortest path from", start_node, "to", end_node, ":")
    print(" -> ".join(path))
else:
    print("\nNo path exists between", start_node, "and", end_node)
