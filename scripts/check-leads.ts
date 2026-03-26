import { Client, Databases, Query } from 'node-appwrite';
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

async function check() {
  try {
    const list = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('$createdAt'),
      Query.limit(5)
    ]);
    console.log('Recent leads:');
    list.documents.forEach((doc: any) => {
      console.log(`- ID: ${doc.$id}, Session: ${doc.session_id}, Name: ${doc.name}, Phone: ${doc.phone}, Email: ${doc.email}`);
    });
  } catch (error) {
    console.error('Error checking leads:', error);
  }
}

check();
