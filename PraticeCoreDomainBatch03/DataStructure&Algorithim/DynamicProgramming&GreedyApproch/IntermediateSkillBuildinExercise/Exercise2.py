def edit_distance(str1, str2):
    m = len(str1)
    n = len(str2)

    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(m + 1):
        dp[i][0] = i   # deletions
    for j in range(n + 1):
        dp[0][j] = j   # insertions

    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i - 1] == str2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],    # delete
                    dp[i][j - 1],    # insert
                    dp[i - 1][j - 1] # replace
                )

    return dp[m][n]


# Given input
str1 = "horse"
str2 = "ros"

print("Minimum Edit Distance:", edit_distance(str1, str2))
