const { MongoClient } = require('mongodb')

class Database {
  constructor() {
    this.client = null
    this.db = null
    this.isConnected = false
  }

  async connect() {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb+srv://fozlenn:hhfOp8pYrWrQnMJp@cluster0.nzkre9w.mongodb.net/eventhubble?retryWrites=true&w=majority&appName=Cluster0'
      
      this.client = new MongoClient(uri)

      await this.client.connect()
      this.db = this.client.db('eventhubble')
      this.isConnected = true
      
      console.log('✅ MongoDB bağlantısı başarılı')
      
      // Collections'ları oluştur
      await this.createCollections()
      
      return this.db
    } catch (error) {
      console.error('❌ MongoDB bağlantı hatası:', error)
      throw error
    }
  }

  async createCollections() {
    try {
      // Events collection
      await this.db.createCollection('events')
      
      // Stats collection
      await this.db.createCollection('stats')
      
      // Uploads collection (image metadata)
      await this.db.createCollection('uploads')
      
      console.log('✅ Collections oluşturuldu')
    } catch (error) {
      // Collection zaten varsa hata verme
      if (error.code !== 48) {
        console.error('❌ Collection oluşturma hatası:', error)
      }
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close()
      this.isConnected = false
      console.log('🔌 MongoDB bağlantısı kapatıldı')
    }
  }

  getCollection(name) {
    if (!this.isConnected) {
      throw new Error('Database bağlantısı yok')
    }
    return this.db.collection(name)
  }

  // Events CRUD operations
  async getEvents(filters = {}) {
    const collection = this.getCollection('events')
    return await collection.find(filters).toArray()
  }

  async getEventById(id) {
    const collection = this.getCollection('events')
    return await collection.findOne({ _id: id })
  }

  async createEvent(eventData) {
    const collection = this.getCollection('events')
    const result = await collection.insertOne({
      ...eventData,
      created_at: new Date(),
      updated_at: new Date()
    })
    return result
  }

  async updateEvent(id, eventData) {
    const collection = this.getCollection('events')
    const result = await collection.updateOne(
      { _id: id },
      { 
        $set: {
          ...eventData,
          updated_at: new Date()
        }
      }
    )
    return result
  }

  async deleteEvent(id) {
    const collection = this.getCollection('events')
    const result = await collection.deleteOne({ _id: id })
    return result
  }

  // Stats operations
  async getStats() {
    const collection = this.getCollection('stats')
    const stats = await collection.findOne({ _id: 'main' })
    return stats || { totalEvents: 0, lastUpdate: new Date() }
  }

  async updateStats(statsData) {
    const collection = this.getCollection('stats')
    const result = await collection.updateOne(
      { _id: 'main' },
      { 
        $set: {
          ...statsData,
          updated_at: new Date()
        }
      },
      { upsert: true }
    )
    return result
  }

  // Uploads operations
  async saveUploadMetadata(uploadData) {
    const collection = this.getCollection('uploads')
    const result = await collection.insertOne({
      ...uploadData,
      created_at: new Date()
    })
    return result
  }

  async getUploadById(id) {
    const collection = this.getCollection('uploads')
    return await collection.findOne({ _id: id })
  }
}

// Singleton instance
const database = new Database()

module.exports = database 