import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Globe, Settings, 
  Tag, Eye, Hash, Palette, ChevronRight, Star, ArrowLeft 
} from 'lucide-react'
import { COLORS, getAdminColors } from '../constants/colors'
import { api } from '../services/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const { language, setLanguage, toggleLanguage } = useLanguage()
  const [logo, setLogo] = useState('/assets/Logo.png')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Load logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoData = await api.getActiveLogo('main')
        setLogo(logoData?.url || '/assets/Logo.png')
      } catch (error) {
        console.error('Logo loading error:', error)
      }
    }
    loadLogo()
  }, [])

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/categories`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCategories(result.data || [])
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    navigate('/admin/dashboard')
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowAddModal(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setShowAddModal(true)
  }

  const handleDeleteCategory = async (categoryId) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu kategoriyi silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this category?'
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setCategories(categories.filter(category => category.id !== categoryId))
        } else {
          console.error('Delete failed:', response.status)
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const handleSaveCategory = async (categoryData) => {
    try {
      const url = editingCategory 
        ? `${API_BASE_URL}/api/categories/${editingCategory.id}`
        : `${API_BASE_URL}/api/categories`
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (editingCategory) {
          setCategories(categories.map(category => 
            category.id === editingCategory.id ? result.data : category
          ))
        } else {
          setCategories([...categories, result.data])
        }
        setShowAddModal(false)
        setEditingCategory(null)
      } else {
        console.error('Save failed:', response.status)
      }
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const getOrganizedCategories = () => {
    const parentCategories = categories.filter(cat => !cat.parent_id)
    const childCategories = categories.filter(cat => cat.parent_id)
    
    return parentCategories.map(parent => ({
      ...parent,
      children: childCategories.filter(child => child.parent_id === parent.id)
    }))
  }

  const stats = [
    {
      title: language === 'TR' ? 'Toplam Kategori' : 'Total Categories',
      value: categories.length,
      icon: Tag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: language === 'TR' ? 'Aktif Kategori' : 'Active Categories',
      value: categories.filter(cat => cat.is_active).length,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: language === 'TR' ? 'Ana Kategori' : 'Parent Categories',
      value: categories.filter(cat => !cat.parent_id).length,
      icon: Hash,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: language === 'TR' ? 'Alt Kategori' : 'Sub Categories',
      value: categories.filter(cat => cat.parent_id).length,
      icon: ChevronRight,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <img src={logo} alt="EventHubble" className="h-8 w-auto" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {language === 'TR' ? 'Kategori Yönetimi' : 'Category Management'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'TR' ? 'Kategorileri yönet' : 'Manage categories'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{language}</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">{language === 'TR' ? 'Çıkış' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'TR' ? 'Kategori Yönetimi' : 'Category Management'}
            </h2>
            <p className="text-gray-600">
              {language === 'TR' ? 'Etkinlik ve blog kategorilerini yönetin' : 'Manage event and blog categories'}
            </p>
          </div>
          <button
            onClick={handleAddCategory}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{language === 'TR' ? '+ Yeni Kategori' : '+ Add New Category'}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    {isLoading ? (
                      <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'TR' ? 'Kategori Listesi' : 'Category List'}
            </h3>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'TR' ? 'Henüz kategori yok' : 'No categories yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {language === 'TR' ? 'İlk kategorinizi ekleyerek başlayın.' : 'Get started by adding your first category.'}
                </p>
                <button
                  onClick={handleAddCategory}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>{language === 'TR' ? '+ Yeni Kategori' : '+ Add New Category'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getOrganizedCategories().map((category) => (
                  <div key={category.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color || '#6B7280' }}
                        ></div>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {category.is_active ? (language === 'TR' ? 'Aktif' : 'Active') : (language === 'TR' ? 'Pasif' : 'Inactive')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    {category.children && category.children.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-2">
                          {language === 'TR' ? 'Alt Kategoriler:' : 'Sub Categories:'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {category.children.map((child) => (
                            <span key={child.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {child.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        <span className="text-xs">{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="text-xs">{language === 'TR' ? 'Sil' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Category Modal */}
      {showAddModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowAddModal(false)
            setEditingCategory(null)
          }}
          onSave={handleSaveCategory}
          language={language}
          categories={categories}
        />
      )}
    </div>
  )
}

const CategoryModal = ({ category, onClose, onSave, language = 'EN', categories }) => {
  const [formData, setFormData] = useState({
    category_id: category?.category_id || '',
    name_tr: category?.name_tr || '',
    name_en: category?.name_en || '',
    description_tr: category?.description_tr || '',
    description_en: category?.description_en || '',
            color_code: category?.color_code || COLORS.PRIMARY,
    parent_id: category?.parent_id || '',
    is_active: category?.is_active !== undefined ? category.is_active : true,
    display_order: category?.display_order || 0
  })

  const parentCategories = categories.filter(cat => !cat.parent_id && cat.id !== category?.id)

  const predefinedColors = getAdminColors()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert fields
    const categoryData = {
      ...formData,
      display_order: parseInt(formData.display_order) || 0,
      parent_id: formData.parent_id || null
    }
    
    onSave(categoryData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {category ? (language === 'TR' ? 'Kategori Düzenle' : 'Edit Category') : (language === 'TR' ? 'Yeni Kategori Ekle' : 'Add New Category')}
            </h2>
            <button
              onClick={onClose}
              className="text-text/60 hover:text-text transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Kategori ID' : 'Category ID'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="music, sports, theater..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Üst Kategori' : 'Parent Category'}
                </label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">{language === 'TR' ? 'Ana Kategori' : 'Main Category'}</option>
                  {parentCategories.map(parent => (
                    <option key={parent.id} value={parent.id}>
                      {language === 'TR' ? parent.name_tr : parent.name_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Türkçe Ad' : 'Turkish Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name_tr}
                  onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Müzik, Spor, Tiyatro..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'İngilizce Ad' : 'English Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Music, Sports, Theater..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Türkçe Açıklama' : 'Turkish Description'}
                </label>
                <textarea
                  rows="3"
                  value={formData.description_tr}
                  onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Kategori açıklaması..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'İngilizce Açıklama' : 'English Description'}
                </label>
                <textarea
                  rows="3"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Category description..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Renk Kodu' : 'Color Code'}
                </label>
                <div className="space-y-3">
                  <input
                    type="color"
                    value={formData.color_code}
                    onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                    className="w-full h-12 border border-gray-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color_code: color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color_code === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Sıralama' : 'Display Order'}
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-text">
                  {language === 'TR' ? 'Aktif' : 'Active'}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-text hover:bg-gray-50 transition-colors"
              >
                {language === 'TR' ? 'İptal' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {category ? (language === 'TR' ? 'Güncelle' : 'Update') : (language === 'TR' ? 'Ekle' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminCategoriesPage 