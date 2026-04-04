"use server"

import { Client, Databases, ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import slugify from "slugify";
let appwriteClient: Client | null = null;
let databases: Databases | null = null;

function getAppwrite() {
  if (databases) return { databases, DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b' };
  
  appwriteClient = new Client();
  if (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) appwriteClient.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
  if (process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) appwriteClient.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
  if (process.env.APPWRITE_API_KEY) appwriteClient.setKey(process.env.APPWRITE_API_KEY);

  databases = new Databases(appwriteClient);
  return { databases, DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69ba2ae900156b378b6b' };
}

let r2Client: S3Client | null = null;

function getR2Client() {
  if (r2Client) return r2Client;
  
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const r2Endpoint = process.env.R2_ENDPOINT || "https://c398c001a61063c6d01b34738ab87bd5.r2.cloudflarestorage.com";
  
  console.log("🔐 Checking R2 Credentials...");
  
  if (!r2AccessKeyId || !r2SecretAccessKey) {
    console.error("❌ R2 Credentials Missing: ID?", !!r2AccessKeyId, "Secret?", !!r2SecretAccessKey);
    throw new Error("Cloudflare R2 Credentials (ID or Secret) are missing in .env.local");
  }

  if (r2AccessKeyId.length !== 32) {
    console.error(`❌ R2_ACCESS_KEY_ID length is ${r2AccessKeyId.length}, expected 32.`);
    throw new Error(`R2_ACCESS_KEY_ID length is ${r2AccessKeyId.length}, expected 32. Please check your .env.local`);
  }

  r2Client = new S3Client({
    region: "auto",
    endpoint: r2Endpoint,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });
  
  console.log("✅ R2 Client Initialized with endpoint:", r2Endpoint);
  return r2Client;
}

export async function uploadSingleFileAction(formData: FormData) {
  try {
    console.log("🚀 Manual Image Upload Action triggered");
    const file = formData.get('file') as File | null;
    const url = await uploadFileToR2(file);
    return { success: true, url };
  } catch (error: any) {
    console.error("❌ Manual Upload Error:", error);
    return { success: false, error: error.message };
  }
}

async function uploadFileToR2(file: File | null): Promise<string> {
   if (!file || file.size === 0) {
       console.log("⚠️ No file provided or file is empty.");
       return "";
   }
   
   console.log(`🚀 R2 Upload Initialized: ${file.name} (${Math.round(file.size / 1024)} KB)`);
   
   try {
       const r2 = getR2Client();
       const arrayBuffer = await file.arrayBuffer();
       const buffer = Buffer.from(arrayBuffer);
       console.log(`  ... Buffer created, size: ${buffer.length} bytes`);
       
       const fileExtension = file.name.split('.').pop() || 'png';
       const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
       
       console.log(`  ... Sending PutObjectCommand to bucket: hugsstudioportfolio, key: ${fileName}`);
       
       // Note: We don't have a built-in timeout here easily without extra imports, 
       // but adding this log before the await helps identify if it hangs here.
       const startTime = Date.now();
       await r2.send(
         new PutObjectCommand({
           Bucket: "hugsstudioportfolio",
           Key: fileName,
           Body: buffer,
           ContentType: file.type || "image/png",
         })
       );
       
       const duration = Date.now() - startTime;
       const publicUrl = `https://pub-88ad63c3eebd4d30830e4a7a8644f03f.r2.dev/${fileName}`;
       console.log(`✅ R2 Upload Success in ${duration}ms: ${publicUrl}`);
       return publicUrl;
   } catch (error: any) {
       console.error("❌ R2 Upload FAILED. Check credentials and bucket name.");
       console.error("Error Code:", error.code || error.name);
       console.error("Error Message:", error.message);
       throw new Error(`Cloudflare R2 Upload failed: ${error.message}`);
   }
}

export async function createProject(formData: FormData) {
  try {
    console.log("📝 Received Project Submission");
    const title = formData.get('title') as string;
    const generatedSlug = slugify(title, { lower: true, strict: true, locale: 'vi' });
    console.log(`  - Title: ${title}`);
    console.log(`  - Slug: ${generatedSlug}`);
    
    // Upload image to Cloudflare R2
    const imageFile = formData.get('image') as File | null;
    const imageUrl = await uploadFileToR2(imageFile);

    // Parse Gallery
    let gallery: string[] = [];
    const galleryString = formData.get('gallery') as string;
    if (galleryString) {
      try {
        gallery = JSON.parse(galleryString);
      } catch (e) {
        console.error("Failed to parse gallery JSON", e);
      }
    }

    const data = {
      slug: generatedSlug,
      title: title,
      category: formData.get('category') as string,
      year: formData.get('year') as string,
      color: 'from-zinc-800/30 to-zinc-950/60', // Default
      image: imageUrl,
      description: formData.get('description') as string,
      fullDescription: formData.get('fullDescription') as string,
      tags: formData.get('tags') as string,
      gallery: gallery,
      span: 'md:col-span-6', // Default
      aspect: 'aspect-[4/3]', // Default
      isFavorite: formData.get('isFavorite') === 'on'
    };

    const { databases, DATABASE_ID } = getAppwrite();
    console.log("📡 Creating document in Appwrite [projects_listing]...");
    await (databases as Databases).createDocument(
      DATABASE_ID,
      'projects_listing',
      ID.unique(),
      data
    );

    console.log("✨ Project created successfully!");
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("❌ Create Project Action Error:", error);
    return { success: false, error: error.message };
  }
}

export async function createNews(formData: FormData) {
  try {
    console.log("📝 Received News Submission");
    const title = formData.get('title') as string;
    const generatedSlug = slugify(title, { lower: true, strict: true, locale: 'vi' });
    console.log(`  - Title: ${title}`);
    
    // Upload image to Cloudflare R2
    const imageFile = formData.get('image') as File | null;
    const imageUrl = await uploadFileToR2(imageFile);

    const data = {
      slug: generatedSlug,
      title: title,
      date: formData.get('date') as string,
      category: formData.get('category') as string,
      image: imageUrl,
      content: formData.get('content') as string
    };

    const { databases, DATABASE_ID } = getAppwrite();
    console.log("📡 Creating document in Appwrite [news_articles]...");
    await (databases as Databases).createDocument(
      DATABASE_ID,
      'news_articles',
      ID.unique(),
      data
    );

    console.log("✨ News created successfully!");
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("❌ Create News Action Error:", error);
    return { success: false, error: error.message };
  }
}
export async function validateAdminLogin(username: string, password: string) {
  try {
    const { databases, DATABASE_ID } = getAppwrite();
    console.log(`🔐 Attempting direct login for username: ${username}`);
    const response = await databases.listDocuments(
      DATABASE_ID,
      'admin_users',
      [
        Query.equal('username', username),
        Query.equal('password', password)
      ]
    );

    if (response.documents.length === 0) {
      console.log(`❌ Login failed for: ${username}`);
      return { success: false, error: "Tên đăng nhập hoặc mật khẩu không chính xác" };
    }

    const admin = response.documents[0];
    console.log(`✅ Login successful for: ${username}`);
    return { 
      success: true, 
      user: {
          id: admin.$id,
          username: admin.username,
          email: admin.email
      }
    };
  } catch (error: any) {
    console.error("❌ Admin Login Validation Error:", error);
    return { success: false, error: "Lỗi hệ thống khi xác thực người dùng" };
  }
}

export async function getAdminProjects() {
  try {
    const { databases, DATABASE_ID } = getAppwrite();
    const response = await (databases as Databases).listDocuments(
      DATABASE_ID,
      'projects_listing',
      [Query.orderDesc('$createdAt'), Query.limit(100)]
    );
    // Sanitize documents to plain objects for safe serialization
    const projects = response.documents.map(doc => ({ ...doc }));
    return { success: true, projects };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminNews() {
  try {
    const { databases, DATABASE_ID } = getAppwrite();
    const response = await (databases as Databases).listDocuments(
      DATABASE_ID,
      'news_articles',
      [Query.orderDesc('$createdAt'), Query.limit(100)]
    );
    // Sanitize documents to plain objects for safe serialization
    const news = response.documents.map(doc => ({ ...doc }));
    return { success: true, news };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProject(documentId: string) {
  try {
    const { databases, DATABASE_ID } = getAppwrite();
    await databases.deleteDocument(DATABASE_ID, 'projects_listing', documentId);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteNews(documentId: string) {
  try {
    const { databases, DATABASE_ID } = getAppwrite();
    await databases.deleteDocument(DATABASE_ID, 'news_articles', documentId);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProject(documentId: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const generatedSlug = slugify(title, { lower: true, strict: true, locale: 'vi' });
    
    let imageUrl = formData.get('existingImage') as string;
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFileToR2(imageFile);
    }

    // Parse Gallery
    let gallery: string[] = [];
    const galleryString = formData.get('gallery') as string;
    if (galleryString) {
      try {
        gallery = JSON.parse(galleryString);
      } catch (e) {
        console.error("Failed to parse gallery JSON", e);
      }
    }

    const data: any = {
      slug: generatedSlug,
      title: title,
      category: formData.get('category') as string,
      year: formData.get('year') as string,
      image: imageUrl,
      description: formData.get('description') as string,
      fullDescription: formData.get('fullDescription') as string,
      tags: formData.get('tags') as string,
      isFavorite: formData.get('isFavorite') === 'on'
    };
    
    if (formData.has('gallery')) {
      data.gallery = gallery;
    }

    const { databases, DATABASE_ID } = getAppwrite();
    await databases.updateDocument(DATABASE_ID, 'projects_listing', documentId, data);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateNews(documentId: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const generatedSlug = slugify(title, { lower: true, strict: true, locale: 'vi' });
    
    let imageUrl = formData.get('existingImage') as string;
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFileToR2(imageFile);
    }

    const data = {
      slug: generatedSlug,
      title: title,
      date: formData.get('date') as string,
      category: formData.get('category') as string,
      image: imageUrl,
      content: formData.get('content') as string
    };

    const { databases, DATABASE_ID } = getAppwrite();
    await databases.updateDocument(DATABASE_ID, 'news_articles', documentId, data);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
