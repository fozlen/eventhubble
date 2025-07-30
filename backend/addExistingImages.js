import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import DatabaseService from './databaseService.js'
import CloudinaryMigrator from './migrateToCloudinary.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function addExistingImages() {
  console.log('🔄 Mevcut dosyaları veritabanına ekleme başlatılıyor...')
  
  const uploadsImagesDir = path.join(__dirname, 'uploads', 'images')
  
  try {
    // Check if uploads/images directory exists
    if (!await fs.pathExists(uploadsImagesDir)) {
      console.log('❌ uploads/images klasörü bulunamadı')
      return
    }
    
    // Get all files in uploads/images
    const files = await fs.readdir(uploadsImagesDir)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)
    })
    
    console.log(`📁 ${imageFiles.length} resim dosyası bulundu:`, imageFiles)
    
    // Add each file to database
    for (const filename of imageFiles) {
      try {
        const filePath = path.join(uploadsImagesDir, filename)
        const stats = await fs.stat(filePath)
        
        // Determine file info
        const ext = path.extname(filename)
        const baseName = path.basename(filename, ext)
        const mimeType = ext === '.svg' ? 'image/svg+xml' :
                        ext === '.png' ? 'image/png' :
                        ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                        ext === '.gif' ? 'image/gif' :
                        ext === '.webp' ? 'image/webp' : 'image/unknown'
        
        const imageData = {
          image_id: `img_${baseName}_${Date.now()}`,
          category: 'Events',
          title: baseName.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          alt_text: `Event image: ${baseName}`,
          filename: filename,
          file_path: `/uploads/images/${filename}`, // Local path initially
          file_size: stats.size,
          mime_type: mimeType,
          width: null, // Will be set during Cloudinary upload
          height: null, // Will be set during Cloudinary upload
          tags: ['event', 'uploaded'],
          metadata: {
            original_upload: 'existing_file',
            added_date: new Date().toISOString()
          },
          is_active: true
        }
        
        // Check if already exists
        const existing = await DatabaseService.getImages()
        const alreadyExists = existing.success && existing.images.some(img => img.filename === filename)
        
        if (alreadyExists) {
          console.log(`⏩ Zaten var: ${filename}`)
          continue
        }
        
        // Add to database
        const result = await DatabaseService.createImage(imageData)
        
        if (result.success) {
          console.log(`✅ Veritabanına eklendi: ${filename}`)
        } else {
          console.log(`❌ Veritabanına eklenemedi: ${filename} - ${result.error}`)
        }
        
      } catch (error) {
        console.error(`❌ Dosya işlenirken hata: ${filename}`, error.message)
      }
    }
    
    console.log('\n🎉 Dosyalar veritabanına eklendi!')
    
    // Now run migration
    console.log('\n🔄 Cloudinary migration başlatılıyor...')
    const migrator = new CloudinaryMigrator()
    await migrator.run(false)
    
  } catch (error) {
    console.error('❌ İşlem sırasında hata:', error)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addExistingImages().catch(error => {
    console.error('❌ Script error:', error)
    process.exit(1)
  })
}

export default addExistingImages 