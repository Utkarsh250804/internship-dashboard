class Queue:
    def __init__(self):
        self.itemp = []
        self.min = 0
    
    def is_empty(self):
        return len(self.itemp) == 0
    
    def enqueue(self, item):
        
        self.itemp.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.itemp.pop(0)
        raise IndexError("dequeue from empty queue")
    
    def front(self):
        if not self.is_empty():
            return self.itemp[0]
        raise IndexError("front from empty queue")
   
    def size(self):
        return len(self.itemp)
    
    def getMin()