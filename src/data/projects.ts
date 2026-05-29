export interface Project {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  year: string;
  color: string;
  image: string;
  description: string;
  fullDescription: string;
  tags: string[];
  gallery?: string[];
  span?: string; // For homepage asymmetric grid
  aspect?: string; // For projects listing page
  type?: 'image' | 'video';
  video?: string;
}


export const projectsData: Project[] = [
  {
    "id": "69ce33b3003b8472378c",
    "slug": "bo-san-pham-qua-tet-2026",
    "title": "Bộ sản phẩm quà Tết 2026",
    "category": "ẢNH BRANDING",
    "year": "2026",
    "color": "from-zinc-800/30 to-zinc-950/60",
    "image": "/image/du-an-home/1.webp",
    "description": "𝑻𝒆̂́𝒕 𝒏𝒂̀𝒚, 𝒄𝒉𝒐 𝒕𝒐̂𝒊 𝒈𝒖̛̉𝒊 𝒎𝒐̣̂𝒕 𝒏𝒉𝒂̀𝒏𝒉 𝒎𝒂𝒊, 𝒈𝒖̛̉𝒊 𝒄𝒂̉ 𝒑𝒉𝒐𝒏𝒈 𝒗𝒊̣ 𝒄𝒖̉𝒂 𝒏𝒉𝒖̛̃𝒏𝒈 𝒏𝒈𝒂̀𝒚 𝒙𝒖̛𝒂 𝒄𝒖̃…",
    "fullDescription": "<p>Lấy&nbsp;cảm&nbsp;hứng&nbsp;từ&nbsp;vẻ&nbsp;đẹp&nbsp;của&nbsp;người&nbsp;phụ&nbsp;nữ&nbsp;Việt&nbsp;trong&nbsp;tà&nbsp;áo&nbsp;dài&nbsp;truyền&nbsp;thống&nbsp;bên&nbsp;hộp&nbsp;quà&nbsp;sơn&nbsp;mài&nbsp;tinh&nbsp;xảo,&nbsp;HUGs&nbsp;Studio&nbsp;đã&nbsp;tạo&nbsp;nên&nbsp;những&nbsp;khung&nbsp;hình&nbsp;mang&nbsp;đậm&nbsp;phong&nbsp;vị&nbsp;tết&nbsp;xưa.&nbsp;Với&nbsp;sắc&nbsp;đỏ&nbsp;chủ&nbsp;đạo&nbsp;hòa&nbsp;quyện&nbsp;cùng&nbsp;ánh&nbsp;sáng&nbsp;vàng&nbsp;ấm&nbsp;áp,&nbsp;tạo&nbsp;nên&nbsp;một&nbsp;bản&nbsp;giao&nbsp;hưởng&nbsp;thị&nbsp;giác&nbsp;đầy&nbsp;mê&nbsp;hoặc.</p><p>Chúng&nbsp;tôi&nbsp;hiểu&nbsp;rằng,&nbsp;mỗi&nbsp;bộ&nbsp;quà&nbsp;Tết&nbsp;là&nbsp;một&nbsp;tác&nbsp;phẩm&nbsp;nghệ&nbsp;thuật.&nbsp;Và&nbsp;nhiệm&nbsp;vụ&nbsp;của&nbsp;HUGs&nbsp;Studio&nbsp;là&nbsp;lưu&nbsp;giữ&nbsp;cái&nbsp;hồn&nbsp;của&nbsp;sản&nbsp;phẩm&nbsp;một&nbsp;cách&nbsp;trọn&nbsp;vẹn&nbsp;và&nbsp;lộng&nbsp;lẫy&nbsp;nhất.</p>",
    "tags": [
      "Tết 2026"
    ],
    "span": "col-span-7",
    "aspect": "aspect-[16/10]",
    "type": "image"
  },
  {
    "id": "69cf2a5c0015e782cd1c",
    "slug": "nuoc-hoa-club-de-nuit",
    "title": "NƯỚC HOA - CLUB DE NUIT",
    "category": "ẢNH BRANDING",
    "year": "2025",
    "color": "from-zinc-800/30 to-zinc-950/60",
    "image": "/image/du-an-home/2.webp",
    "description": "SỰ KẾT HỢP CỦA BÌNH DỊ VÀ NGẪU NHIÊN\r\n",
    "fullDescription": "<p>Nước&nbsp;Hoa&nbsp;Armaf&nbsp;Club&nbsp;De&nbsp;Nuit&nbsp;Intense&nbsp;biến&nbsp;một&nbsp;chàng&nbsp;trai&nbsp;trở&nbsp;nên&nbsp;cuốn&nbsp;hút&nbsp;bằng&nbsp;sự&nbsp;tươi&nbsp;mới,&nbsp;trẻ&nbsp;trung&nbsp;và&nbsp;gần&nbsp;gũi&nbsp;kể&nbsp;cả&nbsp;ngay&nbsp;lần&nbsp;gặp&nbsp;đầu&nbsp;tiên.</p>",
    "tags": [],
    "span": "col-span-5",
    "aspect": "aspect-[4/5]",
    "type": "image"
  },
  {
    "id": 8,
    "slug": "vertical-vision",
    "title": "Vertical Vision",
    "category": "SHORT VIDEO",
    "year": "2024",
    "color": "from-purple-800/30 to-purple-950/60",
    "image": "/video/showcase1.mp4",
    "description": "Góc nhìn dọc mới lạ thu hút sự chú ý tức thì.",
    "fullDescription": "Vertical Vision là chuỗi video ngắn tối ưu hóa cho màn hình dọc, nâng cao tỉ lệ giữ chân người xem và tương tác vượt trội. Phù hợp hoàn hảo cho các nền tảng mạng xã hội hiện đại.",
    "tags": [
      "Short Video",
      "Social Media",
      "Vertical",
      "Creative"
    ],
    "span": "col-span-4 row-span-2",
    "aspect": "aspect-[9/16]",
    "type": "video",
    "video": "/video/showcase1.mp4"
  },
  {
    "id": "69cf29b60029fcf9fbe0",
    "slug": "coon-sen-hau-giang",
    "title": "COON - SEN HẬU GIANG ",
    "category": "ẢNH BRANDING",
    "year": "2026",
    "color": "from-zinc-800/30 to-zinc-950/60",
    "image": "/image/du-an-home/3.webp",
    "description": "CẢM HỨNG TỪ VẺ ĐẸP THUẦN VIỆT",
    "fullDescription": "<p>Mang&nbsp;trong&nbsp;mình&nbsp;sự&nbsp;tinh&nbsp;khiết&nbsp;và&nbsp;thanh&nbsp;cao,&nbsp;hoa&nbsp;sen&nbsp;đã&nbsp;trở&nbsp;thành&nbsp;nguồn&nbsp;cảm&nbsp;hứng&nbsp;chủ&nbsp;đạo&nbsp;cho&nbsp;bộ&nbsp;ảnh&nbsp;Toner&nbsp;Sen&nbsp;Cocoon.&nbsp;</p><p>Từ&nbsp;chất&nbsp;liệu&nbsp;thiên&nbsp;nhiên&nbsp;thuần&nbsp;Việt,&nbsp;HUGs&nbsp;Studio&nbsp;đã&nbsp;tái&nbsp;hiện&nbsp;nên&nbsp;một&nbsp;vẻ&nbsp;đẹp&nbsp;mộc&nbsp;mạc,&nbsp;gần&nbsp;gũi&nbsp;nhưng&nbsp;vẫn&nbsp;đầy&nbsp;tinh&nbsp;tế&nbsp;đúng&nbsp;tinh&nbsp;thần&nbsp;mà&nbsp;thương&nbsp;hiệu&nbsp;đã&nbsp;và&nbsp;đang&nbsp;hướng&nbsp;đến.&nbsp;</p>",
    "tags": [],
    "span": "col-span-4",
    "aspect": "aspect-square",
    "type": "image"
  },
  {
    "id": "6a191f0000317b1bfb25",
    "slug": "trung-thu-cung-wafaifo",
    "title": "Trung thu cùng Wafaifo",
    "category": "ẢNH F&B",
    "year": "2025",
    "color": "from-zinc-800/30 to-zinc-950/60",
    "image": "/image/du-an-home/4.webp",
    "description": "Mỗi chiếc bánh Trung Thu là một câu chuyện hương vị, và mỗi hương vị lại nói lên một cá tính riêng. Cùng Wafaifo khám phá xem đâu là vị bánh dành cho bạn mùa Trăng tròn này nhé!",
    "fullDescription": "<p>VỊ&nbsp;TRUNG&nbsp;THU&nbsp;NÀO&nbsp;LÀ&nbsp;&quot;CHÂN&nbsp;ÁI&quot;&nbsp;CỦA&nbsp;BẠN?&nbsp;<img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tce/2/16/1f315.png\" alt=\"🌕\" height=\"16\" width=\"16\"></p><p>Mỗi&nbsp;chiếc&nbsp;bánh&nbsp;Trung&nbsp;Thu&nbsp;là&nbsp;một&nbsp;câu&nbsp;chuyện&nbsp;hương&nbsp;vị,&nbsp;và&nbsp;mỗi&nbsp;hương&nbsp;vị&nbsp;lại&nbsp;nói&nbsp;lên&nbsp;một&nbsp;cá&nbsp;tính&nbsp;riêng.&nbsp;Cùng&nbsp;Wafaifo&nbsp;khám&nbsp;phá&nbsp;xem&nbsp;đâu&nbsp;là&nbsp;vị&nbsp;bánh&nbsp;dành&nbsp;cho&nbsp;bạn&nbsp;mùa&nbsp;Trăng&nbsp;tròn&nbsp;này&nbsp;nhé!</p><p></p><p>&nbsp;Đậu&nbsp;Xanh:&nbsp;Lớp&nbsp;nhân&nbsp;đậu&nbsp;xanh&nbsp;được&nbsp;sên&nbsp;mịn&nbsp;như&nbsp;lụa,&nbsp;tan&nbsp;ngay&nbsp;trong&nbsp;miệng,&nbsp;để&nbsp;lại&nbsp;vị&nbsp;ngọt&nbsp;thanh&nbsp;tao,&nbsp;nhẹ&nbsp;nhàng&nbsp;như&nbsp;một&nbsp;áng&nbsp;mây.&nbsp;Một&nbsp;hương&nbsp;vị&nbsp;cổ&nbsp;điển&nbsp;được&nbsp;các&nbsp;đầu&nbsp;bếp&nbsp;chúng&nbsp;tôi&nbsp;nâng&nbsp;niu&nbsp;trong&nbsp;từng&nbsp;công&nbsp;đoạn.</p><p></p><p>&nbsp;Đậu&nbsp;Đỏ:&nbsp;Nhân&nbsp;đậu&nbsp;đỏ&nbsp;ngọt&nbsp;bùi,&nbsp;sánh&nbsp;mịn,&nbsp;mang&nbsp;theo&nbsp;hương&nbsp;thơm&nbsp;ấm&nbsp;áp,&nbsp;gợi&nbsp;nhớ&nbsp;về&nbsp;những&nbsp;mùa&nbsp;Trăng&nbsp;đoàn&nbsp;viên&nbsp;xưa.&nbsp;Chúng&nbsp;tôi&nbsp;giữ&nbsp;trọn&nbsp;vẹn&nbsp;sự&nbsp;mộc&nbsp;mạc&nbsp;của&nbsp;hạt&nbsp;đậu&nbsp;đỏ&nbsp;qua&nbsp;kỹ&nbsp;thuật&nbsp;chế&nbsp;biến&nbsp;công&nbsp;phu.</p><p></p><p>Matcha:&nbsp;Hương&nbsp;Matcha&nbsp;cao&nbsp;cấp&nbsp;thơm&nbsp;mát&nbsp;quyện&nbsp;cùng&nbsp;vị&nbsp;ngọt&nbsp;dịu,&nbsp;để&nbsp;lại&nbsp;hậu&nbsp;vị&nbsp;thanh&nbsp;khiết,&nbsp;sảng&nbsp;khoái&nbsp;nơi&nbsp;đầu&nbsp;lưỡi.&nbsp;Đó&nbsp;là&nbsp;sự&nbsp;phá&nbsp;cách&nbsp;đầy&nbsp;tinh&nbsp;tế,&nbsp;món&nbsp;quà&nbsp;từ&nbsp;những&nbsp;người&nbsp;thợ&nbsp;bánh&nbsp;tài&nbsp;hoa&nbsp;của&nbsp;Wafaifo&nbsp;dành&nbsp;cho&nbsp;khẩu&nbsp;vị&nbsp;hiện&nbsp;đại.</p><p></p><p>&nbsp;Thập&nbsp;Cẩm:&nbsp;Một&nbsp;bản&nbsp;giao&nbsp;hưởng&nbsp;hương&nbsp;vị&nbsp;đúng&nbsp;nghĩa,&nbsp;nơi&nbsp;vị&nbsp;mặn&nbsp;mà&nbsp;của&nbsp;lạp&nbsp;xưởng,&nbsp;vị&nbsp;béo&nbsp;bùi&nbsp;của&nbsp;các&nbsp;loại&nbsp;hạt&nbsp;và&nbsp;vị&nbsp;ngọt&nbsp;của&nbsp;mứt&nbsp;bí&nbsp;hòa&nbsp;quyện&nbsp;một&nbsp;cách&nbsp;hoàn&nbsp;hảo.&nbsp;Mỗi&nbsp;nguyên&nbsp;liệu&nbsp;đều&nbsp;được&nbsp;lựa&nbsp;chọn&nbsp;và&nbsp;cân&nbsp;đo&nbsp;tỉ&nbsp;mỉ,&nbsp;thể&nbsp;hiện&nbsp;tay&nbsp;nghề&nbsp;bậc&nbsp;thầy&nbsp;và&nbsp;sự&nbsp;trân&nbsp;trọng&nbsp;dành&nbsp;cho&nbsp;hương&nbsp;vị&nbsp;truyền&nbsp;thống.</p><p>Vậy&nbsp;đâu&nbsp;là&nbsp;hương&nbsp;vị&nbsp;Trung&nbsp;Thu&nbsp;nói&nbsp;lên&nbsp;cá&nbsp;tính&nbsp;của&nbsp;bạn?&nbsp;Hãy&nbsp;cho&nbsp;Wafaifo&nbsp;biết&nbsp;ở&nbsp;phần&nbsp;bình&nbsp;luận&nbsp;nhé!</p><p>Khám&nbsp;phá&nbsp;trọn&nbsp;bộ&nbsp;bốn&nbsp;vị&nbsp;trong&nbsp;mỗi&nbsp;hộp&nbsp;quà&nbsp;Trung&nbsp;Thu&nbsp;của&nbsp;chúng&nbsp;tôi.&nbsp;Để&nbsp;đặt&nbsp;hàng,&nbsp;vui&nbsp;lòng&nbsp;liên&nbsp;hệ:</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tec/2/16/1f4de.png\" alt=\"📞\" height=\"16\" width=\"16\"></p><p></p>",
    "tags": [],
    "span": "col-span-4",
    "aspect": "aspect-[16/9]",
    "type": "image"
  },
  {
    "id": "69ce3a20001c830d1bd1",
    "slug": "kamito-alpha-2",
    "title": "KAMITO ALPHA 2 ",
    "category": "ẢNH BRANDING",
    "year": "2025",
    "color": "from-zinc-800/30 to-zinc-950/60",
    "image": "/image/du-an-home/5.webp",
    "description": "KAMITO ALPHA 2 – SỨC MẠNH TRONG TỪNG CÚ CHẠM\r\n",
    "fullDescription": "<p>Tinh&nbsp;tế&nbsp;trong&nbsp;từng&nbsp;pha&nbsp;chạm&nbsp;bóng,&nbsp;chính&nbsp;xác&nbsp;ở&nbsp;mọi&nbsp;cú&nbsp;đánh,&nbsp;đó&nbsp;là&nbsp;Kamito&nbsp;Alpha&nbsp;2.</p><p>Còn&nbsp;tại&nbsp;HUGs&nbsp;Studio,&nbsp;cảm&nbsp;hứng&nbsp;thể&nbsp;thao&nbsp;được&nbsp;kể&nbsp;theo&nbsp;một&nbsp;cách&nbsp;khác:</p><p>Đưa&nbsp;vợt&nbsp;vào&nbsp;studio,&nbsp;khai&nbsp;thác&nbsp;ánh&nbsp;sáng&nbsp;–&nbsp;bố&nbsp;cục&nbsp;–&nbsp;góc&nbsp;máy&nbsp;để&nbsp;tạo&nbsp;nên&nbsp;những&nbsp;khung&nbsp;hình&nbsp;tinh&nbsp;gọn,&nbsp;hiện&nbsp;đại&nbsp;và&nbsp;đậm&nbsp;chất&nbsp;thị&nbsp;giác.</p>",
    "tags": [
      "KAMITO ALPHA 2"
    ],
    "span": "col-span-8",
    "aspect": "aspect-[4/3]",
    "type": "image"
  },
  {
    "id": "69cf295a00172e76fc61",
    "slug": "lam-song-chin-huei",
    "title": "Lam Sóng CHIN HUEI",
    "category": "ẢNH BRANDING",
    "year": "2026",
    "color": "from-zinc-800/30 to-zinc-950/60",
    "image": "/image/du-an-home/6.png",
    "description": "TỐI GIẢN",
    "fullDescription": "<p>Với&nbsp;HUGs&nbsp;studio,&nbsp;mỗi&nbsp;chất&nbsp;liệu&nbsp;đều&nbsp;có&nbsp;ngôn&nbsp;ngữ&nbsp;riêng.</p><p>Đối&nbsp;với&nbsp;sản&nbsp;phẩm&nbsp;tưởng&nbsp;chừng&nbsp;như&nbsp;đơn&nbsp;điệu,&nbsp;khô&nbsp;khan&nbsp;lần&nbsp;này,&nbsp;chúng&nbsp;tôi&nbsp;lựa&nbsp;chọn&nbsp;concept&nbsp;tối&nbsp;giản,&nbsp;không&nbsp;decor&nbsp;màu&nbsp;mè&nbsp;hoa&nbsp;mĩ,&nbsp;tập&nbsp;trung&nbsp;khai&nbsp;thác&nbsp;những&nbsp;góc&nbsp;nhìn&nbsp;làm&nbsp;nổi&nbsp;bật&nbsp;kết&nbsp;cấu&nbsp;đặc&nbsp;trưng&nbsp;và&nbsp;chiều&nbsp;sâu&nbsp;của&nbsp;sản&nbsp;phẩm</p>",
    "tags": [],
    "span": "col-span-6",
    "aspect": "aspect-[16/10]",
    "type": "image"
  },
  {
    "id": "6a192001002d3af039d3",
    "slug": "senatus-khong-chi-la-mot-chai-nuoc-hoa",
    "title": "SENATUS không chỉ là một chai nước hoa",
    "category": "ẢNH BRANDING",
    "year": "2025",
    "color": "from-zinc-800/30 to-zinc-950/60",
    "image": "/image/du-an-home/07.webp",
    "description": "Chạm đến sự đẳng cấp và tinh tế trong từng nốt hương. SENATUS không chỉ là một chai nước hoa, mà còn là tuyên ngôn của phong cách, ",
    "fullDescription": "<p>|ĐÁNH&nbsp;THỨC&nbsp;VỊ&nbsp;VUA&nbsp;TRONG&nbsp;BẠN|</p><p>Chạm&nbsp;đến&nbsp;sự&nbsp;đẳng&nbsp;cấp&nbsp;và&nbsp;tinh&nbsp;tế&nbsp;trong&nbsp;từng&nbsp;nốt&nbsp;hương.&nbsp;SENATUS&nbsp;không&nbsp;chỉ&nbsp;là&nbsp;một&nbsp;chai&nbsp;nước&nbsp;hoa,&nbsp;mà&nbsp;còn&nbsp;là&nbsp;tuyên&nbsp;ngôn&nbsp;của&nbsp;phong&nbsp;cách,&nbsp;là&nbsp;biểu&nbsp;tượng&nbsp;của&nbsp;sự&nbsp;quyền&nbsp;lực&nbsp;và&nbsp;lịch&nbsp;lãm.</p>",
    "tags": [],
    "span": "col-span-6",
    "aspect": "aspect-[21/9]",
    "type": "image"
  }
];
