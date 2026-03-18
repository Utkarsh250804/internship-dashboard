def coin_change_greedy(coins, amount):
    coins.sort(reverse=True)
    count = 0

    for coin in coins:
        while amount >= coin:
            amount -= coin
            count += 1

    if amount != 0:
        return -1
    return count


# Test Greedy solution
print("Minimum coins (Greedy):", coin_change_greedy(coins, amount))
