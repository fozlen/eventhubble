import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import DatabaseService from './databaseService.js'

// Load environment variables
dotenv.config()

// ES modules'da __dirname alternatifi
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Directory paths
const assetsDir = path.join(__dirname, 'assets')
const uploadsDir = path.join(__dirname, 'uploads')

class CloudinaryMigrator {
  constructor() {
    this.migratedFiles = []
    this.failedMigrations = []
    this.backupData = []
  }

  async uploadFileToCloudinary(filePath, folder, fileName) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'image',
        folder: folder,
        public_id: fileName.replace(path.extname(fileName), ''),
        transformation: [
          { quality: 'auto' },
          { format: 'auto' }
        ]
      })
      return result
    } catch (error) {
      console.error(`❌ Cloudinary upload error for ${fileName}:`, error)
      throw error
    }
  }

  async migrateLogos() {
    console.log('\n🔄 Logo migration başlatılıyor...')
    
    try {
      // Get all logos from database
      const logosResult = await DatabaseService.getLogos()
      if (!logosResult.success) {
        throw new Error('Failed to fetch logos from database')
      }
      
      const logos = logosResult.logos || []
      console.log(`📊 Toplam ${logos.length} logo kaydı bulundu`)

      for (const logo of logos) {
        try {
          // Skip if already using Cloudinary URL
          if (logo.file_path && logo.file_path.includes('cloudinary.com')) {
            console.log(`⏩ Zaten Cloudinary'de: ${logo.title}`)
            continue
          }

          // Backup original data
          this.backupData.push({
            type: 'logo',
            id: logo.id,
            original_file_path: logo.file_path
          })

          // Find local file
          let localFilePath = null
          const possiblePaths = [
            path.join(assetsDir, logo.filename),
            path.join(assetsDir, logo.file_path.replace('/', '')),
            path.join(__dirname, logo.file_path.replace('/', ''))
          ]

          for (const possiblePath of possiblePaths) {
            if (await fs.pathExists(possiblePath)) {
              localFilePath = possiblePath
              break
            }
          }

          if (!localFilePath) {
            console.log(`⚠️ Dosya bulunamadı: ${logo.filename} (${logo.title})`)
            this.failedMigrations.push({
              type: 'logo',
              id: logo.id,
              filename: logo.filename,
              reason: 'File not found locally'
            })
            continue
          }

          console.log(`📤 Yükleniyor: ${logo.title}`)
          
          // Upload to Cloudinary
          const cloudinaryResult = await this.uploadFileToCloudinary(
            localFilePath,
            'eventhubble/logos',
            logo.filename
          )

          // Update database with new Cloudinary URL
          const updateResult = await DatabaseService.updateLogo(logo.logo_id, {
            file_path: cloudinaryResult.secure_url,
            width: cloudinaryResult.width,
            height: cloudinaryResult.height,
            file_size: cloudinaryResult.bytes
          })

          if (updateResult.success) {
            console.log(`✅ Logo başarıyla migrate edildi: ${logo.title}`)
            console.log(`   🔗 Yeni URL: ${cloudinaryResult.secure_url}`)
            this.migratedFiles.push({
              type: 'logo',
              id: logo.id,
              title: logo.title,
              old_path: logo.file_path,
              new_path: cloudinaryResult.secure_url
            })
          } else {
            throw new Error(`Database update failed: ${updateResult.error}`)
          }

        } catch (error) {
          console.error(`❌ Logo migration error for ${logo.title}:`, error)
          this.failedMigrations.push({
            type: 'logo',
            id: logo.id,
            filename: logo.filename,
            reason: error.message
          })
        }
      }

    } catch (error) {
      console.error('❌ Logo migration failed:', error)
      throw error
    }
  }

  async migrateImages() {
    console.log('\n🔄 Image migration başlatılıyor...')
    
    try {
      // Get all images from database
      const imagesResult = await DatabaseService.getImages()
      if (!imagesResult.success) {
        throw new Error('Failed to fetch images from database')
      }
      
      const images = imagesResult.images || []
      console.log(`📊 Toplam ${images.length} image kaydı bulundu`)

      for (const image of images) {
        try {
          // Skip if already using Cloudinary URL
          if (image.file_path && image.file_path.includes('cloudinary.com')) {
            console.log(`⏩ Zaten Cloudinary'de: ${image.title}`)
            continue
          }

          // Backup original data
          this.backupData.push({
            type: 'image',
            id: image.id,
            original_file_path: image.file_path
          })

          // Find local file
          let localFilePath = null
          const possiblePaths = [
            path.join(uploadsDir, 'images', image.filename),
            path.join(uploadsDir, image.filename),
            path.join(assetsDir, image.filename),
            path.join(__dirname, image.file_path.replace('/', ''))
          ]

          for (const possiblePath of possiblePaths) {
            if (await fs.pathExists(possiblePath)) {
              localFilePath = possiblePath
              break
            }
          }

          if (!localFilePath) {
            console.log(`⚠️ Dosya bulunamadı: ${image.filename} (${image.title})`)
            this.failedMigrations.push({
              type: 'image',
              id: image.id,
              filename: image.filename,
              reason: 'File not found locally'
            })
            continue
          }

          console.log(`📤 Yükleniyor: ${image.title}`)
          
          // Upload to Cloudinary
          const cloudinaryResult = await this.uploadFileToCloudinary(
            localFilePath,
            'eventhubble/images',
            image.filename
          )

          // Update database with new Cloudinary URL
          const updateResult = await DatabaseService.updateImage(image.image_id, {
            file_path: cloudinaryResult.secure_url,
            width: cloudinaryResult.width,
            height: cloudinaryResult.height,
            file_size: cloudinaryResult.bytes
          })

          if (updateResult.success) {
            console.log(`✅ Image başarıyla migrate edildi: ${image.title}`)
            console.log(`   🔗 Yeni URL: ${cloudinaryResult.secure_url}`)
            this.migratedFiles.push({
              type: 'image',
              id: image.id,
              title: image.title,
              old_path: image.file_path,
              new_path: cloudinaryResult.secure_url
            })
          } else {
            throw new Error(`Database update failed: ${updateResult.error}`)
          }

        } catch (error) {
          console.error(`❌ Image migration error for ${image.title}:`, error)
          this.failedMigrations.push({
            type: 'image',
            id: image.id,
            filename: image.filename,
            reason: error.message
          })
        }
      }

    } catch (error) {
      console.error('❌ Image migration failed:', error)
      throw error
    }
  }

  async rollback() {
    console.log('\n🔄 Rollback başlatılıyor...')
    
    for (const backup of this.backupData) {
      try {
        if (backup.type === 'logo') {
          await DatabaseService.updateLogo(backup.id, {
            file_path: backup.original_file_path
          })
        } else if (backup.type === 'image') {
          await DatabaseService.updateImage(backup.id, {
            file_path: backup.original_file_path
          })
        }
        console.log(`✅ Rollback tamamlandı: ${backup.type} ${backup.id}`)
      } catch (error) {
        console.error(`❌ Rollback error for ${backup.type} ${backup.id}:`, error)
      }
    }
  }

  printSummary() {
    console.log('\n📊 MIGRATION SUMMARY')
    console.log('='.repeat(50))
    console.log(`✅ Başarılı migrations: ${this.migratedFiles.length}`)
    console.log(`❌ Başarısız migrations: ${this.failedMigrations.length}`)
    console.log(`💾 Backup kayıtları: ${this.backupData.length}`)
    
    if (this.migratedFiles.length > 0) {
      console.log('\n✅ BAŞARILI MIGRATIONS:')
      this.migratedFiles.forEach(file => {
        console.log(`   ${file.type}: ${file.title}`)
        console.log(`      Old: ${file.old_path}`)
        console.log(`      New: ${file.new_path}`)
      })
    }
    
    if (this.failedMigrations.length > 0) {
      console.log('\n❌ BAŞARISIZ MIGRATIONS:')
      this.failedMigrations.forEach(fail => {
        console.log(`   ${fail.type}: ${fail.filename} - ${fail.reason}`)
      })
    }
  }

  async run(dryRun = false) {
    console.log('🚀 Cloudinary Migration başlatılıyor...')
    console.log(`Mode: ${dryRun ? 'DRY RUN (test only)' : 'PRODUCTION'}`)
    
    if (dryRun) {
      console.log('⚠️ DRY RUN modunda çalışıyor - hiçbir değişiklik yapılmayacak')
      return
    }

    try {
      // Test Cloudinary connection
      await cloudinary.api.ping()
      console.log('✅ Cloudinary bağlantısı başarılı')

      // Migrate logos
      await this.migrateLogos()
      
      // Migrate images  
      await this.migrateImages()
      
      // Print summary
      this.printSummary()
      
      // Save backup data to file
      await fs.writeJson(path.join(__dirname, 'migration-backup.json'), {
        timestamp: new Date().toISOString(),
        backupData: this.backupData,
        migratedFiles: this.migratedFiles,
        failedMigrations: this.failedMigrations
      }, { spaces: 2 })
      
      console.log('\n💾 Backup data saved to migration-backup.json')
      console.log('🎉 Migration tamamlandı!')
      
    } catch (error) {
      console.error('❌ Migration failed:', error)
      console.log('\n🔄 Rollback başlatılıyor...')
      await this.rollback()
      throw error
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run') || args.includes('-d')
  const rollback = args.includes('--rollback') || args.includes('-r')
  
  const migrator = new CloudinaryMigrator()
  
  if (rollback) {
    // Load backup data
    const backupPath = path.join(__dirname, 'migration-backup.json')
    if (await fs.pathExists(backupPath)) {
      const backupData = await fs.readJson(backupPath)
      migrator.backupData = backupData.backupData || []
      await migrator.rollback()
      console.log('🔄 Rollback tamamlandı!')
    } else {
      console.error('❌ Backup dosyası bulunamadı!')
    }
  } else {
    await migrator.run(dryRun)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Migration error:', error)
    process.exit(1)
  })
}

export default CloudinaryMigrator 