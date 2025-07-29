import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables eksik!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  constructor() {
    this.supabase = supabase;
  }

  // Blog posts tablosunu oluştur
  async createBlogPostsTable() {
    try {
      const { error } = await this.supabase
        .from('blog_posts')
        .select('*')
        .limit(1);
      
      if (error && error.code === '42P01') {
        // Tablo yok, SQL ile oluştur
        const { error: createError } = await this.supabase.rpc('create_blog_posts_table');
        if (createError) {
          console.log('📝 Blog posts tablosu otomatik oluşturulacak...');
        }
      }
      return true;
    } catch (error) {
      console.log('📝 Blog posts tablosu otomatik oluşturulacak...');
      return true;
    }
  }

  // Tüm blog posts'ları getir
  async getBlogPosts() {
    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Blog posts getirme hatası:', error);
      return [];
    }
  }

  // ID'ye göre blog post getir
  async getBlogPostById(id) {
    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Blog post getirme hatası:', error);
      return null;
    }
  }

  // Yeni blog post oluştur
  async createBlogPost(blogData) {
    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .insert([{
          title_tr: blogData.title_tr,
          title_en: blogData.title_en,
          content_tr: blogData.content_tr,
          content_en: blogData.content_en,
          excerpt_tr: blogData.excerpt_tr,
          excerpt_en: blogData.excerpt_en,
          image_url: blogData.image_url,
          slug: `${blogData.title_en || blogData.title_tr || 'blog'}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          author_name: blogData.author || 'Admin',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Blog post oluşturma hatası:', error);
      throw error;
    }
  }

  // Blog post güncelle
  async updateBlogPost(id, blogData) {
    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .update({
          title_tr: blogData.title_tr,
          title_en: blogData.title_en,
          content_tr: blogData.content_tr,
          content_en: blogData.content_en,
          excerpt_tr: blogData.excerpt_tr,
          excerpt_en: blogData.excerpt_en,
          image_url: blogData.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Blog post güncelleme hatası:', error);
      throw error;
    }
  }

  // Blog post sil
  async deleteBlogPost(id) {
    try {
      const { error } = await this.supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Blog post silme hatası:', error);
      throw error;
    }
  }

  // Bağlantıyı test et
  async testConnection() {
    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select('count')
        .limit(1);

      if (error && error.code === '42P01') {
        // Tablo yok, bu normal
        return true;
      }
      
      return !error;
    } catch (error) {
      console.error('❌ Supabase bağlantı testi hatası:', error);
      return false;
    }
  }
}

export default new SupabaseService(); 