n = int(input())
a = list(map(int, input().split()))

for i in range(1, n):
    val = a[i]
    k = i - 1
    while k >= 0 and a[k] > val:
        a[k+1] = a[k]
        k -= 1
    a[k+1] = val
print(*a)
