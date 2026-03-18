import heapq

# -------- GRAPH CLASS --------
class Graph:
    def __init__(self):
        self.graph = {}

    # Add a vertex
    def add_vertex(self, v):
        if v not in self.graph:
            self.graph[v] = []

    # Add a weighted edge (undirected graph)
    def add_edge(self, u, v, w):
        if u not in self.graph:
            self.add_vertex(u)
        if v not in self.graph:
            self.add_vertex(v)

        self.graph[u].append((v, w))
        self.graph[v].append((u, w))   # remove this line for directed graph

    # Display graph
    def display(self):
        print("Graph (Adjacency List with Weights):")
        for vertex in self.graph:
            print(vertex, "->", self.graph[vertex])

    # -------- DIJKSTRA ALGORITHM --------
    def dijkstra(self, start):
        # Distance dictionary
        dist = {vertex: float('inf') for vertex in self.graph}
        dist[start] = 0

        # Priority queue (distance, vertex)
        pq = [(0, start)]

        while pq:
            curr_dist, curr_vertex = heapq.heappop(pq)

            if curr_dist > dist[curr_vertex]:
                continue

            for neighbour, weight in self.graph[curr_vertex]:
                distance = curr_dist + weight

                if distance < dist[neighbour]:
                    dist[neighbour] = distance
                    heapq.heappush(pq, (distance, neighbour))

        return dist
import heapq

# -------- GRAPH CLASS --------
class Graph:
    def __init__(self):
        self.graph = {}

    # Add a vertex
    def add_vertex(self, v):
        if v not in self.graph:
            self.graph[v] = []

    # Add a weighted edge (undirected graph)
    def add_edge(self, u, v, w):
        if u not in self.graph:
            self.add_vertex(u)
        if v not in self.graph:
            self.add_vertex(v)

        self.graph[u].append((v, w))
        self.graph[v].append((u, w))   # remove this line for directed graph

    # Display graph
    def display(self):
        print("Graph (Adjacency List with Weights):")
        for vertex in self.graph:
            print(vertex, "->", self.graph[vertex])

    # -------- DIJKSTRA ALGORITHM --------
    def dijkstra(self, start):
        # Distance dictionary
        dist = {vertex: float('inf') for vertex in self.graph}
        dist[start] = 0

        # Priority queue (distance, vertex)
        pq = [(0, start)]

        while pq:
            curr_dist, curr_vertex = heapq.heappop(pq)

            if curr_dist > dist[curr_vertex]:
                continue

            for neighbour, weight in self.graph[curr_vertex]:
                distance = curr_dist + weight

                if distance < dist[neighbour]:
                    dist[neighbour] = distance
                    heapq.heappush(pq, (distance, neighbour))

        return dist


# -------- MAIN PROGRAM --------
g = Graph()

# Add vertices
g.add_vertex('A')
g.add_vertex('B')
g.add_vertex('C')
g.add_vertex('D')
g.add_vertex('E')

# Add weighted edges
g.add_edge('A', 'B', 4)
g.add_edge('A', 'C', 2)
g.add_edge('B', 'C', 5)
g.add_edge('B', 'D', 10)
g.add_edge('C', 'E', 3)
g.add_edge('E', 'D', 4)

# Display graph
g.display()

# Dijkstra shortest path
source = 'A'
shortest_distances = g.dijkstra(source)

print("\nShortest distances from source", source)
for vertex in shortest_distances:
    print(source, "->", vertex, "=", shortest_distances[vertex])
