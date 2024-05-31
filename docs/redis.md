- nên install bằng cloud
1. redis là gì?
- redis là 1 CSDL nhưng <> với CSDL thông thường, dl của nó đc lưu trong bộ nhớ và tốc độ đọc, ghi rất là nhanh đc sd rộng rãi, còn đc sd trong các khóa phân tán.
2. Why sao sd?
- Hiệu suất cao, và đồng thời cao 
- hiệu suất cao: lấy từ csdl đc truy cập từ đĩa, lần sau đc truy cập vào bộ đệm, những lần sau đc lấy từ bọ đệm.
- đồng thời cao: các yêu cầu trực tiếp lớn hơn nhiều so với việc truy cập trự tiếp vào CSDL, chuyển đổi 1 phần dữ liệu sang bộ đệm.
-memcached hổ trợ mỗi string, đa luồng, redis hổ trợ nhiều và bền bỉ hơn,đơn luồng
3. redis có bn kiểu dưx liệu, và kịch bản sd
- string:  sl block nhỏ, người like ,,.. thì sd string
- hash 
- list
- set
- zset
- BitMap (v 2.2)
- HyperLogLog (v 2.8)
- GEO (v 3.2)
- Stream (v 5.0)
4. redis giải quyết cơ chế hết hạn dữ liệu thế nào?
- nhiều pp xóa 
- xóa định kì, redis tự cho vài key để xóa
- xóa bằng lệnh, vào 12 sl người dùng 12h ít đi, chạy 1 lệnh tự động xóa hết tất cả các key
- việc xóa đóng vai trò then chốt
5. giải quyết vấn đề cạnh tranh đồng thời
- khóa phân tán, có khóa bi quan: vào cả và khóa lạc quan: cho vào từng thằng vào  -> search thì thêm 

