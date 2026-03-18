def knapsack_dp(weights, values, W):
    n = len(weights)

    # DP table
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(W + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                )
            else:
                dp[i][w] = dp[i - 1][w]

    return dp[n][W]


# Test DP solution
weights = [10, 20, 30]
values = [60, 100, 120]
W = 50

print("0/1 Knapsack Maximum Value (DP):", knapsack_dp(weights, values, W))
