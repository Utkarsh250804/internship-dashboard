def min_coins(coins, amount):
    coins.sort(reverse=True)   # sort coins in descending order
    count = 0

    for coin in coins:
        while amount >= coin:
            amount -= coin
            count += 1

    return count


# Given input
coins = [1, 5, 10]
amount = 28

print("Minimum number of coins:", min_coins(coins, amount))
