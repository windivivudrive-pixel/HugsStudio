export interface Article {
  id: number | string;
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
}

export const articlesData: Article[] = [
  {
    id: 1,
    slug: "xu-huong-thiet-ke-do-hoa-2026",
    title: "Xu hướng thiết kế đồ họa 2026: Sự trỗi dậy của AI sáng tạo",
    date: "24 Tháng 3, 2026",
    category: "Design",
    image: "/image/news_1.png",
    content: "Năm 2026 đánh dấu bước ngoặt lớn khi AI không còn là công cụ hỗ trợ mà trở thành cộng sự đắc lực của Designer. Tại HUGs STUDIO, chúng tôi áp dụng Generative AI để tối ưu hóa quy trình phác thảo ý tưởng, giúp tiết kiệm 40% thời gian nghiên cứu nhưng vẫn đảm bảo tính độc bản của thương hiệu."
  },
  {
    id: 2,
    slug: "tam-quan-trong-cua-trai-nghiem-nguoi-dung",
    title: "Tại sao trải nghiệm người dùng quyết định 90% thành công của doanh nghiệp?",
    date: "23 Tháng 3, 2026",
    category: "UI/UX Design",
    image: "/image/news_2.png",
    content: "Trong kỷ nguyên số, khách hàng không chỉ mua sản phẩm, họ mua trải nghiệm. Một giao diện (UI) đẹp là chưa đủ, tính logic và sự mượt mà trong trải nghiệm (UX) mới là yếu tố giữ chân người dùng. Chúng tôi tập trung vào việc tối giản hóa mọi thao tác phức tạp để mang lại sự hài lòng tuyệt đối."
  },
  {
    id: 3,
    slug: "xay-dung-thuong-hieu-ben-vung",
    title: "Xây dựng thương hiệu bền vững trong thế giới biến động",
    date: "22 Tháng 3, 2026",
    category: "Branding",
    image: "/image/news_3.png",
    content: "Thương hiệu không chỉ là một logo đẹp. Đó là lời hứa và sự tin tưởng. Để tồn tại lâu dài, doanh nghiệp cần kết nối sâu sắc với giá trị cốt lõi và truyền tải nó một cách nhất quán qua mọi điểm chạm từ website, mạng xã hội đến bao bì sản phẩm."
  },
  {
    id: 4,
    slug: "cong-nghe-nextjs-va-performance",
    title: "Tối ưu hiệu năng Website với Next.js 15: Nhanh, mượt và bảo mật",
    date: "21 Tháng 3, 2026",
    category: "Web Development",
    image: "/image/news_4.png",
    content: "Tốc độ tải trang là yếu tố sống còn của SEO. Với việc sử dụng Next.js 15 và Cloudflare R2, HUGs STUDIO cam kết mang đến những website có tốc độ phản hồi tính bằng mili giây, giúp tăng tỷ lệ chuyển đổi và uy tín thương hiệu trên môi trường Internet."
  },
  {
    id: 5,
    slug: "bi-quyet-chup-anh-san-pham-cao-cap",
    title: "Bí quyết chụp ảnh sản phẩm cao cấp thu hút mọi ánh nhìn",
    date: "20 Tháng 3, 2026",
    category: "Photography",
    image: "/image/news_5.png",
    content: "Hình ảnh là ngôn ngữ trực quan mạnh mẽ nhất. Bài viết này chia sẻ các kỹ thuật về ánh sáng, bố cục và hậu kỳ để làm nổi bật sự sang trọng của sản phẩm, giúp khách hàng đưa ra quyết định mua hàng ngay từ cái nhìn đầu tiên."
  },
  {
    id: 6,
    slug: "marketing-du-lieu-thoi-dai-moi",
    title: "Dùng dữ liệu (Data) để kể câu chuyện thương hiệu hấp dẫn",
    date: "19 Tháng 3, 2026",
    category: "Marketing",
    image: "/image/demo2.png",
    content: "Số liệu khô khan có thể trở thành những câu chuyện truyền cảm hứng. Chúng tôi phân tích hành vi khách hàng để đưa ra các chiến dịch cá nhân hóa, giúp thương hiệu nói đúng điều khách hàng cần, vào đúng thời điểm họ mong đợi."
  },
  {
    id: 7,
    slug: "nghe-thuat-typography-trong-branding",
    title: "Nghệ thuật Typography: Chữ viết cũng biết kể chuyện",
    date: "18 Tháng 3, 2026",
    category: "Design",
    image: "/image/news_1.png",
    content: "Lựa chọn font chữ phù hợp giúp định hình phong cách thương hiệu: mạnh mẽ, thanh lịch hay phá cách. Typography không chỉ là việc chọn kiểu chữ, mà là cách chúng ta điều phối khoảng trống và nhịp điệu để tạo nên cảm xúc cho người đọc."
  },
  {
    id: 8,
    slug: "ung-dung-ar-trong-commerce",
    title: "Thực tế ảo tăng cường (AR) - Tương lai của ngành thương mại điện tử",
    date: "17 Tháng 3, 2026",
    category: "Technology",
    image: "/image/news_2.png",
    content: "Thử đồ ngay tại nhà, đặt nội thất ảo vào phòng khách... AR đang xóa nhòa khoảng cách giữa online và offline. Doanh nghiệp ứng dụng sớm công nghệ này sẽ có lợi thế cạnh tranh khổng lồ trong việc chinh phục khách hàng thế hệ Gen Z."
  },
  {
    id: 9,
    slug: "toi-gian-hoa-trong-lo-song-va-thiet-ke",
    title: "Chủ nghĩa tối giản: Less belongs more trong lối sống và thiết kế",
    date: "16 Tháng 3, 2026",
    category: "Lifestyle",
    image: "/image/news_3.png",
    content: "Tại sao sự đơn giản lại có sức hút mạnh mẽ đến vậy? Chúng tôi tin rằng bằng cách loại bỏ những chi tiết thừa thãi, chúng ta có thể tập trung hoàn toàn vào giá trị cốt yếu nhất, tạo nên sự thanh thản trong tâm hồn và sự tinh tế trong sản phẩm."
  },
  {
    id: 10,
    slug: "hugs-studio-hanh-trinh-sang-tao",
    title: "HUGs STUDIO: Hành trình 2 năm định nghĩa lại sự sáng tạo số",
    date: "15 Tháng 3, 2026",
    category: "About US",
    image: "/image/news_4.png",
    content: "Nhìn lại chặng đường 2 năm vừa qua, HUGs STUDIO tự hào là đối tác tin cậy của hơn 50 doanh nghiệp trong và ngoài nước. Chúng tôi không ngừng đổi mới để mang lại những giải pháp kỹ thuật và thẩm mỹ hàng đầu cho cộng đồng."
  }
];
