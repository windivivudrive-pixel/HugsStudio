import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error('❌ Missing Appwrite credentials in .env.local!');
  console.error('Ensure NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, and APPWRITE_API_KEY are set.');
  process.exit(1);
}

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// Mock Data - News
const articlesData = [
  {
    slug: "designing-products-scale",
    title: "Designing products that scale with growth",
    date: "Jun 9, 2025",
    category: "Product Design",
    image: "/image/news_1.png",
    content: "Sự phát triển của sản phẩm kéo theo vô vàn thách thức về kiến trúc và thiết kế..."
  },
  {
    slug: "design-systems-save-time",
    title: "How design systems save development time",
    date: "Jun 19, 2025",
    category: "Design System",
    image: "/image/news_2.png",
    content: "Không chỉ là một thư viện component, Design System là ngôn ngữ chung giữa Designer và Developer..."
  },
  {
    slug: "clean-intuitive-ui",
    title: "Why clean & intuitive UI improves user decisions",
    date: "Nov 30, 2025",
    category: "UI/UX Design",
    image: "/image/news_3.png",
    content: "Một giao diện rối rắm làm giảm đáng kể tỷ lệ chuyển đổi..."
  },
  {
    slug: "immersive-motion-experiences",
    title: "Building immersive motion experiences",
    date: "Dec 12, 2025",
    category: "Motion Design",
    image: "/image/news_4.png",
    content: "Motion không chỉ để 'cho mượt'. Motion là tín hiệu phản hồi (feedback)..."
  },
  {
    slug: "minimalist-brand-identity",
    title: "The essence of minimalist brand identity",
    date: "Jan 05, 2026",
    category: "Brand Identity",
    image: "/image/news_5.png",
    content: "Nhận diện thương hiệu tối giản giúp doanh nghiệp truyền tải thông điệp một cách sắc bén..."
  }
];

// Mock Data - Projects
const projectsData = [
  {
    slug: "luxe-horizon",
    title: "Luxe Horizon",
    category: "Nhận Diện Thương Hiệu",
    year: "2024",
    color: "from-zinc-800/30 to-zinc-950/60",
    image: "/image/demo1.png",
    description: "Nâng tầm đẳng cấp cho thương hiệu thời trang cao cấp.",
    fullDescription: "Luxe Horizon là một trong những dự án mang tính đột phá...",
    tags: "Brand Strategy, Visual Identity, Fashion, Luxury",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]"
  },
  {
    slug: "neon-drift",
    title: "Neon Drift",
    category: "Thiết Kế Web",
    year: "2024",
    color: "from-neutral-800/30 to-neutral-950/60",
    image: "/image/demo2.png",
    description: "Trải nghiệm số đầy năng lượng cho thế hệ tương lai.",
    fullDescription: "Neon Drift là một nền tảng thương mại điện tử dành cho giới trẻ...",
    tags: "Web Design, UI/UX, E-commerce, Cyberpunk",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]"
  },
  {
    slug: "obsidian-edge",
    title: "Obsidian Edge",
    category: "Motion Design",
    year: "2023",
    color: "from-stone-800/30 to-stone-950/60",
    image: "/image/demo5.png",
    description: "Sức mạnh chuyển động trong từng khung hình.",
    fullDescription: "Obsidian Edge là dự án motion design thực hiện cho một thương hiệu xe điện cao cấp...",
    tags: "Motion graphics, 3D Animation, Automotive, VFX",
    span: "md:col-span-12",
    aspect: "aspect-square"
  }
];

async function seedAppwrite() {
  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b';
  const NEWS_COLLECTION_ID = 'news_articles';
  const PROJECTS_COLLECTION_ID = 'projects_listing';

  try {
    console.log(`📡 Connecting to Appwrite at ${ENDPOINT}...`);
    
    // 1. Try to get or create Database
    try {
      await databases.get(DATABASE_ID);
      console.log(`✅ Database [${DATABASE_ID}] found.`);
    } catch (e) {
      if (e.code === 404) {
        console.log(`⚠️ Database not found. Creating [${DATABASE_ID}]...`);
        await databases.create(DATABASE_ID, 'HUGs STUDIO DB');
      } else {
        throw e;
      }
    }

    // 2. Setup News Collection
    try {
      await databases.getCollection(DATABASE_ID, NEWS_COLLECTION_ID);
      console.log(`✅ News Collection [${NEWS_COLLECTION_ID}] found.`);
    } catch (e) {
      if (e.code === 404) {
        console.log(`⚠️ News Collection not found. Creating [${NEWS_COLLECTION_ID}]...`);
        await databases.createCollection(DATABASE_ID, NEWS_COLLECTION_ID, 'News Articles');
        await databases.createStringAttribute(DATABASE_ID, NEWS_COLLECTION_ID, 'slug', 255, true);
        await databases.createStringAttribute(DATABASE_ID, NEWS_COLLECTION_ID, 'title', 255, true);
        await databases.createStringAttribute(DATABASE_ID, NEWS_COLLECTION_ID, 'date', 255, true);
        await databases.createStringAttribute(DATABASE_ID, NEWS_COLLECTION_ID, 'category', 255, true);
        await databases.createStringAttribute(DATABASE_ID, NEWS_COLLECTION_ID, 'image', 1024, true);
        await databases.createStringAttribute(DATABASE_ID, NEWS_COLLECTION_ID, 'content', 10000, true);
        console.log('✅ News attributes requested.');
      }
    }

    // 3. Setup Project Collection
    try {
      await databases.getCollection(DATABASE_ID, PROJECTS_COLLECTION_ID);
      console.log(`✅ Projects Collection [${PROJECTS_COLLECTION_ID}] found.`);
    } catch (e) {
      if (e.code === 404) {
        console.log(`⚠️ Projects Collection not found. Creating [${PROJECTS_COLLECTION_ID}]...`);
        await databases.createCollection(DATABASE_ID, PROJECTS_COLLECTION_ID, 'Projects Listing');
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'slug', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'title', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'category', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'year', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'color', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'image', 1024, true);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'description', 1000, true);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'fullDescription', 10000, true);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'tags', 1000, true);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'span', 255, false);
        await databases.createStringAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'aspect', 255, false);
        console.log('✅ Project attributes requested.');
      }
    }

    // New Helper: Wait for attributes to be ready
    async function waitForAttributes(dbId, collId, requiredAttrs) {
      console.log(`⏳ Verifying attributes for [${collId}]...`);
      let allReady = false;
      let attempts = 0;
      while (!allReady && attempts < 10) {
        const collection = await databases.getCollection(dbId, collId);
        const readyAttrs = collection.attributes
          .filter(a => a.status === 'available')
          .map(a => a.key);
        
        allReady = requiredAttrs.every(attr => readyAttrs.includes(attr));
        if (!allReady) {
          console.log(`  ... Some attributes still processing. Waiting 5s (Attempt ${attempts + 1}/10)`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          attempts++;
        }
      }
      if (!allReady) throw new Error(`Attributes for ${collId} failed to become available in time.`);
      console.log(`✅ All attributes for [${collId}] are ready.`);
    }

    await waitForAttributes(DATABASE_ID, NEWS_COLLECTION_ID, ['slug', 'title', 'date', 'category', 'image', 'content']);
    await waitForAttributes(DATABASE_ID, PROJECTS_COLLECTION_ID, ['slug', 'title', 'category', 'year', 'color', 'image', 'description', 'fullDescription', 'tags', 'span', 'aspect']);

    // 4. Seed Data
    console.log(`🌱 Seeding data...`);
    
    for (const article of articlesData) {
      try {
        await databases.createDocument(DATABASE_ID, NEWS_COLLECTION_ID, ID.unique(), article);
        console.log(`  ➕ News Added: ${article.title}`);
      } catch (err) { console.error(`  ❌ News Error: ${article.title}`, err.message); }
    }

    for (const project of projectsData) {
      try {
        await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, ID.unique(), project);
        console.log(`  ➕ Project Added: ${project.title}`);
      } catch (err) { console.error(`  ❌ Project Error: ${project.title}`, err.message); }
    }

    console.log('🎉 Database seeding complete!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedAppwrite();
