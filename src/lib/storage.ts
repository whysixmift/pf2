import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-media';

const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Local upload dir fallback for dev
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

async function ensureBucketExists() {
  if (!supabase) return;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some(b => b.name === BUCKET_NAME);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: true });
    }
  } catch (err) {
    console.warn('Could not verify Supabase storage bucket:', err);
  }
}

export async function uploadMedia(fileBuffer: Buffer, originalFilename: string, mimeType: string): Promise<string> {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalFilename) || '.jpg';
  const filename = `${path.basename(originalFilename, ext)}-${uniqueSuffix}${ext}`;

  if (supabase) {
    await ensureBucketExists();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  } else {
    // Local storage fallback
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    const filepath = path.join(UPLOAD_DIR, filename);
    await fs.promises.writeFile(filepath, fileBuffer);
    return `/uploads/${filename}`;
  }
}

export async function deleteMedia(filename: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filename]);
    if (error) {
      console.error('Supabase Storage delete error:', error);
      return false;
    }
    return true;
  } else {
    const filepath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(filepath)) {
      await fs.promises.unlink(filepath);
      return true;
    }
    return false;
  }
}

export async function listMedia(): Promise<{ filename: string; url: string; createdAt: Date }[]> {
  if (supabase) {
    await ensureBucketExists();
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
    if (error || !data) return [];
    
    return data.map(item => {
      const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(item.name).data.publicUrl;
      return {
        filename: item.name,
        url: publicUrl,
        createdAt: new Date(item.created_at || Date.now())
      };
    });
  } else {
    if (!fs.existsSync(UPLOAD_DIR)) return [];
    const files = await fs.promises.readdir(UPLOAD_DIR);
    return files.map(file => ({
      filename: file,
      url: `/uploads/${file}`,
      createdAt: fs.statSync(path.join(UPLOAD_DIR, file)).mtime
    }));
  }
}
