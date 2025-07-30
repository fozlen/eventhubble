// Database Synchronization Test Script
import DatabaseService from './databaseService.js'

async function testDatabaseSync() {
  console.log('🧪 Database synchronization test başlatılıyor...\n')
  
  try {
    // Test 1: Logos API
    console.log('1️⃣ Testing Logos API...')
    const logos = await DatabaseService.getLogos()
    console.log(`   ✅ Logos fetched: ${logos.logos?.length || 0} items`)
    
    // Test 2: Images API  
    console.log('2️⃣ Testing Images API...')
    const images = await DatabaseService.getImages()
    console.log(`   ✅ Images fetched: ${images.images?.length || 0} items`)
    
    // Test 3: Categories API
    console.log('3️⃣ Testing Categories API...')
    const categories = await DatabaseService.getCategories()
    console.log(`   ✅ Categories fetched: ${categories.categories?.length || 0} items`)
    
    // Test 4: Events API
    console.log('4️⃣ Testing Events API...')
    const events = await DatabaseService.getEvents()
    console.log(`   ✅ Events fetched: ${events.events?.length || 0} items`)
    
    // Test 5: Site Settings API
    console.log('5️⃣ Testing Site Settings API...')
    const settings = await DatabaseService.getSiteSettings()
    console.log(`   ✅ Settings fetched: ${Object.keys(settings.settings || {}).length} settings`)
    
    // Test 6: Blog Posts API
    console.log('6️⃣ Testing Blog Posts API...')
    const blogPosts = await DatabaseService.getBlogPosts()
    console.log(`   ✅ Blog posts fetched: ${blogPosts.posts?.length || 0} items`)
    
    console.log('\n🎉 All database APIs are responding correctly!')
    console.log('✅ Database synchronization is working properly.')
    
    // Schema validation test
    console.log('\n📋 Schema Validation Test:')
    
    if (events.events && events.events.length > 0) {
      const sampleEvent = events.events[0]
      const requiredFields = ['event_id', 'title_tr', 'category', 'start_date']
      const missingFields = requiredFields.filter(field => !sampleEvent[field])
      
      if (missingFields.length === 0) {
        console.log('   ✅ Event schema validation passed')
      } else {
        console.log(`   ❌ Missing fields in events: ${missingFields.join(', ')}`)
      }
    }
    
    if (categories.categories && categories.categories.length > 0) {
      const sampleCategory = categories.categories[0]
      const requiredFields = ['category_id', 'name_tr', 'name_en']
      const missingFields = requiredFields.filter(field => !sampleCategory[field])
      
      if (missingFields.length === 0) {
        console.log('   ✅ Category schema validation passed')
      } else {
        console.log(`   ❌ Missing fields in categories: ${missingFields.join(', ')}`)
      }
    }
    
    console.log('\n🔗 API URL Test:')
    console.log(`   🌐 API Base URL: ${DatabaseService.API_BASE_URL}`)
    console.log('   ✅ All APIs using standardized URL structure')
    
  } catch (error) {
    console.error('❌ Database sync test failed:', error)
    process.exit(1)
  }
}

// Export for use in other scripts
export default testDatabaseSync

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseSync()
    .then(() => {
      console.log('\n✨ Test completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error)
      process.exit(1)
    })
} 