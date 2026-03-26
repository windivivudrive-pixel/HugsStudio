const { Client, Databases, ID } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b';
const COLLECTION_ID = 'admin_users';

async function setupAdminUsers() {
    try {
        console.log('🚀 Setting up [admin_users] collection...');

        // 1. Create Collection
        try {
            await databases.createCollection(DATABASE_ID, COLLECTION_ID, 'Admin Users');
            console.log('✅ Collection [admin_users] created.');
        } catch (e) {
            if (e.code === 409) {
                console.log('ℹ️ Collection [admin_users] already exists.');
            } else {
                throw e;
            }
        }

        // 2. Create Attributes
        const attributes = [
            { key: 'username', type: 'string', size: 100, required: true },
            { key: 'email', type: 'string', size: 255, required: true },
            { key: 'password', type: 'string', size: 255, required: true },
        ];

        for (const attr of attributes) {
            try {
                await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, attr.key, attr.size, attr.required);
                console.log(`✅ Attribute [${attr.key}] created.`);
            } catch (e) {
                if (e.code === 409) {
                    console.log(`ℹ️ Attribute [${attr.key}] already exists.`);
                } else {
                    console.error(`❌ Error creating [${attr.key}]:`, e.message);
                }
            }
        }

        console.log('\n⏳ Waiting for attributes to index (5 seconds)...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 3. Create Indexes
        try {
            await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_username', 'unique', ['username'], ['asc']);
            console.log('✅ Unique Index [idx_username] created.');
        } catch (e) {
            if (e.code === 409) {
                console.log('ℹ️ Index [idx_username] already exists.');
            } else {
                console.error('❌ Error creating index:', e.message);
            }
        }

        console.log('\n✨ Setup Complete!');
        console.log(`👉 Next Step: Go to Appwrite Console -> Database -> [admin_users] and add a document:`);
        console.log(`   - username: (Your desired name, e.g. "win")`);
        console.log(`   - email: (Your login email, e.g. "admin@hugs.studio")`);

    } catch (error) {
        console.error('❌ Setup Failed:', error.message);
    }
}

setupAdminUsers();
