'''
Docstring for Array&Linklist.AdvanceSkillBuildingExercise.AdvanceSkillBuildingExercise1b
 Group Anagrams
Given an array of strings
Input: ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
Write a program to group all anagrams together from the given list of 
strings.
What is the time complexity of grouping anagrams from the given list 
of strings 
'''


def isequal(str1, str2):
    '''
    return true if both string character is equal otherwise false

    '''
    if len(str1) != len(str2):
        return False
    
    str3 = str1 + str2
    
    li = [ 0 for i in range(26)]
    for s in str3:
        li[ord(s) - ord('a')] += 1

    for i in li:
        if i %2 != 0:
            return False
        
    return True


size  = int(input("Enter the size of array: "))

arr = [input() for _ in range(size)]

ans = []

for i in range(size):
    is_push = True

    temp_size = len(ans)
    while temp_size:
        if isequal(ans[temp_size-1][0], arr[i]):
            ans[temp_size - 1].append(arr[i])
            is_push = False
        temp_size -= 1
    
    if is_push:
        ans.append([arr[i]])
        

print(ans)