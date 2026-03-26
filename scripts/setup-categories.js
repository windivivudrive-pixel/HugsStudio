import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error('❌ Missing Appwrite credentials in .env.local!');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function setupCategories() {
  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b';
  const CATEGORIES_COLLECTION_ID = 'categories';

  try {
    console.log(`📡 Connecting to Appwrite at ${ENDPOINT}...`);
    
    try {
      await databases.getCollection(DATABASE_ID, CATEGORIES_COLLECTION_ID);
      console.log(`✅ Categories Collection [${CATEGORIES_COLLECTION_ID}] found.`);
    } catch (e) {
      if (e.code === 404) {
        console.log(`⚠️ Categories Collection not found. Creating [${CATEGORIES_COLLECTION_ID}]...`);
        await databases.createCollection(DATABASE_ID, CATEGORIES_COLLECTION_ID, 'Categories');
        await databases.createStringAttribute(DATABASE_ID, CATEGORIES_COLLECTION_ID, 'name', 255, true);
        console.log('✅ Categories attributes requested.');

        let isReady = false;
        let attempts = 0;
        while (!isReady && attempts < 10) {
            console.log(`  ... Checking if attribute is ready (Attempt ${attempts + 1}/10)`);
            const coll = await databases.getCollection(DATABASE_ID, CATEGORIES_COLLECTION_ID);
            const nameAttr = coll.attributes.find(a => a.key === 'name');
            if (nameAttr && nameAttr.status === 'available') {
               isReady = true;
            } else {
               await new Promise(resolve => setTimeout(resolve, 3000));
               attempts++;
            }
        }

        // Seed initial categories
        const initialCategories = [
            "Nhận Diện Thương Hiệu",
            "Thiết Kế Web",
            "Motion Design",
            "Chiến Lược Thương Hiệu",
            "UI/UX Design",
            "Nhiếp Ảnh",
            "App Design",
            "Product Design",
            "Design System"
        ];

        console.log(`🌱 Seeding categories...`);
        for (const cat of initialCategories) {
            try {
                await databases.createDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, ID.unique(), { name: cat });
                console.log(`  ➕ Category Added: ${cat}`);
            } catch (err) { console.error(`  ❌ Category Error: ${cat}`, err.message); }
        }
      } else {
        throw e;
      }
    }
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupCategories();
