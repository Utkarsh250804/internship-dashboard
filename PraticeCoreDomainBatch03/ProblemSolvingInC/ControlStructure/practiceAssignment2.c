#include<stdio.h>
#include<string.h>
#include<stdbool.h>

/*
    Problem Description
You are developing a backend logic for a Smart Café self-ordering kiosk. 
The system should have the following features:
1. 
Order validation based on item availability and quantity.
2. 
3. 
4. 
Discount application based on customer type and total bill.
Promo code validation for special offers.
Daily summary of multiple orders including total revenue and 
loyalty points.
*/

/* ---------- MENU ITEM AVAILABILITY ---------- */
bool checkMenuItem(char itemCode[], int quantity)
{
    int stock = 0;

    if (strcmp(itemCode, "C101") == 0)
        stock = 10;        // Coffee
    else if (strcmp(itemCode, "T202") == 0)
        stock = 8;         // Tea
    else if (strcmp(itemCode, "S303") == 0)
        stock = 5;         // Sandwich
    else {
        printf("Invalid item code!\n");
        return false;
    }

    if (quantity <= stock) {
        printf("Item available. Order confirmed.\n");
        return true;
    } else {
        printf("Item out of stock.\n");
        return false;
    }
}

/* ---------- CUSTOMER DISCOUNT ENGINE ---------- */
float applyCustomerDiscount(char customerType[], float totalBill)
{
    if (strcmp(customerType, "Member") == 0) {
        printf("Member discount applied (15%%)\n");
        totalBill -= totalBill * 0.15;
    }
    else if (strcmp(customerType, "First-Time") == 0 && totalBill >= 20) {
        printf("First-Time discount applied (10%%)\n");
        totalBill -= totalBill * 0.10;
    }
    else {
        printf("No discount applied\n");
    }

    return totalBill;
}

/* ---------- PROMO CODE VALIDATION ---------- */
float applyPromoCode(char promoCode[], float billAmount)
{
    if (strcmp(promoCode, "CAFE5") == 0) {
        printf("Promo Applied: $5 off\n");
        billAmount -= 5;
    }
    else if (strcmp(promoCode, "FREEDRINK") == 0) {
        printf("Promo Applied: Free Drink!\n");
    }
    else if (strcmp(promoCode, "WELCOME10") == 0) {
        printf("Promo Applied: 10%% off\n");
        billAmount -= billAmount * 0.10;
    }
    else {
        printf("Invalid promo code\n");
    }

    return billAmount;
}

/* ---------- DAILY ORDER SUMMARY ---------- */
void dailyOrderSummary(int numOrders)
{
    float orders[50];
    float totalRevenue = 0;
    int loyaltyPoints = 0;

    for (int i = 0; i < numOrders; i++) {
        printf("Enter total for order %d: ", i + 1);
        scanf("%f", &orders[i]);

        totalRevenue += orders[i];
        loyaltyPoints += (orders[i] / 25) * 10;
    }

    printf("\n--- Daily Summary ---\n");
    printf("Total Revenue: $%.2f\n", totalRevenue);
    printf("Total Loyalty Points Earned: %d\n", loyaltyPoints);
}

/* ---------- MAIN FUNCTION ---------- */
int main()
{
    char itemCode[10], customerType[20], promoCode[20];
    int quantity, numOrders;
    float totalBill;

    /* Menu Item Check */
    printf("Enter item code (C101 / T202 / S303): ");
    scanf("%s", itemCode);

    printf("Enter quantity: ");
    scanf("%d", &quantity);

    if (!checkMenuItem(itemCode, quantity))
        return 0;

    /* Bill and Discounts */
    printf("Enter total bill amount: ");
    scanf("%f", &totalBill);

    printf("Enter customer type (Regular / Member / First-Time): ");
    scanf("%s", customerType);

    totalBill = applyCustomerDiscount(customerType, totalBill);

    /* Promo Code */
    printf("Enter promo code: ");
    scanf("%s", promoCode);

    totalBill = applyPromoCode(promoCode, totalBill);

    printf("Final Bill Amount: $%.2f\n", totalBill);

    /* Daily Summary */
    printf("\nEnter number of orders today: ");
    scanf("%d", &numOrders);

    dailyOrderSummary(numOrders);

    return 0;
}
