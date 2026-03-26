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

async function addIsFavoriteAttribute() {
  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'hugs_studio_db';
  const PROJECTS_COLLECTION_ID = 'projects_listing'; // from seed-appwrite.js

  try {
    console.log(`📡 Connecting to Appwrite at ${ENDPOINT}...`);
    
    // Check if attribute already exists
    const collection = await databases.getCollection(DATABASE_ID, PROJECTS_COLLECTION_ID);
    const existingAttrs = collection.attributes.map(a => a.key);
    
    if (existingAttrs.includes('isFavorite')) {
      console.log('✅ Attribute "isFavorite" already exists.');
      return;
    }

    console.log('⏳ Adding "isFavorite" attribute to projects_listing...');
    await databases.createBooleanAttribute(DATABASE_ID, PROJECTS_COLLECTION_ID, 'isFavorite', false, false);
    console.log('✅ Attribute creation requested.');
    
    // Wait for attribute to be ready
    let isReady = false;
    let attempts = 0;
    while (!isReady && attempts < 10) {
      console.log(`  ... Checking if attribute is ready (Attempt ${attempts + 1}/10)`);
      const coll = await databases.getCollection(DATABASE_ID, PROJECTS_COLLECTION_ID);
      const isFavAttr = coll.attributes.find(a => a.key === 'isFavorite');
      
      if (isFavAttr && isFavAttr.status === 'available') {
        isReady = true;
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
      }
    }
    
    if (isReady) {
      console.log('🎉 Attribute "isFavorite" is fully available!');
    } else {
      console.warn('⚠️ Attribute "isFavorite" creation is still processing. It may take a few more seconds.');
    }

  } catch (error) {
    console.error('❌ Failed to add attribute:', error);
  }
}

addIsFavoriteAttribute();
