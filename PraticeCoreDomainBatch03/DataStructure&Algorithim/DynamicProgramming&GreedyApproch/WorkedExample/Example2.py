def tsp(current_city, visited_mask, cost, dp, n):
    # If all cities are visited, return cost to go back to start
    if visited_mask == (1 << n) - 1:
        return cost[current_city][0]

    # If already solved, return stored value
    if dp[current_city][visited_mask] != -1:
        return dp[current_city][visited_mask]

    ans = float('inf')   # instead of sys.maxsize

    # Try visiting all unvisited cities
    for next_city in range(n):
        if (visited_mask & (1 << next_city)) == 0:
            new_cost = cost[current_city][next_city] + \
                       tsp(next_city,
                           visited_mask | (1 << next_city),
                           cost, dp, n)
            ans = min(ans, new_cost)

    dp[current_city][visited_mask] = ans
    return ans


# -------- MAIN PROGRAM --------
cost = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
]

n = len(cost)

# DP table initialized with -1
dp = [[-1] * (1 << n) for _ in range(n)]

# Start from city 0, visited_mask = 1 (only city 0 visited)
result = tsp(0, 1, cost, dp, n)

print("Minimum Travel Cost:", result)
