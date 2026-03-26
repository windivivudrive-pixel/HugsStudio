import { Client, Databases, ID, Query } from 'node-appwrite';
import { articlesData } from '../data/news';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b';
const API_KEY = process.env.APPWRITE_API_KEY || '';
const COLLECTION_ID = 'news_articles';

if (!API_KEY) {
    console.error('❌ APPWRITE_API_KEY is missing in .env.local');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function syncNews() {
    console.log('🚀 Starting synchronization of 10 sample news articles to Appwrite...');
    console.log(`📡 Endpoint: ${ENDPOINT}`);
    console.log(`🆔 Project: ${PROJECT_ID}`);

    for (const article of articlesData) {
        try {
            // Check if slug already exists to avoid duplicates
            const existing = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal('slug', article.slug)]
            );

            if (existing.total > 0) {
                console.log(`⏩ Skipping "${article.title}" (slug exists)`);
                continue;
            }

            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    title: article.title,
                    slug: article.slug,
                    date: article.date,
                    category: article.category,
                    image: article.image,
                    content: article.content
                }
            );
            console.log(`✅ Created: ${article.title}`);
        } catch (error: any) {
            console.error(`❌ Error creating "${article.title}":`, error.message);
        }
    }

    console.log('🏁 Sync complete!');
}

syncNews();
