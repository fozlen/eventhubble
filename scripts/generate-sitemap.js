// Generate sitemap.xml for EventHubble
// Run with: node scripts/generate-sitemap.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Site configuration
const SITE_URL = 'https://eventhubble.com'
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml')

// Static pages with their priorities and change frequencies
const staticPages = [
  {
    url: '/',
    priority: '1.0',
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/about',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/contact',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/categories',
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/world-news',
    priority: '0.6',
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/search',
    priority: '0.5',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  }
]

// Category pages
const categoryPages = [
  { slug: 'music', priority: '0.8', changefreq: 'daily' },
  { slug: 'theater', priority: '0.8', changefreq: 'daily' },
  { slug: 'sports', priority: '0.8', changefreq: 'daily' },
  { slug: 'arts', priority: '0.7', changefreq: 'weekly' },
  { slug: 'festivals', priority: '0.7', changefreq: 'weekly' },
  { slug: 'comedy', priority: '0.6', changefreq: 'weekly' },
  { slug: 'family', priority: '0.6', changefreq: 'weekly' },
  { slug: 'business', priority: '0.5', changefreq: 'weekly' },
  { slug: 'education', priority: '0.5', changefreq: 'weekly' },
  { slug: 'technology', priority: '0.5', changefreq: 'weekly' }
]

function generateSitemap() {
  console.log('🚀 Generating sitemap.xml...')
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
  })

  // Add category pages
  categoryPages.forEach(category => {
    sitemap += `  <url>
    <loc>${SITE_URL}/categories/${category.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${category.changefreq}</changefreq>
    <priority>${category.priority}</priority>
  </url>
`
  })

  // TODO: Add dynamic event pages when API is available
  // This would fetch events from the database and add them to sitemap
  // Example:
  // const events = await fetchEvents()
  // events.forEach(event => {
  //   sitemap += `  <url>
  //     <loc>${SITE_URL}/events/${event.slug}</loc>
  //     <lastmod>${event.updated_at}</lastmod>
  //     <changefreq>weekly</changefreq>
  //     <priority>0.7</priority>
  //   </url>`
  // })

  // TODO: Add dynamic blog post pages when API is available
  // const blogPosts = await fetchBlogPosts()
  // blogPosts.forEach(post => {
  //   sitemap += `  <url>
  //     <loc>${SITE_URL}/blog/${post.slug}</loc>
  //     <lastmod>${post.updated_at}</lastmod>
  //     <changefreq>monthly</changefreq>
  //     <priority>0.6</priority>
  //   </url>`
  // })

  sitemap += `</urlset>`

  // Write sitemap to file
  try {
    fs.writeFileSync(OUTPUT_PATH, sitemap)
    console.log(`✅ Sitemap generated successfully: ${OUTPUT_PATH}`)
    console.log(`📄 Total URLs: ${staticPages.length + categoryPages.length}`)
    console.log(`🌐 Site URL: ${SITE_URL}`)
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

// Run the generator
generateSitemap()

export { generateSitemap } 