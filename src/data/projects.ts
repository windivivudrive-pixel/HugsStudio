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
}

export const projectsData: Project[] = [
  {
    id: 1,
    slug: "luxe-horizon",
    title: "Luxe Horizon",
    category: "ẢNH BRANDING",
    year: "2024",
    color: "from-zinc-800/30 to-zinc-950/60",
    image: "/image/demo1.png",
    description: "Nâng tầm đẳng cấp cho thương hiệu thời trang cao cấp.",
    fullDescription: "Luxe Horizon là một trong những dự án mang tính đột phá của chúng tôi trong lĩnh vực thời trang. Chúng tôi đã xây dựng hệ thống nhận diện thương hiệu từ con số không, tập trung vào sự tối giản nhưng vẫn toát lên vẻ sang trọng. Dự án bao gồm thiết kế logo, bộ nhận diện văn phòng, bao bì và chiến dịch ra mắt kỹ thuật số.",
    tags: ["Brand Strategy", "Visual Identity", "Fashion", "Luxury"],
    span: "col-span-1 md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: 2,
    slug: "neon-drift",
    title: "Neon Drift",
    category: "ẢNH LIFESTYLE",
    year: "2024",
    color: "from-neutral-800/30 to-neutral-950/60",
    image: "/image/demo2.png",
    description: "Trải nghiệm số đầy năng lượng cho thế hệ tương lai.",
    fullDescription: "Neon Drift là một nền tảng thương mại điện tử dành cho giới trẻ yêu thích phong cách cyberpunk. Chúng tôi đã sử dụng những công nghệ web tiên tiến nhất để tạo ra các hiệu ứng chuyển động mượt mà, màu sắc neon rực rỡ và trải nghiệm người dùng độc đáo. Website không chỉ là nơi mua sắm mà còn là một không gian nghệ thuật số.",
    tags: ["Web Design", "UI/UX", "E-commerce", "Cyberpunk"],
    span: "col-span-1 md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    id: 3,
    slug: "obsidian-edge",
    title: "Obsidian Edge",
    category: "QUAY TVC",
    year: "2023",
    color: "from-stone-800/30 to-stone-950/60",
    image: "/image/demo5.png",
    description: "Sức mạnh chuyển động trong từng khung hình.",
    fullDescription: "Obsidian Edge là dự án motion design thực hiện cho một thương hiệu xe điện cao cấp. Chúng tôi đã kết hợp giữa kỹ xảo 3D và đồ họa 2D để tạo ra những thước phim quảng cáo ấn tượng, tôn vinh những đường nét thiết kế tinh xảo của sản phẩm. Sự mượt mà và nhịp điệu chính là chìa khóa của dự án này.",
    tags: ["Motion graphics", "3D Animation", "Automotive", "VFX"],
    span: "col-span-1 md:col-span-5",
    aspect: "aspect-square",
  },
  {
    id: 4,
    slug: "solar-flux",
    title: "Solar Flux",
    category: "CHỤP ẢNH TÁCH NỀN",
    year: "2023",
    color: "from-gray-800/30 to-gray-950/60",
    image: "/image/demo 3.png",
    description: "Định hướng tương lai cho năng lượng xanh.",
    fullDescription: "Với Solar Flux, chúng tôi không chỉ thiết kế hình ảnh mà còn xây dựng một câu chuyện thương hiệu ý nghĩa. Mục tiêu là làm cho khái niệm năng lượng mặt trời trở nên gần gũi và hấp dẫn hơn với các hộ gia đình. Chiến lược đã giúp thương hiệu tiếp cận được hàng ngàn khách hàng mới ngay trong tháng đầu tiên.",
    tags: ["Brand Strategy", "Content Strategy", "Green Tech", "Marketing"],
    span: "col-span-1 md:col-span-7",
    aspect: "aspect-[16/9]",
  },
  {
    id: 5,
    slug: "arctic-pulse",
    title: "Arctic Pulse",
    category: "PROFILE CÁ NHÂN/DOANH NGHIỆP",
    year: "2024",
    color: "from-slate-800/30 to-slate-950/60",
    image: "/image/demo  4 .png",
    description: "Giao diện tinh khiết như băng giá phương Bắc.",
    fullDescription: "Arctic Pulse là ứng dụng theo dõi sức khỏe và giấc ngủ với triết lý thiết kế tối giản. Chúng tôi tập trung vào việc giảm thiểu sự xao nhãng cho người dùng, sử dụng các khoảng trắng thông minh và độ tương phản nhẹ nhàng. Ứng dụng đã nhận được nhiều giải thưởng về thiết kế trải nghiệm người dùng.",
    tags: ["App Design", "Mobile App", "Health", "Minimalism"],
    span: "col-span-1 md:col-span-8",
    aspect: "aspect-[4/3]",
  },
  {
    id: 6,
    slug: "velvet-storm",
    title: "Velvet Storm",
    category: "ẢNH F&B",
    year: "2023",
    color: "from-neutral-800/30 to-stone-950/60",
    image: "/image/demo 6.png",
    description: "Ghi lại những khoảnh khắc đầy cảm xúc.",
    fullDescription: "Dự án nhiếp ảnh Velvet Storm là sự kết hợp giữa thời trang và thiên nhiên. Chúng tôi đã thực hiện các bộ ảnh tại những địa điểm khắc nghiệt nhưng đầy cảm hứng, sử dụng ánh sáng tự nhiên để tôn vinh vẻ đẹp của con người và trang phục. Bộ ảnh đã được đăng tải trên nhiều tạp chí thời trang quốc tế.",
    tags: ["Photography", "Art Direction", "Fashion", "Editorial"],
    span: "col-span-1 md:col-span-4",
    aspect: "aspect-[16/10]",
  },
  {
    id: 7,
    slug: "aura-nexus",
    title: "Aura Nexus",
    category: "CHỤP ẢNH SỰ KIỆN",
    year: "2024",
    color: "from-slate-800/30 to-slate-950/60",
    image: "/image/demo7.png",
    description: "Kết nối tâm hồn qua không gian kỹ thuật số.",
    fullDescription: "Aura Nexus là một mạng xã hội thế hệ mới tập trung vào sự riêng tư và gắn kết chân thực. Thiết kế của chúng tôi nhấn mạnh vào các vòng kết nối nhỏ, sử dụng các hiệu ứng ánh sáng (aura) để biểu thị tâm trạng và sự hiện diện của người dùng. Một cách tiếp cận hoàn toàn mới cho kỷ nguyên số.",
    tags: ["UI/UX", "Social Media", "Privacy", "Digital Art"],
    span: "col-span-1 md:col-span-12",
    aspect: "aspect-[21/9]",
  },
];
