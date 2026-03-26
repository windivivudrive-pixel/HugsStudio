import { Client, Databases, Permission, Role } from 'node-appwrite';
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

async function fixPermissions() {
  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b';
  const collections = ['categories', 'projects_listing', 'news_articles'];

  for (const collectionId of collections) {
    try {
      console.log(`📡 Updating permissions for [${collectionId}]...`);
      
      // Grant Read permission to 'Any' (public)
      // This allows the frontend to list documents
      await databases.updateCollection(
        DATABASE_ID,
        collectionId,
        collectionId.charAt(0).toUpperCase() + collectionId.slice(1), // Name
        [
          Permission.read(Role.any()), // Public Read
        ],
        true // Enable document level permissions if needed (usually true is fine)
      );
      
      console.log(`✅ Permissions updated for [${collectionId}].`);
      
      // Check if categories collection has data if it's the categories one
      if (collectionId === 'categories') {
          const docs = await databases.listDocuments(DATABASE_ID, collectionId);
          console.log(`📊 Categories count: ${docs.total}`);
          if (docs.total === 0) {
              console.warn('⚠️ Warning: Categories collection is empty!');
          }
      }
    } catch (error) {
      console.error(`❌ Failed to update permissions for [${collectionId}]:`, error.message);
    }
  }
}

fixPermissions();
