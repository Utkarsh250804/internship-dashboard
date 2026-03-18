#include <stdio.h>

/* Structure definition */
struct Contact {
    char name[30];
    char phone[15];
    char email[50];
};

int main() {
    FILE *fp;
    struct Contact c[3];
    int i;

    /* Input contact details */
    for(i = 0; i < 3; i++) {
        printf("\nEnter details of Contact %d\n", i + 1);

        printf("Name: ");
        scanf("%s", c[i].name);

        printf("Phone: ");
        scanf("%s", c[i].phone);

        printf("Email: ");
        scanf("%s", c[i].email);
    }

    /* Write records to binary file */
    fp = fopen("contacts.dat", "wb");
    fwrite(c, sizeof(struct Contact), 3, fp);
    fclose(fp);

    /* Read records from binary file */
    fp = fopen("contacts.dat", "rb");
    fread(c, sizeof(struct Contact), 3, fp);
    fclose(fp);

    /* Display contact details */
    printf("\n--- Contact List (From Binary File) ---\n");
    for(i = 0; i < 3; i++) {
        printf("\nContact %d", i + 1);
        printf("\nName  : %s", c[i].name);
        printf("\nPhone : %s", c[i].phone);
        printf("\nEmail : %s\n", c[i].email);
    }

    return 0;
}
