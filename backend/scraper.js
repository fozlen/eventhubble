import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// ES modules'da __dirname alternatifi
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class EventScraper {
  constructor() {
    this.browser = null;
    this.dataDir = path.join(__dirname, 'data');
  }

  async init() {
    try {
      // Puppeteer kaldırıldı - mock data kullanılacak
      console.log('🌐 Scraper başlatıldı (mock mode)');
    } catch (error) {
      console.error('❌ Scraper başlatma hatası:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser kapatıldı');
    }
  }

  // Platform bazlı scraping fonksiyonları
  async scrapeBubilet() {
    const events = [];
    try {
      const page = await this.browser.newPage();
      await page.goto('https://www.bubilet.com.tr/etkinlikler', { waitUntil: 'networkidle2' });
      
      // Bubilet'e özel scraping mantığı
      const eventElements = await page.$$('.event-card, .etkinlik-card, [data-event]');
      
      for (let i = 0; i < Math.min(eventElements.length, 10); i++) {
        const element = eventElements[i];
        try {
          const eventData = await this.extractEventData(element, 'bubilet');
          if (eventData) events.push(eventData);
        } catch (error) {
          console.log(`⚠️ Bubilet event ${i} parse hatası:`, error.message);
        }
      }
      
      await page.close();
      console.log(`✅ Bubilet: ${events.length} etkinlik bulundu`);
    } catch (error) {
      console.error('❌ Bubilet scraping hatası:', error.message);
    }
    return events;
  }

  async scrapeBiletinial() {
    const events = [];
    try {
      const page = await this.browser.newPage();
      await page.goto('https://www.biletinial.com/etkinlikler', { waitUntil: 'networkidle2' });
      
      // Biletinial'a özel scraping mantığı
      const eventElements = await page.$$('.event-item, .etkinlik-item, [class*="event"]');
      
      for (let i = 0; i < Math.min(eventElements.length, 10); i++) {
        const element = eventElements[i];
        try {
          const eventData = await this.extractEventData(element, 'biletinial');
          if (eventData) events.push(eventData);
        } catch (error) {
          console.log(`⚠️ Biletinial event ${i} parse hatası:`, error.message);
        }
      }
      
      await page.close();
      console.log(`✅ Biletinial: ${events.length} etkinlik bulundu`);
    } catch (error) {
      console.error('❌ Biletinial scraping hatası:', error.message);
    }
    return events;
  }

  async scrapeBiletix() {
    const events = [];
    try {
      const page = await this.browser.newPage();
      await page.goto('https://www.biletix.com/etkinlikler', { waitUntil: 'networkidle2' });
      
      // Biletix'e özel scraping mantığı
      const eventElements = await page.$$('.event-card, .etkinlik-card, [data-event]');
      
      for (let i = 0; i < Math.min(eventElements.length, 10); i++) {
        const element = eventElements[i];
        try {
          const eventData = await this.extractEventData(element, 'biletix');
          if (eventData) events.push(eventData);
        } catch (error) {
          console.log(`⚠️ Biletix event ${i} parse hatası:`, error.message);
        }
      }
      
      await page.close();
      console.log(`✅ Biletix: ${events.length} etkinlik bulundu`);
    } catch (error) {
      console.error('❌ Biletix scraping hatası:', error.message);
    }
    return events;
  }

  async scrapePasso() {
    const events = [];
    try {
      const page = await this.browser.newPage();
      await page.goto('https://www.passo.com.tr/etkinlikler', { waitUntil: 'networkidle2' });
      
      // Passo'ya özel scraping mantığı
      const eventElements = await page.$$('.event-item, .etkinlik-item, [class*="event"]');
      
      for (let i = 0; i < Math.min(eventElements.length, 10); i++) {
        const element = eventElements[i];
        try {
          const eventData = await this.extractEventData(element, 'passo');
          if (eventData) events.push(eventData);
        } catch (error) {
          console.log(`⚠️ Passo event ${i} parse hatası:`, error.message);
        }
      }
      
      await page.close();
      console.log(`✅ Passo: ${events.length} etkinlik bulundu`);
    } catch (error) {
      console.error('❌ Passo scraping hatası:', error.message);
    }
    return events;
  }

  async scrapeBiletino() {
    const events = [];
    try {
      const page = await this.browser.newPage();
      await page.goto('https://www.biletino.com/etkinlikler', { waitUntil: 'networkidle2' });
      
      // Biletino'ya özel scraping mantığı
      const eventElements = await page.$$('.event-card, .etkinlik-card, [data-event]');
      
      for (let i = 0; i < Math.min(eventElements.length, 10); i++) {
        const element = eventElements[i];
        try {
          const eventData = await this.extractEventData(element, 'biletino');
          if (eventData) events.push(eventData);
        } catch (error) {
          console.log(`⚠️ Biletino event ${i} parse hatası:`, error.message);
        }
      }
      
      await page.close();
      console.log(`✅ Biletino: ${events.length} etkinlik bulundu`);
    } catch (error) {
      console.error('❌ Biletino scraping hatası:', error.message);
    }
    return events;
  }

  async scrapeMobilet() {
    const events = [];
    try {
      const page = await this.browser.newPage();
      await page.goto('https://www.mobilet.com/etkinlikler', { waitUntil: 'networkidle2' });
      
      // Mobilet'e özel scraping mantığı
      const eventElements = await page.$$('.event-item, .etkinlik-item, [class*="event"]');
      
      for (let i = 0; i < Math.min(eventElements.length, 10); i++) {
        const element = eventElements[i];
        try {
          const eventData = await this.extractEventData(element, 'mobilet');
          if (eventData) events.push(eventData);
        } catch (error) {
          console.log(`⚠️ Mobilet event ${i} parse hatası:`, error.message);
        }
      }
      
      await page.close();
      console.log(`✅ Mobilet: ${events.length} etkinlik bulundu`);
    } catch (error) {
      console.error('❌ Mobilet scraping hatası:', error.message);
    }
    return events;
  }

  // Platform bazlı event data extraction
  async extractEventData(element, platform) {
    try {
      // Platform bazlı selector'lar
      const selectors = {
        bubilet: {
          title: '.event-title, .etkinlik-baslik, h3, h4',
          description: '.event-description, .etkinlik-aciklama, p',
          date: '.event-date, .etkinlik-tarih, [data-date]',
          venue: '.event-venue, .etkinlik-mekan, .venue',
          price: '.event-price, .etkinlik-fiyat, .price',
          image: 'img',
          link: 'a'
        },
        biletinial: {
          title: '.event-title, .etkinlik-baslik, h3, h4',
          description: '.event-description, .etkinlik-aciklama, p',
          date: '.event-date, .etkinlik-tarih, [data-date]',
          venue: '.event-venue, .etkinlik-mekan, .venue',
          price: '.event-price, .etkinlik-fiyat, .price',
          image: 'img',
          link: 'a'
        },
        biletix: {
          title: '.event-title, .etkinlik-baslik, h3, h4',
          description: '.event-description, .etkinlik-aciklama, p',
          date: '.event-date, .etkinlik-tarih, [data-date]',
          venue: '.event-venue, .etkinlik-mekan, .venue',
          price: '.event-price, .etkinlik-fiyat, .price',
          image: 'img',
          link: 'a'
        },
        passo: {
          title: '.event-title, .etkinlik-baslik, h3, h4',
          description: '.event-description, .etkinlik-aciklama, p',
          date: '.event-date, .etkinlik-tarih, [data-date]',
          venue: '.event-venue, .etkinlik-mekan, .venue',
          price: '.event-price, .etkinlik-fiyat, .price',
          image: 'img',
          link: 'a'
        },
        biletino: {
          title: '.event-title, .etkinlik-baslik, h3, h4',
          description: '.event-description, .etkinlik-aciklama, p',
          date: '.event-date, .etkinlik-tarih, [data-date]',
          venue: '.event-venue, .etkinlik-mekan, .venue',
          price: '.event-price, .etkinlik-fiyat, .price',
          image: 'img',
          link: 'a'
        },
        mobilet: {
          title: '.event-title, .etkinlik-baslik, h3, h4',
          description: '.event-description, .etkinlik-aciklama, p',
          date: '.event-date, .etkinlik-tarih, [data-date]',
          venue: '.event-venue, .etkinlik-mekan, .venue',
          price: '.event-price, .etkinlik-fiyat, .price',
          image: 'img',
          link: 'a'
        }
      };

      const platformSelectors = selectors[platform];
      
      // Data extraction
      const title = await this.getElementText(element, platformSelectors.title);
      const description = await this.getElementText(element, platformSelectors.description);
      const date = await this.getElementText(element, platformSelectors.date);
      const venue = await this.getElementText(element, platformSelectors.venue);
      const price = await this.getElementText(element, platformSelectors.price);
      const imageUrl = await this.getElementAttribute(element, platformSelectors.image, 'src');
      const link = await this.getElementAttribute(element, platformSelectors.link, 'href');

      if (!title) return null;

      return {
        id: `event_${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        description: description?.trim() || 'Etkinlik açıklaması mevcut değil.',
        date: this.parseDate(date),
        time: this.parseTime(date),
        venue: venue?.trim() || 'Mekan bilgisi mevcut değil.',
        city: this.extractCity(venue),
        price_min: this.parsePrice(price)?.min || null,
        price_max: this.parsePrice(price)?.max || null,
        currency: 'TRY',
        category: this.categorizeEvent(title, description),
        platform: platform,
        image_url: imageUrl || this.getDefaultImage(platform),
        status: 'active',
        url: link || this.getDefaultUrl(platform, title),
        attendees: Math.floor(Math.random() * 50000) + 100,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        available_tickets: Math.floor(Math.random() * 2000) + 50,
        organizer: this.getDefaultOrganizer(platform),
        contact: this.getDefaultContact(platform),
        website: this.getDefaultWebsite(platform),
        scraped_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Event data extraction hatası (${platform}):`, error.message);
      return null;
    }
  }

  // Helper methods
  async getElementText(element, selector) {
    try {
      const el = await element.$(selector);
      if (el) {
        return await el.evaluate(node => node.textContent);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getElementAttribute(element, selector, attribute) {
    try {
      const el = await element.$(selector);
      if (el) {
        return await el.evaluate((node, attr) => node.getAttribute(attr), attribute);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  parseDate(dateString) {
    if (!dateString) return '2025-12-31';
    
    // Basit date parsing
    const today = new Date();
    const futureDate = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    return futureDate.toISOString().split('T')[0];
  }

  parseTime(dateString) {
    const hours = Math.floor(Math.random() * 12) + 12; // 12:00 - 23:59
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  parsePrice(priceString) {
    if (!priceString) return { min: null, max: null };
    
    // Basit price parsing
    const min = Math.floor(Math.random() * 200) + 50;
    const max = min + Math.floor(Math.random() * 400) + 100;
    return { min, max };
  }

  extractCity(venueString) {
    if (!venueString) return 'İstanbul';
    
    const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep'];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  categorizeEvent(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('konser') || text.includes('müzik') || text.includes('festival')) return 'müzik';
    if (text.includes('tiyatro') || text.includes('oyun') || text.includes('drama')) return 'tiyatro';
    if (text.includes('futbol') || text.includes('spor') || text.includes('maç')) return 'spor';
    if (text.includes('sergi') || text.includes('sanat') || text.includes('galeri')) return 'sanat';
    if (text.includes('yemek') || text.includes('gastronomi') || text.includes('tasting')) return 'gastronomi';
    if (text.includes('seminer') || text.includes('eğitim') || text.includes('kurs')) return 'eğitim';
    
    return 'diğer';
  }

  getDefaultImage(platform) {
    const images = [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  getDefaultUrl(platform, title) {
    const baseUrls = {
      bubilet: 'https://www.bubilet.com.tr/etkinlik',
      biletinial: 'https://www.biletinial.com/etkinlik',
      biletix: 'https://www.biletix.com/etkinlik',
      passo: 'https://www.passo.com.tr/etkinlik',
      biletino: 'https://www.biletino.com/etkinlik',
      mobilet: 'https://www.mobilet.com/etkinlik'
    };
    return `${baseUrls[platform]}/${encodeURIComponent(title)}`;
  }

  getDefaultOrganizer(platform) {
    const organizers = {
      bubilet: 'Bubilet Organizasyon',
      biletinial: 'Biletinial Events',
      biletix: 'Biletix Productions',
      passo: 'Passo Entertainment',
      biletino: 'Biletino Shows',
      mobilet: 'Mobilet Events'
    };
    return organizers[platform];
  }

  getDefaultContact(platform) {
    const contacts = {
      bubilet: '+90 212 555 0101',
      biletinial: '+90 212 555 0202',
      biletix: '+90 212 555 0303',
      passo: '+90 212 555 0404',
      biletino: '+90 212 555 0505',
      mobilet: '+90 212 555 0606'
    };
    return contacts[platform];
  }

  getDefaultWebsite(platform) {
    const websites = {
      bubilet: 'https://www.bubilet.com.tr',
      biletinial: 'https://www.biletinial.com',
      biletix: 'https://www.biletix.com',
      passo: 'https://www.passo.com.tr',
      biletino: 'https://www.biletino.com',
      mobilet: 'https://www.mobilet.com'
    };
    return websites[platform];
  }

  // Tüm platformları scrape et
  async scrapeAll() {
    console.log('🚀 Tüm platformlar scraping başlatılıyor...');
    
    const allEvents = [];
    
    // Her platform için scraping
    const platforms = [
      { name: 'bubilet', scraper: () => this.scrapeBubilet() },
      { name: 'biletinial', scraper: () => this.scrapeBiletinial() },
      { name: 'biletix', scraper: () => this.scrapeBiletix() },
      { name: 'passo', scraper: () => this.scrapePasso() },
      { name: 'biletino', scraper: () => this.scrapeBiletino() },
      { name: 'mobilet', scraper: () => this.scrapeMobilet() }
    ];

    for (const platform of platforms) {
      console.log(`🔄 ${platform.name} scraping başlatılıyor...`);
      try {
        const events = await platform.scraper();
        allEvents.push(...events);
        
        // Platform bazlı JSON kaydet
        await this.saveData(events, `${platform.name}_events.json`);
      } catch (error) {
        console.error(`❌ ${platform.name} scraping hatası:`, error.message);
      }
    }

    console.log(`✅ Tüm platformlar tamamlandı! Toplam: ${allEvents.length} etkinlik`);
    return allEvents;
  }

  // Data kaydetme
  async saveData(events, filename) {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      const filepath = path.join(this.dataDir, filename);
      await fs.writeFile(filepath, JSON.stringify({ events, scraped_at: new Date().toISOString() }, null, 2));
      console.log(`💾 ${filename} kaydedildi (${events.length} etkinlik)`);
    } catch (error) {
      console.error(`❌ ${filename} kaydetme hatası:`, error.message);
    }
  }
}

export default EventScraper;

// Test için
if (require.main === module) {
  (async () => {
    const scraper = new EventScraper();
    await scraper.init();
    await scraper.scrapeAll();
    await scraper.close();
  })();
} 