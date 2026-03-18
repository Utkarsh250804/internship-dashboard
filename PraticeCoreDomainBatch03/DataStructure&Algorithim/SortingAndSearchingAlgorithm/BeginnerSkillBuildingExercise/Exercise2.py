def linerSearch(li, target):
    for i in range(len(li)):
        if target == li[i]:
            return i
    return -1


l1 = [1,4,64,23,6,2,55,42]
 
target = 4
