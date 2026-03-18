def job_scheduling_dp(jobs):
    # Sort jobs by finish time
    jobs.sort(key=lambda x: x[1])
    n = len(jobs)

    dp = [0] * n
    dp[0] = jobs[0][2]

    for i in range(1, n):
        profit_including = jobs[i][2]

        # Find last non-conflicting job
        for j in range(i - 1, -1, -1):
            if jobs[j][1] <= jobs[i][0]:
                profit_including += dp[j]
                break

        dp[i] = max(profit_including, dp[i - 1])

    return dp[-1]


# Test DP solution
jobs = [
    (1, 3, 50),
    (3, 5, 20),
    (6, 19, 100),
    (2, 100, 200)
]

print("Maximum Profit (DP):", job_scheduling_dp(jobs))


def job_scheduling_greedy(jobs):
    # Sort jobs by finish time
    jobs.sort(key=lambda x: x[1])

    total_profit = 0
    last_finish = 0

    for job in jobs:
        start, finish, profit = job
        if start >= last_finish:
            total_profit += profit
            last_finish = finish

    return total_profit


# Test Greedy solution
print("Maximum Profit (Greedy):", job_scheduling_greedy(jobs))