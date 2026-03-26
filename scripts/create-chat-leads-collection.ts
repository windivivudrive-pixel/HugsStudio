/**
 * Script: Create `chat_leads` collection in Appwrite
 * Run with: npx tsx scripts/create-chat-leads-collection.ts
 */
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b';
const COLLECTION_ID = 'chat_leads';

async function main() {
  try {
    console.log('📦 Creating chat_leads collection...');

    // Create collection with document-level permissions
    await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Chat Leads',
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
      ]
    );
    console.log('✅ Collection created');

    // session_id — required, unique per chat session
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'session_id', 64, true);
    console.log('  + session_id');

    // name — optional, filled when customer provides it
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'name', 255, false);
    console.log('  + name');

    // phone — optional, filled when customer provides it
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'phone', 20, false);
    console.log('  + phone');

    // email — optional, filled when customer provides it
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'email', 255, false);
    console.log('  + email');

    // conversation — large text field to store JSON array of messages
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'conversation', 1000000, false);
    console.log('  + conversation');

    // status — new / contacted / done
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'status', 20, false, 'new');
    console.log('  + status');

    // Wait for attributes to be ready
    console.log('⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create index on session_id for fast lookups
    await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_session_id', 'unique' as any, ['session_id']);
    console.log('  + index on session_id');

    console.log('🎉 Done! chat_leads collection is ready.');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️ Collection already exists. Skipping creation.');
    } else {
      console.error('❌ Error:', error.message || error);
    }
  }
}

main();
