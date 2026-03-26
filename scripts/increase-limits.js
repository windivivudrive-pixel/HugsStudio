import { Client, Databases } from 'node-appwrite';
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

async function increaseLimits() {
  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b';
  
  const targets = [
    { coll: 'news_articles', attr: 'content', size: 100000 },
    { coll: 'projects_listing', attr: 'fullDescription', size: 100000 }
  ];

  for (const target of targets) {
    try {
      console.log(`📡 Processing [${target.coll}] -> [${target.attr}]...`);
      
      // Delete existing attribute
      try {
          console.log(`  🗑️ Deleting old [${target.attr}]...`);
          await databases.deleteAttribute(DATABASE_ID, target.coll, target.attr);
          
          // Wait for deletion
          let deleted = false;
          while (!deleted) {
              try {
                  const coll = await databases.getCollection(DATABASE_ID, target.coll);
                  if (!coll.attributes.find(a => a.key === target.attr)) {
                      deleted = true;
                  } else {
                      await new Promise(r => setTimeout(r, 2000));
                  }
              } catch (e) { deleted = true; }
          }
      } catch (e) {
          console.log(`  ℹ️ Attribute didn't exist or already deleted.`);
      }

      // Create new attribute with larger size
      console.log(`  ✨ Creating new [${target.attr}] with size ${target.size}...`);
      await databases.createStringAttribute(DATABASE_ID, target.coll, target.attr, target.size, true);
      
      console.log(`✅ [${target.attr}] updated.`);
    } catch (error) {
      console.error(`❌ Failed to update [${target.attr}]:`, error.message);
    }
  }
}

increaseLimits();
