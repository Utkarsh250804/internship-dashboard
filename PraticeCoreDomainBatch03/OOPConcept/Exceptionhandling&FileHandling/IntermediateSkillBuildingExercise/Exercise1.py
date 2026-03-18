# =================================================
# Custom Exception
# =================================================
class LowBalanceError(Exception):
    pass


# =================================================
# Withdraw Function
# =================================================
def withdraw(balance, amount):
    if balance - amount < 1000:
        raise LowBalanceError(
            f"Withdrawal denied! Minimum balance of 1000 must be maintained."
        )
    balance -= amount
    return balance


# =================================================
# Main Program
# =================================================
if __name__ == "__main__":

    balance = 5000
    amount = 4500   # change value to test

    try:
        balance = withdraw(balance, amount)
        print("Withdrawal successful.")
        print("Remaining Balance:", balance)

    except LowBalanceError as e:
        print("Error:", e)
