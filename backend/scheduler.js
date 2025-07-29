import cron from 'node-cron'
import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import EventScraper from './scraper.js'

// ES modules'da __dirname alternatifi
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class EventScheduler {
  constructor() {
    this.app = express();
    this.scraper = new EventScraper();
    this.dataDir = path.join(__dirname, 'data');
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
        // Boş array kullan
        console.log('⚠️ Gerçek scraping başarısız, boş array kullanılıyor...');
        const emptyEvents = [];
        await this.saveData(emptyEvents, 'all_events.json');
        this.updateStats(emptyEvents);
        console.log(`✅ Boş array kullanıldı! ${emptyEvents.length} etkinlik güncellendi.`);
      }
      
      this.lastScrapeTime = new Date().toISOString();
      this.stats.last_update = this.lastScrapeTime;
      this.stats.next_update = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 saat sonra
      
      // Stats'ı kaydet
      await this.saveStats();
      
    } catch (error) {
      console.error('❌ Scraping hatası:', error);
      
              // Hata durumunda boş array kullan
        console.log('⚠️ Hata nedeniyle boş array kullanılıyor...');
        const emptyEvents = [];
        await this.saveData(emptyEvents, 'all_events.json');
        this.updateStats(emptyEvents);
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
              console.log('⚠️ all_events.json bulunamadı, boş array kullanılıyor...');
        const emptyEvents = [];
        return {
          scraped_at: new Date().toISOString(),
          total_events: emptyEvents.length,
          events: emptyEvents
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

export default EventScheduler; 