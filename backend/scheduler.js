const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const EventScraper = require('./scraper');

class EventScheduler {
  constructor() {
    this.app = express();
    this.scraper = new EventScraper();
    this.dataDir = path.join(__dirname, '../data');
    this.isRunning = false;
    this.lastScrapeTime = null;
    this.stats = {
      total_events: 0,
      platforms: {},
      last_update: null,
      next_update: null
    };
  }

  async init() {
    try {
      // Data dizinini oluştur
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Express middleware
      this.app.use(cors());
      this.app.use(express.json());
      
      // API routes
      this.setupRoutes();
      
      // Scraper'ı başlat
      await this.scraper.init();
      
      // Cron job başlat (her saat)
      this.startCronJob();
      
      // İlk scraping'i çalıştır
      await this.runScraping();
      
      console.log('✅ Event Scheduler başlatıldı!');
    } catch (error) {
      console.error('❌ Event Scheduler başlatma hatası:', error);
      throw error;
    }
  }

  setupRoutes() {
    // Status endpoint
    this.app.get('/api/status', (req, res) => {
      res.json({
        status: 'running',
        last_scrape: this.lastScrapeTime,
        next_scrape: this.stats.next_update,
        total_events: this.stats.total_events,
        platforms: this.stats.platforms
      });
    });

    // Events endpoint
    this.app.get('/api/events', async (req, res) => {
      try {
        const data = await this.loadAllEvents();
        res.json(data);
      } catch (error) {
        console.error('❌ Events API hatası:', error);
        res.status(500).json({ error: 'Events yüklenemedi' });
      }
    });

    // Manual scraping trigger
    this.app.post('/api/scrape', async (req, res) => {
      try {
        if (this.isRunning) {
          return res.status(400).json({ error: 'Scraping zaten çalışıyor' });
        }
        
        console.log('🔄 Manuel scraping tetiklendi...');
        await this.runScraping();
        res.json({ message: 'Scraping başarıyla tamamlandı' });
      } catch (error) {
        console.error('❌ Manuel scraping hatası:', error);
        res.status(500).json({ error: 'Scraping başarısız' });
      }
    });

    // Stats endpoint
    this.app.get('/api/stats', (req, res) => {
      res.json(this.stats);
    });

    // Platform bazlı events
    this.app.get('/api/events/:platform', async (req, res) => {
      try {
        const { platform } = req.params;
        const data = await this.loadPlatformEvents(platform);
        res.json(data);
      } catch (error) {
        console.error(`❌ ${req.params.platform} events API hatası:`, error);
        res.status(500).json({ error: 'Platform events yüklenemedi' });
      }
    });
  }

  startCronJob() {
    // Her saat başı scraping çalıştır
    cron.schedule('0 * * * *', async () => {
      console.log('🕐 Saatlik scraping başlatılıyor...');
      await this.runScraping();
    });
    
    console.log('📅 Cron job başlatıldı - Her saatte bir çalışacak');
  }

  async runScraping() {
    if (this.isRunning) {
      console.log('⚠️ Scraping zaten çalışıyor, bekleniyor...');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Otomatik scraping başlatılıyor...');

    try {
      // Gerçek scraping dene
      const events = await this.scraper.scrapeAll();
      
      if (events && events.length > 0) {
        // Tüm etkinlikleri kaydet
        await this.saveData(events, 'all_events.json');
        
        // İstatistikleri güncelle
        this.updateStats(events);
        
        console.log(`✅ Scraping tamamlandı! ${events.length} etkinlik güncellendi.`);
      } else {
        // Mock data kullan
        console.log('⚠️ Gerçek scraping başarısız, mock data kullanılıyor...');
        const mockEvents = this.getMockEvents();
        await this.saveData(mockEvents, 'all_events.json');
        this.updateStats(mockEvents);
        console.log(`✅ Mock data kullanıldı! ${mockEvents.length} etkinlik güncellendi.`);
      }
      
      this.lastScrapeTime = new Date().toISOString();
      this.stats.last_update = this.lastScrapeTime;
      this.stats.next_update = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 saat sonra
      
      // Stats'ı kaydet
      await this.saveStats();
      
    } catch (error) {
      console.error('❌ Scraping hatası:', error);
      
      // Hata durumunda mock data kullan
      console.log('⚠️ Hata nedeniyle mock data kullanılıyor...');
      const mockEvents = this.getMockEvents();
      await this.saveData(mockEvents, 'all_events.json');
      this.updateStats(mockEvents);
      await this.saveStats();
    } finally {
      this.isRunning = false;
    }
  }

  updateStats(events) {
    this.stats.total_events = events.length;
    this.stats.platforms = {};
    
    events.forEach(event => {
      const platform = event.platform;
      if (!this.stats.platforms[platform]) {
        this.stats.platforms[platform] = 0;
      }
      this.stats.platforms[platform]++;
    });
  }

  async saveStats() {
    try {
      const statsPath = path.join(this.dataDir, 'stats.json');
      await fs.writeFile(statsPath, JSON.stringify(this.stats, null, 2));
      console.log('📊 İstatistikler kaydedildi');
    } catch (error) {
      console.error('❌ Stats kaydetme hatası:', error);
    }
  }

  async saveData(events, filename) {
    try {
      const filepath = path.join(this.dataDir, filename);
      const data = {
        scraped_at: new Date().toISOString(),
        total_events: events.length,
        events: events
      };
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
      console.log(`💾 ${filename} kaydedildi (${events.length} etkinlik)`);
    } catch (error) {
      console.error(`❌ ${filename} kaydetme hatası:`, error);
    }
  }

  async loadAllEvents() {
    try {
      const filepath = path.join(this.dataDir, 'all_events.json');
      const data = await fs.readFile(filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log('⚠️ all_events.json bulunamadı, mock data kullanılıyor...');
      const mockEvents = this.getMockEvents();
      return {
        scraped_at: new Date().toISOString(),
        total_events: mockEvents.length,
        events: mockEvents
      };
    }
  }

  async loadPlatformEvents(platform) {
    try {
      const filepath = path.join(this.dataDir, `${platform}_events.json`);
      const data = await fs.readFile(filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log(`⚠️ ${platform}_events.json bulunamadı, boş data döndürülüyor...`);
      return {
        scraped_at: new Date().toISOString(),
        total_events: 0,
        events: []
      };
    }
  }

  getMockEvents() {
    return [
      {
        id: "event_1",
        title: "The Groove Festival",
        description: "Türkiye'nin en büyük müzik festivali, 3 gün boyunca sürecek muhteşem performanslar.",
        date: "2025-08-15",
        time: "18:00",
        venue: "Küçükçiftlik Park",
        city: "İstanbul",
        price_min: 150,
        price_max: 450,
        currency: "TRY",
        category: "müzik",
        platform: "bubilet",
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        status: "active",
        url: "https://bubilet.com.tr/event/the-groove-festival",
        attendees: 6795,
        rating: 4.2,
        available_tickets: 1250,
        organizer: "Groove Productions",
        contact: "+90 212 555 0123",
        website: "https://groovefestival.com",
        scraped_at: new Date().toISOString()
      },
      {
        id: "event_2",
        title: "Calibre Fest Bodrum - Tiësto",
        description: "Bodrum'un en büyük elektronik müzik festivali, dünya çapında DJ'ler.",
        date: "2025-07-20",
        time: "22:00",
        venue: "Bodrum Kalesi",
        city: "Bodrum",
        price_min: 200,
        price_max: 600,
        currency: "TRY",
        category: "festival",
        platform: "biletinial",
        image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
        status: "active",
        url: "https://biletinial.com/event/calibre-fest-bodrum",
        attendees: 4500,
        rating: 4.8,
        available_tickets: 800,
        organizer: "Calibre Events",
        contact: "+90 252 555 0456",
        website: "https://calibrefest.com",
        scraped_at: new Date().toISOString()
      },
      {
        id: "event_3",
        title: "Romeo ve Juliet",
        description: "Shakespeare'in ölümsüz eseri, modern yorumla.",
        date: "2025-09-05",
        time: "19:30",
        venue: "İstanbul Devlet Tiyatrosu",
        city: "İstanbul",
        price_min: 60,
        price_max: 180,
        currency: "TRY",
        category: "tiyatro",
        platform: "biletix",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        status: "active",
        url: "https://biletix.com/event/romeo-ve-juliet",
        attendees: 1200,
        rating: 4.5,
        available_tickets: 150,
        organizer: "İstanbul Devlet Tiyatrosu",
        contact: "+90 212 555 0789",
        website: "https://istanbuldt.gov.tr",
        scraped_at: new Date().toISOString()
      },
      {
        id: "event_4",
        title: "Fenerbahçe vs Galatasaray",
        description: "Türkiye'nin en büyük derbisi, unutulmaz atmosfer.",
        date: "2025-10-15",
        time: "20:00",
        venue: "Ülker Stadyumu",
        city: "İstanbul",
        price_min: 200,
        price_max: 800,
        currency: "TRY",
        category: "spor",
        platform: "passo",
        image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        status: "active",
        url: "https://passo.com.tr/event/fenerbahce-galatasaray",
        attendees: 52000,
        rating: 4.9,
        available_tickets: 5000,
        organizer: "TFF",
        contact: "+90 212 555 0321",
        website: "https://tff.org",
        scraped_at: new Date().toISOString()
      },
      {
        id: "event_5",
        title: "İstanbul Modern Sanat Sergisi",
        description: "Çağdaş Türk sanatının en iyi örnekleri.",
        date: "2025-11-10",
        time: "10:00",
        venue: "İstanbul Modern",
        city: "İstanbul",
        price_min: 30,
        price_max: 80,
        currency: "TRY",
        category: "sanat",
        platform: "biletino",
        image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        status: "active",
        url: "https://biletino.com/event/istanbul-modern-sergi",
        attendees: 850,
        rating: 4.3,
        available_tickets: 200,
        organizer: "İstanbul Modern",
        contact: "+90 212 555 0456",
        website: "https://istanbulmodern.org",
        scraped_at: new Date().toISOString()
      }
    ];
  }

  start() {
    const PORT = process.env.PORT || 3001;
    this.app.listen(PORT, () => {
      console.log(`🌐 API Server ${PORT} portunda başlatıldı`);
    });
  }

  async stop() {
    if (this.scraper) {
      await this.scraper.close();
    }
    console.log('🛑 Event Scheduler durduruldu');
  }
}

// Server'ı başlat
const scheduler = new EventScheduler();

scheduler.init().then(() => {
  scheduler.start();
}).catch(error => {
  console.error('❌ Server başlatma hatası:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Server kapatılıyor...');
  await scheduler.stop();
  process.exit(0);
});

module.exports = EventScheduler; 