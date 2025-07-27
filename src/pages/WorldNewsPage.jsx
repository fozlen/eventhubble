import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, Calendar, ArrowRight } from 'lucide-react'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
import logoWithoutBg from '../assets/Logo w_out background.png'
import mainLogo from '../assets/MainLogo.png'

const WorldNewsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false) // Artık dark mode yok, tek tema
  const [language, setLanguage] = useState(() => {
    // Load language preference from localStorage
    return localStorage.getItem('language') || 'EN'
  })
  const [newsData, setNewsData] = useState([])
  const navigate = useNavigate()

  // Dark mode effect - artık gerekli değil
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Load blog posts from localStorage or use mock data
  useEffect(() => {
    const loadBlogPosts = () => {
      try {
        const storedPosts = localStorage.getItem('blogPosts')
        if (storedPosts) {
          const posts = JSON.parse(storedPosts)
          // Transform posts to match the expected format
          const transformedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            date: new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            category: post.category,
            image: post.image
          }))
          setNewsData(transformedPosts)
        } else {
          // Fallback to mock data
          const mockData = [
            {
              id: 1,
              title: language === 'TR' ? 'Coachella 2024 Lineup Açıklandı' : 'Coachella 2024 Lineup Announced',
              excerpt: language === 'TR' 
                ? 'Bu yılın en büyük müzik festivali için heyecan verici sanatçı listesi yayınlandı.'
                : 'The exciting artist lineup for this year\'s biggest music festival has been released.',
              date: language === 'TR' ? '15 Mart 2024' : 'March 15, 2024',
              category: language === 'TR' ? 'Müzik' : 'Music',
              image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
            },
            {
              id: 2,
              title: language === 'TR' ? 'Tokyo Olimpiyat Oyunları Hazırlıkları' : 'Tokyo Olympic Games Preparations',
              excerpt: language === 'TR' 
                ? '2024 Tokyo Olimpiyat Oyunları için son hazırlıklar tamamlanıyor.'
                : 'Final preparations are being completed for the 2024 Tokyo Olympic Games.',
              date: language === 'TR' ? '12 Mart 2024' : 'March 12, 2024',
              category: language === 'TR' ? 'Spor' : 'Sports',
              image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
            },
            {
              id: 3,
              title: language === 'TR' ? 'Venedik Bienali 2024 Programı' : 'Venice Biennale 2024 Program',
              excerpt: language === 'TR' 
                ? 'Dünyanın en prestijli sanat etkinliği için program detayları açıklandı.'
                : 'Program details have been announced for the world\'s most prestigious art event.',
              date: language === 'TR' ? '10 Mart 2024' : 'March 10, 2024',
              category: language === 'TR' ? 'Sanat' : 'Art',
              image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
            },
            {
              id: 4,
              title: language === 'TR' ? 'SXSW Festivali Teknoloji Trendleri' : 'SXSW Festival Technology Trends',
              excerpt: language === 'TR' 
                ? 'Austin\'deki festivalde öne çıkan teknoloji ve inovasyon trendleri.'
                : 'Highlighted technology and innovation trends at the Austin festival.',
              date: language === 'TR' ? '8 Mart 2024' : 'March 8, 2024',
              category: language === 'TR' ? 'Teknoloji' : 'Technology',
              image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
            },
            {
              id: 5,
              title: language === 'TR' ? 'Cannes Film Festivali Jüri Üyeleri' : 'Cannes Film Festival Jury Members',
              excerpt: language === 'TR' 
                ? 'Bu yılın Cannes Film Festivali jüri üyeleri açıklandı.'
                : 'This year\'s Cannes Film Festival jury members have been announced.',
              date: language === 'TR' ? '5 Mart 2024' : 'March 5, 2024',
              category: language === 'TR' ? 'Film' : 'Film',
              image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop'
            },
            {
              id: 6,
              title: language === 'TR' ? 'FIFA Dünya Kupası 2026 Hazırlıkları' : 'FIFA World Cup 2026 Preparations',
              excerpt: language === 'TR' 
                ? '2026 FIFA Dünya Kupası için ev sahibi ülkelerde hazırlıklar başladı.'
                : 'Preparations have begun in host countries for the 2026 FIFA World Cup.',
              date: language === 'TR' ? '3 Mart 2024' : 'March 3, 2024',
              category: language === 'TR' ? 'Spor' : 'Sports',
              image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
            }
          ]
          setNewsData(mockData)
        }
      } catch (error) {
        console.error('Error loading blog posts:', error)
      }
    }

    loadBlogPosts()
  }, [language])

  // Update page title based on language
  useEffect(() => {
    const title = language === 'TR' 
      ? 'Event Hubble | Dünyadan Gelişmeler'
      : 'Event Hubble | World News'
    document.title = title
  }, [language])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode))
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'TR' ? 'EN' : 'TR'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const handleLogin = () => {
    navigate('/admin/login')
  }

  const handleReadMore = (postId) => {
    navigate(`/blog/${postId}`)
  }

  // Get appropriate logo based on theme
  const getLogo = () => {
    return logo // Yeni logo kullanıyoruz
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-3 items-center">
            {/* Logo and Brand - Left Section */}
            <div className="flex justify-start">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200"
              >
                <img 
                  src={getLogo()} 
                  alt="EventHubble" 
                  className="h-10 w-auto" 
                />
                <span className="text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light">Hubble</span>
                </span>
              </button>
            </div>
            
            {/* Navigation Menu - Center Section */}
            <nav className="flex justify-center items-center space-x-8">
              <a
                href="/"
                className="text-sm font-medium transition-colors text-white hover:text-primary-light"
              >
                {language === 'TR' ? 'Ana Sayfa' : 'Home'}
              </a>
              <a
                href="/about"
                className="text-sm font-medium transition-colors text-white/80 hover:text-white"
              >
                {language === 'TR' ? 'Hakkımızda' : 'About'}
              </a>
              <a
                href="/world-news"
                className="text-sm font-medium transition-colors text-primary-light"
              >
                {language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}
              </a>
            </nav>
            
            {/* Language Toggle - Right Section */}
            <div className="flex justify-end">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors p-1 md:p-0"
                title={language === 'TR' ? 'Language' : 'Dil'}
              >
                <Globe size={16} />
                <span className="hidden sm:inline">{language}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Page Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4">
            {language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}
          </h1>
          <p className="text-lg md:text-xl text-text/70 max-w-3xl mx-auto px-4">
            {language === 'TR' 
              ? 'Dünyadan en son etkinlik haberleri ve gelişmeler'
              : 'Latest event news and developments from around the world'
            }
          </p>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsData.map((news) => (
            <article
              key={news.id}
              className="bg-white border-gray-200 rounded-lg shadow-lg border overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {news.category}
                  </span>
                  <div className="flex items-center text-sm text-text/70">
                    <Calendar className="h-4 w-4 mr-1" />
                    {news.date}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text mb-3 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-text/70 mb-4 line-clamp-3">
                  {news.excerpt}
                </p>
                <button
                  onClick={() => handleReadMore(news.id)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  {language === 'TR' ? 'Devamını Oku' : 'Read More'}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {newsData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Calendar className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === 'TR' ? 'Henüz haber yok' : 'No news yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'TR' 
                ? 'Yakında yeni haberler eklenecek.'
                : 'New articles will be added soon.'
              }
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Logo and Brand - Left Section */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <img 
                  src={logo} 
                  alt="EventHubble" 
                  className="h-10 w-auto" 
                />
                <span className="text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light">Hubble</span>
                </span>
              </div>
            </div>
            
            {/* Company Links - Center Section */}
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="font-semibold mb-4">{language === 'TR' ? 'Şirket' : 'Company'}</h3>
                <ul className="space-y-2 text-white/80">
                  <li><a href="/about" className="hover:text-white transition-colors">{language === 'TR' ? 'Hakkımızda' : 'About'}</a></li>
                </ul>
              </div>
            </div>
            
            {/* Blog Links - Right Section */}
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="font-semibold mb-4">Blog</h3>
                <ul className="space-y-2 text-white/80">
                  <li><a href="/world-news" className="hover:text-white transition-colors">{language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default WorldNewsPage 