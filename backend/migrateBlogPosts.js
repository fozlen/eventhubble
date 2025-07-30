// Blog Posts Migration Script - Updated to use Supabase instead of MongoDB
import DatabaseService from './databaseService.js'
import fs from 'fs'
import csv from 'csv-parser'

async function migrateBlogPosts() {
  console.log('🔄 Blog posts migration başlatılıyor...')
  
  try {
    const csvPath = './blog_posts_sample.csv'
    
    if (!fs.existsSync(csvPath)) {
      console.log('❌ blog_posts_sample.csv dosyası bulunamadı')
      return
    }

    const blogPosts = []
    
    // CSV dosyasını oku
    const readCSV = () => {
      return new Promise((resolve, reject) => {
        fs.createReadStream(csvPath)
          .pipe(csv())
          .on('data', (data) => {
            blogPosts.push({
              slug: data.slug || `blog-${Date.now()}-${blogPosts.length}`,
              title_tr: data.title_tr || data.title || '',
              title_en: data.title_en || data.title || '',
              excerpt_tr: data.excerpt_tr || '',
              excerpt_en: data.excerpt_en || '',
              content_tr: data.content_tr || data.content || '',
              content_en: data.content_en || data.content || '',
              category: data.category || 'general',
              author_name: data.author_name || data.author || 'Admin',
              is_published: data.is_published === 'true' || data.is_published === true,
              is_featured: data.is_featured === 'true' || data.is_featured === true,
              seo_title: data.seo_title || '',
              seo_description: data.seo_description || '',
              tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
            })
          })
          .on('end', resolve)
          .on('error', reject)
      })
    }

    await readCSV()
    console.log(`📝 ${blogPosts.length} blog post veri olarak hazırlandı`)

    // Supabase'e blog posts'ları ekle
    let successCount = 0
    let errorCount = 0

    for (const post of blogPosts) {
      try {
        const result = await DatabaseService.createBlogPost(post)
        if (result.success) {
          successCount++
          console.log(`✅ Blog post eklendi: ${post.title_tr || post.title_en}`)
        } else {
          errorCount++
          console.log(`❌ Blog post eklenemedi: ${post.title_tr || post.title_en}`)
        }
      } catch (error) {
        errorCount++
        console.error(`❌ Blog post eklenirken hata: ${error.message}`)
      }
    }

    console.log(`\n🎉 Migration tamamlandı!`)
    console.log(`✅ Başarılı: ${successCount}`)
    console.log(`❌ Hatalı: ${errorCount}`)
    
  } catch (error) {
    console.error('❌ Migration hatası:', error)
  }
}

// Script çalıştır
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateBlogPosts()
}

export default migrateBlogPosts 