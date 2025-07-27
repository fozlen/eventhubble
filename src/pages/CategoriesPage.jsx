import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Megaphone, 
  Settings, 
  BarChart3, 
  Globe, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  ArrowLeft,
  Save,
  X
} from 'lucide-react'
import logo from '../assets/Logo.png'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Music', description: 'Concerts, festivals, and musical events', postCount: 15, color: '#473B73' },
    { id: 2, name: 'Theater', description: 'Plays, shows, and theatrical performances', postCount: 8, color: '#8B5CF6' },
    { id: 3, name: 'Sports', description: 'Matches, tournaments, and sporting events', postCount: 12, color: '#10B981' },
    { id: 4, name: 'Art', description: 'Exhibitions, workshops, and art events', postCount: 6, color: '#F59E0B' },
    { id: 5, name: 'Gastronomy', description: 'Food tastings, cooking workshops', postCount: 4, color: '#EF4444' },
    { id: 6, name: 'Education', description: 'Seminars, courses, and learning events', postCount: 9, color: '#3B82F6' },
    { id: 7, name: 'Technology', description: 'Tech conferences and workshops', postCount: 7, color: '#6366F1' },
    { id: 8, name: 'Fashion', description: 'Fashion shows and style events', postCount: 3, color: '#EC4899' }
  ])
  const [language, setLanguage] = useState('EN')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#473B73'
  })
  const navigate = useNavigate()

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    navigate('/admin/login')
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'EN' ? 'TR' : 'EN'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const handleAddCategory = () => {
    setFormData({
      name: '',
      description: '',
      color: '#473B73'
    })
    setEditingCategory(null)
    setShowAddModal(true)
  }

  const handleEditCategory = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    })
    setEditingCategory(category)
    setShowAddModal(true)
  }

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm(language === 'TR' ? 'Bu kategoriyi silmek istediğinizden emin misiniz?' : 'Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
    }
  }

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      alert(language === 'TR' ? 'Kategori adı gereklidir' : 'Category name is required')
      return
    }

    if (editingCategory) {
      // Edit existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ))
    } else {
      // Add new category
      const newCategory = {
        id: Date.now(),
        ...formData,
        postCount: 0
      }
      setCategories([...categories, newCategory])
    }

    setShowAddModal(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '', color: '#473B73' })
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '', color: '#473B73' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-primary-cream hover:opacity-80 transition-opacity"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">{language === 'TR' ? 'Geri' : 'Back'}</span>
              </button>
              <div className="flex items-center space-x-3">
                <img src={logo} alt="EventHubble" className="h-8 w-auto" />
                <div className="flex items-center space-x-2">
                  <Megaphone className="h-5 w-5 text-primary-cream" />
                  <span className="text-lg font-bold text-primary-cream">EventHubble</span>
                  <span className="ml-2 text-sm text-primary-cream/80">Admin Panel</span>
                </div>
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
                {language === 'TR' ? 'Kategori Yönetimi' : 'Category Management'}
              </h1>
              <p className="text-text/70 text-lg">
                {language === 'TR' 
                  ? 'Blog kategorilerini yönetin ve düzenleyin'
                  : 'Manage and organize your blog categories'
                }
              </p>
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">{language === 'TR' ? 'Yeni Kategori' : 'Add Category'}</span>
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-sm">
            <div className="flex items-center">
              <div className="p-3 bg-text-accent/10 rounded-lg">
                <Tag className="h-6 w-6 text-text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Toplam Kategori' : 'Total Categories'}</p>
                <p className="text-2xl font-bold text-text">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="text-lg font-semibold text-text">{category.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                    title={language === 'TR' ? 'Düzenle' : 'Edit'}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title={language === 'TR' ? 'Sil' : 'Delete'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-text/70 text-sm mb-4">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text/60">
                  {language === 'TR' ? `${category.postCount} yazı` : `${category.postCount} posts`}
                </span>
                <div 
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text">
                  {editingCategory 
                    ? (language === 'TR' ? 'Kategoriyi Düzenle' : 'Edit Category')
                    : (language === 'TR' ? 'Yeni Kategori Ekle' : 'Add New Category')
                  }
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-text/60 hover:text-text transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Kategori Adı' : 'Category Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder={language === 'TR' ? 'Kategori adı...' : 'Category name...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Açıklama' : 'Description'}
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40 resize-none"
                    placeholder={language === 'TR' ? 'Kategori açıklaması...' : 'Category description...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Renk' : 'Color'}
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 text-text border border-gray-200 rounded-lg hover:bg-background-secondary transition-colors font-medium"
                  >
                    {language === 'TR' ? 'İptal' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium shadow-lg hover:shadow-xl"
                  >
                    {editingCategory 
                      ? (language === 'TR' ? 'Güncelle' : 'Update')
                      : (language === 'TR' ? 'Ekle' : 'Add')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoriesPage 