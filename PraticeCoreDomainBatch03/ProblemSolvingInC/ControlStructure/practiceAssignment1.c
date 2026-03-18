#include<stdio.h>

int main(){
	int grid[5][5], n;
	printf("Enter the no. of command");
    scanf("%d", &n);
    char directions[n];
    int steps[n];
    printf("Enter the commands:\n");

    for(int i = 0;i<n;i++){
    	scanf(" %c %d", &directions[i], &steps[i]);
    }
    int x = 2, y = 2; // starting position

    for(int i = 0;i<n;i++){
        char dir = directions[i];
        int step = steps[i];

        if(dir == 'U'){
            x -= step;
            if(x < 0) x = 0; // boundary check
        }
        else if(dir == 'D'){
            x += step;
            if(x > 4) x = 4; // boundary check
        }
        else if(dir == 'L'){
            y -= step;
            if(y < 0) y = 0; // boundary check
        }
        else if(dir == 'R'){
            y += step;
            if(y > 4) y = 4; // boundary check
        }

    }

    printf("The final position of robots is %d row & %d column\n", x,y);
    

    return 0;
    
}