# -------- GRAPH CLASS --------
class Graph:
    def __init__(self):
        self.graph = {}

    def add_edge(self, u, v):
        if u not in self.graph:
            self.graph[u] = []
        if v not in self.graph:
            self.graph[v] = []

        # Directed graph (only u -> v)
        self.graph[u].append(v)

    def display(self):
        print("Graph (Adjacency List):")
        for node in self.graph:
            print(node, "->", self.graph[node])


# -------- DFS FUNCTION FOR CYCLE --------
def dfs_cycle(node, graph, visited, recStack):
    visited[node] = True
    recStack[node] = True

    for neighbour in graph[node]:
        if not visited[neighbour]:
            if dfs_cycle(neighbour, graph, visited, recStack):
                return True
        elif recStack[neighbour]:
            return True   # cycle found

    recStack[node] = False
    return False


def detect_cycle(graph):
    visited = {node: False for node in graph}
    recStack = {node: False for node in graph}

    for node in graph:
        if not visited[node]:
            if dfs_cycle(node, graph, visited, recStack):
                return True
    return False


# -------- MAIN PROGRAM (INPUT & OUTPUT) --------
if __name__ == "__main__":
    g = Graph()

    # Input: add directed edges
    g.add_edge('A', 'B')
    g.add_edge('B', 'C')
    g.add_edge('C', 'A')   # cycle here
    g.add_edge('D', 'E')

    # Display graph
    g.display()

    # Output
    if detect_cycle(g.graph):
        print("\nCycle detected in the directed graph")
    else:
        print("\nNo cycle in the directed graph")
