#include <stdio.h>
#include <string.h>

/* Structure declaration */
struct MyStruct {
    int i;
    float f;
    char str[20];
};

/* Union declaration */
union MyUnion {
    int i;
    float f;
    char str[20];
};

int main() {

    /* Structure variable */
    struct MyStruct s;
    s.i = 10;
    s.f = 3.14;
    strcpy(s.str, "Hello");

    /* Union variable */
    union MyUnion u;
    u.i = 10;
    u.f = 3.14;
    strcpy(u.str, "Hello");

    /* Printing Structure values */
    printf("STRUCTURE VALUES:\n");
    printf("i = %d\n", s.i);
    printf("f = %.2f\n", s.f);
    printf("str = %s\n", s.str);

    /* Printing Union values */
    printf("\nUNION VALUES:\n");
    printf("i = %d\n", u.i);      // may give garbage
    printf("f = %.2f\n", u.f);    // may give garbage
    printf("str = %s\n", u.str);  // valid

    /* Size comparison */
    printf("\nSIZE OF STRUCTURE: %lu bytes\n", sizeof(s));
    printf("SIZE OF UNION: %lu bytes\n", sizeof(u));

    return 0;
}
