import { Client, Databases, Storage, Account } from 'appwrite';

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b';

if (!ENDPOINT || !PROJECT_ID) {
  console.warn('⚠️ Appwrite credentials missing. Please check your .env.local file.');
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

export const APPWRITE_CONFIG = {
  ENDPOINT,
  PROJECT_ID,
  DATABASE_ID,
  COLLECTIONS: {
    NEWS: 'news_articles',
    PROJECTS: 'projects_listing',
    ADMIN_USERS: 'admin_users',
    CHAT_LEADS: 'chat_leads',
  }
};

export default client;
