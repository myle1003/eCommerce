1. cấu trúc
- có thể dùng cache trong giỏ hàng hoặc làm giỏ hàng luôn ko cần cache
- 2^32
![Alt text](image-2.png)

2. các lệnh phổ biến 
- HSET user:01 name my
- HMSET user:02 name tra age 22
- HMGET user:02 name age
- HDEL user:02 age 
- HLEN user:01 -> số phần tử 
- HLEN user:02 

- HGETALL user:01

![Alt text](image-6.png)

![Alt text](image-5.png)
![Alt text](image-4.png)

3. khi nào dùng 

![Alt text](image-9.png)

![Alt text](image-8.png)