from collections import deque

# -------- GRAPH CLASS --------
class Graph:
    def __init__(self):
        self.graph = {}

    # Add a vertex
    def add_vertex(self, vertex):
        if vertex not in self.graph:
            self.graph[vertex] = []

    # Add an edge (undirected graph)
    def add_edge(self, u, v):
        if u not in self.graph:
            self.add_vertex(u)
        if v not in self.graph:
            self.add_vertex(v)

        self.graph[u].append(v)
        self.graph[v].append(u)

    # Display the graph
    def display(self):
        print("Graph (Adjacency List):")
        for vertex in self.graph:
            print(vertex, "->", self.graph[vertex])

    # -------- BFS Traversal --------
    def bfs(self, start):
        visited = set()
        queue = deque([start])

        print("BFS Traversal:", end=" ")

        while queue:
            node = queue.popleft()
            if node not in visited:
                print(node, end=" ")
                visited.add(node)

                for neighbour in self.graph[node]:
                    if neighbour not in visited:
                        queue.append(neighbour)
        print()

    # -------- DFS Traversal --------
    def dfs(self, start):
        visited = set()
        print("DFS Traversal:", end=" ")
        self._dfs_helper(start, visited)
        print()

    def _dfs_helper(self, node, visited):
        visited.add(node)
        print(node, end=" ")

        for neighbour in self.graph[node]:
            if neighbour not in visited:
                self._dfs_helper(neighbour, visited)




# -------- MAIN PROGRAM --------
g = Graph()

# Add vertices
g.add_vertex('A')
g.add_vertex('B')
g.add_vertex('C')
g.add_vertex('D')
g.add_vertex('E')

# Add edges
g.add_edge('A', 'B')
g.add_edge('A', 'C')
g.add_edge('B', 'D')
g.add_edge('C', 'E')

# Display graph
g.display()

# Perform BFS and DFS
g.bfs('A')
g.dfs('A')
