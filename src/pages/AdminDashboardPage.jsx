import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, LogOut, Calendar, User, Globe, Sun, Moon, Tag, FileText, Settings, BarChart3 } from 'lucide-react'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
import ImageSelector from '../components/ImageSelector'

const AdminDashboardPage = () => {
  const [blogPosts, setBlogPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'EN'
  })
  const navigate = useNavigate()

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated')
    const loginTime = localStorage.getItem('adminLoginTime')
    
    if (!isAuthenticated || !loginTime) {
      navigate('/admin/login')
      return
    }

    // Check if session is expired (24 hours)
    const now = Date.now()
    const loginTimestamp = parseInt(loginTime)
    if (now - loginTimestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('adminAuthenticated')
      localStorage.removeItem('adminLoginTime')
      navigate('/admin/login')
      return
    }

    loadBlogPosts()
  }, [navigate])

  const loadBlogPosts = () => {
    try {
      const storedPosts = localStorage.getItem('blogPosts')
      if (storedPosts) {
        setBlogPosts(JSON.parse(storedPosts))
      } else {
        // Initialize with sample data
        const samplePosts = [
          {
            id: 1,
            title: 'Coachella 2024 Lineup Announced',
            excerpt: 'The exciting artist lineup for this year\'s biggest music festival has been released.',
            content: 'The Coachella Valley Music and Arts Festival has just announced its highly anticipated 2024 lineup. This year\'s festival promises to be one of the most diverse and exciting yet, featuring artists from across the musical spectrum.\n\nHeadliners include some of the biggest names in music today, along with emerging artists who are making waves in the industry. The festival will take place over two weekends in April, offering attendees an unforgettable experience in the beautiful California desert.\n\nIn addition to the main stage performances, Coachella 2024 will feature art installations, food vendors, and interactive experiences that have become synonymous with the festival experience.',
            date: '2024-03-15',
            category: 'Music',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            author: 'Admin',
            tags: ['festival', 'music', 'coachella', '2024']
          },
          {
            id: 2,
            title: 'Istanbul Jazz Festival 2024',
            excerpt: 'The most prestigious jazz festival in Turkey returns with world-class artists.',
            content: 'The Istanbul Jazz Festival, one of the most prestigious music events in Turkey, is back for its 2024 edition. This year\'s festival will feature an impressive lineup of international and local jazz artists, promising unforgettable performances across various venues in Istanbul.\n\nThe festival will take place over two weeks in July, offering jazz enthusiasts the opportunity to experience world-class performances in some of Istanbul\'s most beautiful and historic venues. From intimate club performances to grand outdoor concerts, the festival caters to all jazz lovers.\n\nIn addition to the main performances, the festival will include workshops, masterclasses, and special events that celebrate the rich history and future of jazz music.',
            date: '2024-03-20',
            category: 'Music',
            image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop',
            author: 'Admin',
            tags: ['jazz', 'istanbul', 'festival', 'music']
          },
          {
            id: 3,
            title: 'Turkish Football League Championship Race',
            excerpt: 'The most exciting championship race in Turkish football history continues.',
            content: 'The Turkish Süper Lig is witnessing one of the most exciting championship races in its history. With only a few weeks remaining in the season, multiple teams are still in contention for the title, making every match crucial.\n\nThe race for the championship has been incredibly tight, with the top teams separated by just a few points. This has created an atmosphere of intense competition and excitement among football fans across Turkey.\n\nAs the season reaches its climax, fans can expect dramatic matches, unexpected results, and unforgettable moments that will be remembered for years to come.',
            date: '2024-03-25',
            category: 'Sports',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            author: 'Admin',
            tags: ['football', 'turkish league', 'championship', 'sports']
          }
        ]
        setBlogPosts(samplePosts)
        localStorage.setItem('blogPosts', JSON.stringify(samplePosts))
      }
    } catch (error) {
      console.error('Error loading blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
  }

  const handleAddPost = () => {
    setEditingPost(null)
    setShowAddModal(true)
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setShowAddModal(true)
  }

  const handleDeletePost = (postId) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu blog yazısını silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this blog post?'
    
    if (window.confirm(confirmMessage)) {
      const updatedPosts = blogPosts.filter(post => post.id !== postId)
      setBlogPosts(updatedPosts)
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
    }
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'TR' ? 'EN' : 'TR'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to get default images by category
  const getDefaultImageByCategory = (category) => {
    const imageMap = {
      'Music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'Art': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      'Film': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
      'Theater': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=300&fit=crop',
      'Festival': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
      'Other': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    }
    return imageMap[category] || imageMap['Other']
  }

  const handleSavePost = (postData) => {
    if (editingPost) {
      // Update existing post
      const updatedPosts = blogPosts.map(post => 
        post.id === editingPost.id ? { ...postData, id: post.id, date: post.date } : post
      )
      setBlogPosts(updatedPosts)
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
    } else {
      // Add new post
      const newPost = {
        ...postData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        author: 'Admin'
      }
      const updatedPosts = [...blogPosts, newPost]
      setBlogPosts(updatedPosts)
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
    }
    setShowAddModal(false)
    setEditingPost(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text">{language === 'TR' ? 'Yükleniyor...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <img src={logo} alt="EventHubble" className="h-8 w-auto" />
              <div className="text-white">
                <span className="text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light"> Hubble</span>
                </span>
                <span className="ml-2 text-sm text-primary-cream/80">Admin Panel</span>
              </div>
            </div>

            {/* Admin Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-primary-cream/80 hover:text-primary-cream transition-colors">
                {language === 'TR' ? 'Siteyi Görüntüle' : 'View Site'}
              </a>
              <button className="text-primary-cream/80 hover:text-primary-cream transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="text-primary-cream/80 hover:text-primary-cream transition-colors">
                <BarChart3 className="h-5 w-5" />
              </button>
            </nav>

            {/* Language and Logout */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-primary-cream/80 hover:text-primary-cream transition-colors"
                title={language === 'TR' ? 'Language' : 'Dil'}
              >
                <Globe size={16} />
                <span className="text-sm">{language}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-primary-cream/80 hover:text-primary-cream transition-colors"
                title={language === 'TR' ? 'Çıkış Yap' : 'Logout'}
              >
                <LogOut size={16} />
                <span className="text-sm hidden sm:inline">{language === 'TR' ? 'Çıkış' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">
                {language === 'TR' ? 'Blog Yönetimi' : 'Blog Management'}
              </h1>
              <p className="text-text/70 text-lg">
                {language === 'TR' 
                  ? 'Blog yazılarınızı ve içeriklerinizi yönetin'
                  : 'Manage your blog posts and content'
                }
              </p>
            </div>
            <button
              onClick={handleAddPost}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">{language === 'TR' ? 'Yeni Yazı Ekle' : 'Add New Post'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Toplam Yazı' : 'Total Posts'}</p>
                <p className="text-2xl font-bold text-text">{blogPosts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-light/10 rounded-lg">
                <Eye className="h-6 w-6 text-primary-light" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Görüntülenme' : 'Views'}</p>
                <p className="text-2xl font-bold text-text">1,234</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-text-accent/10 rounded-lg">
                <Tag className="h-6 w-6 text-text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Kategoriler' : 'Categories'}</p>
                <p className="text-2xl font-bold text-text">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-text">
              {language === 'TR' ? 'Blog Yazıları' : 'Blog Posts'}
            </h2>
          </div>
          
          {blogPosts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {blogPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-background-secondary transition-colors">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-text/70 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-text/60">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="flex items-center space-x-1 text-primary hover:text-primary-light text-sm font-medium hover:bg-primary/10 px-3 py-1 rounded-md transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span>{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="flex items-center space-x-1 text-text-accent hover:text-primary-light text-sm font-medium hover:bg-text-accent/10 px-3 py-1 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{language === 'TR' ? 'Sil' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-text/30" />
              <h3 className="mt-4 text-lg font-medium text-text">
                {language === 'TR' ? 'Henüz blog yazısı yok' : 'No blog posts yet'}
              </h3>
              <p className="mt-2 text-text/60">
                {language === 'TR' 
                  ? 'İlk blog yazınızı oluşturarak başlayın.'
                  : 'Get started by creating your first blog post.'
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddPost}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light transition-colors"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  {language === 'TR' ? 'Yeni Yazı Ekle' : 'Add New Post'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Blog Post Modal */}
      {showAddModal && (
        <BlogPostModal 
          post={editingPost} 
          onClose={() => setShowAddModal(false)} 
          onSave={handleSavePost}
          language={language}
        />
      )}
    </div>
  )
}

const BlogPostModal = ({ post, onClose, onSave, language = 'EN' }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || 'Music',
    image: post?.image || '',
    tags: post?.tags?.join(', ') || ''
  })

  const categories = language === 'TR' 
    ? ['Müzik', 'Spor', 'Sanat', 'Teknoloji', 'Film', 'Tiyatro', 'Festival', 'Diğer']
    : ['Music', 'Sports', 'Art', 'Technology', 'Film', 'Theater', 'Festival', 'Other']

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {post 
                ? (language === 'TR' ? 'Blog Yazısını Düzenle' : 'Edit Blog Post')
                : (language === 'TR' ? 'Yeni Blog Yazısı Ekle' : 'Add New Blog Post')
              }
            </h2>
            <button
              onClick={onClose}
              className="text-text/60 hover:text-text transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {language === 'TR' ? 'Başlık' : 'Title'}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                placeholder={language === 'TR' ? 'Blog yazısı başlığı...' : 'Blog post title...'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {language === 'TR' ? 'Özet' : 'Excerpt'}
              </label>
              <textarea
                required
                rows="3"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40 resize-none"
                placeholder={language === 'TR' ? 'Kısa özet...' : 'Brief excerpt...'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {language === 'TR' ? 'İçerik' : 'Content'}
              </label>
              <textarea
                required
                rows="8"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40 resize-none"
                placeholder={language === 'TR' ? 'Blog yazısı içeriği...' : 'Blog post content...'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Kategori' : 'Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Etiketler' : 'Tags'}
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder={language === 'TR' ? 'festival, müzik, 2024' : 'festival, music, 2024'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {language === 'TR' ? 'Resim URL' : 'Image URL'}
              </label>
              <ImageSelector
                value={formData.image}
                onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                placeholder={language === 'TR' ? 'Resim URL girin veya seçin...' : 'Enter image URL or select from dropdown...'}
                label={language === 'TR' ? 'Resim URL' : 'Image URL'}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-text border border-gray-200 rounded-lg hover:bg-background-secondary transition-colors font-medium"
              >
                {language === 'TR' ? 'İptal' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                {post 
                  ? (language === 'TR' ? 'Yazıyı Güncelle' : 'Update Post')
                  : (language === 'TR' ? 'Yazı Oluştur' : 'Create Post')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage 