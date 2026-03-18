#include <stdio.h>
#include <string.h>
#include <ctype.h>

void toLowerCase(char str[])
{
    for (int i = 0; str[i] != '\0'; i++)
        str[i] = tolower((unsigned char)str[i]);
}

int main(int argc, char *argv[])
{
    FILE *fp;
    char filename[100];
    char searchWord[100];
    char word[200];
    int count = 0;

    // Check correct number of arguments
    if (argc != 3)
    {
        printf("Usage: %s <filename> <search_word>\n", argv[0]);
        return 0;
    }

    strcpy(filename, argv[1]);
    strcpy(searchWord, argv[2]);

    // Convert search word to lowercase
    toLowerCase(searchWord);

    fp = fopen(filename, "r");
    if (fp == NULL)
    {
        printf("Error: Cannot open file %s\n", filename);
        return 0;
    }

    // Read word by word
    while (fscanf(fp, "%199s", word) == 1)
    {
        toLowerCase(word);

        if (strcmp(word, searchWord) == 0)
        {
            count++;
        }
    }

    fclose(fp);

    printf("The word '%s' appears %d times in the file.\n", argv[2], count);

    return 0;
}
