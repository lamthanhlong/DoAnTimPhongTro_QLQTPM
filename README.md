# Nhóm 4 19 HCB

### Notes:
- Some information.

## Các chức năng chính
### Tìm kiếm phòng trọ.
- Người sử dụng nhập vào thông tin khu vực cần muốn tìm phòng, hệ thống trả về kết quả là 1 danh sách các phòng trọ nằm trong __khu vực__
- Người dùng nếu chưa thỏa mãn với các kết quả trả về, có thể thực hiện lọc kết quả bằng cách thêm các **chỉ mục** như ***diện tích***, ***tiện ích***, ***giá cho thuê***.
- Kết quả hiển thị phải **hiển thị** thông tin mà người dùng đã chọn trước đó như **khu vực**, **chỉ mục**.
- Bất kỳ lúc nào người dùng đều có thể **xem chi tiết** phòng trọ bằng cách click vào kết quả hiển thị trên màn hình.
- **Chi tiết** phải bao gồm đầy đủ các thông tin sau: ***Title***, ***Địa chỉ***, ***khu vực***, ***người đăng***,***ngày hết hạn***, ***ngày đăng***, ***giá cho thuê***, ***các tiện ích đi kèm***, ***SDT liên lạc***, ***mô tả***, ***diện tích***, ***bản đồ*** và ***đánh giá***
- **Tiện ích đi kèm** có thể (không)bao gồm tất cả các thông tin sau: ***máy lạnh***, ***tivi***, ***nội thất***, ***bếp***,***máy nóng lạnh***,***Internet***
- **Mô tả** bao gồm các thông tin về phòng như thông tin xây dựng, các nội quy chung như giờ mở cửa/ đóng cửa, bãi giữ xe và hình ảnh của phòng.
- **Người đăng** hiển thị tên của người đăng, khi click vào sẽ chuyển sang trang người dùng.
- **Bản đồ** hiển thị tọa độ của phòng trọ trên bản đồ Google Map.
- **Đánh giá** hiển thị danh sách các thông tin phản hồi của người dùng về phòng trọ bao gồm ***số điểm (từ 1 tới 5)***, ***phản hồi*** (không) bao gồm: ***chữ*** và ***hình ảnh***.

### Đánh giá phòng trọ.
- Người sử dụng chọn hiển thị chi tiết phòng trọ và chọn ***Đánh giá*** phòng.
- Mục **đánh giá** gồm có ***thang điểm***, ***nội dung*** và ***ngày đăng***.
- **Nội dung** (không) bao gồm: ***chữ*** và ***hình ảnh***.
- Để có thể tham gia **đánh giá**, người sử dụng bắt buộc phải là **thành viên**.
- Các **đánh giá** từ thành viên chưa **thuê phòng** sẽ hiển thị **Chưa xác thực** hoặc **không đáng tin cậy**.
- Những đánh giá từ **thành viên** đã **thuê phòng** được gán nhãn **Xác nhận đã ở phòng này**.
- Các **đánh giá** là không thể **chỉnh sửa** hoặc **xóa** sau **24h** kể từ ***thời điểm xác nhận đầu tiên***

### Chat
- Người dùng tại trang chi tiết phòng trọ click chọn vào **User** bất kỳ là ***người đăng thông tin phòng*** hoặc ***người bình luận*** để chuyển tới **Chi tiết người dùng**.
- **Chi tiết người dùng** hiển thị thông tin người sử dụng bao gồm: ***Họ tên***,***CMND***, ***SDT***,***email***,***Hình ảnh*** và ***liên hệ***. 
- Các thông tin cá nhân bao gồm ***CMND***, ***SDT*** và ***email*** bị ẩn và chỉ hiển thị **3 ký tự cuối**.
- **Liên hệ** cho phép chat trực tuyến hoặc gửi tin nhắn, người được liên hệ có thể trả lời ngay khi **online trở lại**.
- **Tin nhắn** (không) bao gồm ***text***, ***hình ảnh***.

### Tài khoản
- Người dùng  có thể tìm kiếm mà không cần phải là thành viên.
- Các **tính năng** như thuê, chat trực tuyến, xem chi tiết thông tin thành viên đòi hỏi phải là **thành viên**.
- Để trở thành **thành viên**, người dùng phải ***đăng ký***.
- **Đăng ký** bao gồm các thông tin: ***họ tên***, ***SDT***, ***Ngày tháng năm sinh***, ***Email***, ***CMND*** và ***Hình ảnh cá nhân*** khớp với CMND.
- **Đăng ký** sẽ gửi thông tin xác nhận qua ***Email*** hoặc ***SDT***.
- Khi đã là thành viên, người dùng có thể đăng tin **Phòng cho thuê**.
- **Phòng cho thuê** phải bao gồm đầy đủ các thông tin **Chi tiết** sau: ***Title***, ***Địa chỉ***, ***khu vực***, ***người đăng***,***ngày hết hạn***, ***ngày đăng***, ***giá cho thuê***, ***các tiện ích đi kèm***, ***SDT liên lạc***, ***mô tả***, ***diện tích***, ***bản đồ*** và ***đánh giá***. **Tiện ích đi kèm** có thể (không)bao gồm tất cả các thông tin sau: ***máy lạnh***, ***tivi***, ***nội thất***, ***bếp***,***máy nóng lạnh***,***Internet***. **Mô tả** bao gồm các thông tin về phòng như thông tin xây dựng, các nội quy chung như giờ mở cửa/ đóng cửa, bãi giữ xe và hình ảnh của phòng. **Bản đồ** hiển thị tọa độ của phòng trọ trên bản đồ Google Map.
- Bài đăng có thể được **Renew**.
- Khi bài đăng được **Renew**, thông tin ***Ngày đăng*** và ***Ngày hết hạn*** sẽ được cập nhật.
- ***Ngày hết hạn*** là 7 ngày sau ***Ngày đăng***.