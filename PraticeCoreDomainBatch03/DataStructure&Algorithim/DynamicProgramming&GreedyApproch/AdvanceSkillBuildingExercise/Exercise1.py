import sys

def tsp(mask, pos, dist, dp):
    n = len(dist)

    # If all cities are visited, return cost to go back to start
    if mask == (1 << n) - 1:
        return dist[pos][0]

    # If already calculated
    if dp[mask][pos] != -1:
        return dp[mask][pos]

    ans = sys.maxsize

    for city in range(n):
        # If city not visited
        if (mask & (1 << city)) == 0:
            new_cost = dist[pos][city] + tsp(mask | (1 << city), city, dist, dp)
            ans = min(ans, new_cost)

    dp[mask][pos] = ans
    return ans


# -------- MAIN --------
dist = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
]

n = len(dist)
dp = [[-1] * n for _ in range(1 << n)]

result = tsp(1, 0, dist, dp)   # start from city 0
print("Minimum TSP Cost:", result)
