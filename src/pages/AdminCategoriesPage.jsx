import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Globe, Settings, 
  Tag, Eye, Hash, Palette, ChevronRight, Star, ArrowLeft 
} from 'lucide-react'
import { COLORS, getAdminColors } from '../constants/colors'
import LogoService from '../services/logoService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com/api' : 'http://localhost:3001/api')

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const { language, setLanguage, toggleLanguage } = useLanguage()
  const [logo, setLogo] = useState('/Logo.png')
  const navigate = useNavigate()

  // Load logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoUrl = await LogoService.getLogo('main')
        setLogo(logoUrl)
      } catch (error) {
        console.error('Logo loading error:', error)
      }
    }
    loadLogo()
  }, [])

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

    loadCategories()
  }, [navigate])

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCategories(result.categories || [])
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      // Loading removed for better UX
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
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
          loadCategories()
          alert(language === 'TR' ? 'Kategori başarıyla silindi!' : 'Category deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        alert(language === 'TR' ? 'Kategori silinirken hata oluştu!' : 'Error deleting category!')
      }
    }
  }

  const handleSaveCategory = async (categoryData) => {
    try {
      const url = editingCategory 
        ? `${API_BASE_URL}/api/categories/${editingCategory.category_id}`
        : `${API_BASE_URL}/api/categories`
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      })

      if (response.ok) {
        loadCategories()
        setShowAddModal(false)
        setEditingCategory(null)
        alert(editingCategory 
          ? (language === 'TR' ? 'Kategori başarıyla güncellendi!' : 'Category updated successfully!')
          : (language === 'TR' ? 'Kategori başarıyla eklendi!' : 'Category added successfully!')
        )
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert(language === 'TR' ? 'Kategori kaydedilirken hata oluştu!' : 'Error saving category!')
    }
  }

  // Helper function to organize categories by parent
  const getOrganizedCategories = () => {
    const parentCategories = categories.filter(cat => !cat.parent_id)
    const childCategories = categories.filter(cat => cat.parent_id)
    
    return parentCategories.map(parent => ({
      ...parent,
      children: childCategories.filter(child => child.parent_id === parent.id)
    }))
  }

  // Loading removed for better UX

  const organizedCategories = getOrganizedCategories()

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === 'TR' ? 'Ana Panel' : 'Dashboard'}
              >
                <ArrowLeft className="h-5 w-5" />
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

            {/* Language and Logout */}
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
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">
                {language === 'TR' ? 'Kategori Yönetimi' : 'Category Management'}
              </h1>
              <p className="text-text/70 text-lg">
                {language === 'TR' 
                  ? 'Etkinlik ve blog kategorilerini yönetin'
                  : 'Manage event and blog categories'
                }
              </p>
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">{language === 'TR' ? 'Yeni Kategori Ekle' : 'Add New Category'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Toplam Kategori' : 'Total Categories'}</p>
                <p className="text-2xl font-bold text-text">{categories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Aktif Kategori' : 'Active Categories'}</p>
                <p className="text-2xl font-bold text-text">{categories.filter(cat => cat.is_active).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Hash className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Ana Kategori' : 'Parent Categories'}</p>
                <p className="text-2xl font-bold text-text">{categories.filter(cat => !cat.parent_id).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChevronRight className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Alt Kategori' : 'Sub Categories'}</p>
                <p className="text-2xl font-bold text-text">{categories.filter(cat => cat.parent_id).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-text">
              {language === 'TR' ? 'Kategori Listesi' : 'Category List'}
            </h2>
          </div>
          
          {categories.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {organizedCategories.map((category) => (
                <div key={category.id} className="p-6">
                  {/* Parent Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color_code || COLORS.PRIMARY }}
                      ></div>
                      <div>
                        <h3 className="font-semibold text-text text-lg">
                          {language === 'TR' ? category.name_tr : category.name_en}
                        </h3>
                        <p className="text-text/60 text-sm">
                          {language === 'TR' ? category.description_tr : category.description_en}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-text/50">ID: {category.category_id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            category.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.is_active 
                              ? (language === 'TR' ? 'Aktif' : 'Active')
                              : (language === 'TR' ? 'Pasif' : 'Inactive')
                            }
                          </span>
                          <span className="text-xs text-text/50">
                            {language === 'TR' ? 'Sıralama' : 'Order'}: {category.display_order}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex items-center space-x-1 text-primary hover:text-primary-light text-sm font-medium hover:bg-primary/10 px-3 py-1 rounded-md transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.category_id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{language === 'TR' ? 'Sil' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Child Categories */}
                  {category.children && category.children.length > 0 && (
                    <div className="ml-8 space-y-3 pl-4 border-l-2 border-gray-100">
                      {category.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: child.color_code || COLORS.PRIMARY }}
                            ></div>
                            <div>
                              <h4 className="font-medium text-text">
                                {language === 'TR' ? child.name_tr : child.name_en}
                              </h4>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-xs text-text/50">ID: {child.category_id}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  child.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {child.is_active 
                                    ? (language === 'TR' ? 'Aktif' : 'Active')
                                    : (language === 'TR' ? 'Pasif' : 'Inactive')
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCategory(child)}
                              className="flex items-center space-x-1 text-primary hover:text-primary-light text-xs font-medium hover:bg-primary/10 px-2 py-1 rounded-md transition-colors"
                            >
                              <Edit className="h-3 w-3" />
                              <span>{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(child.category_id)}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-xs font-medium hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>{language === 'TR' ? 'Sil' : 'Delete'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-text/30" />
              <h3 className="mt-4 text-lg font-medium text-text">
                {language === 'TR' ? 'Henüz kategori yok' : 'No categories yet'}
              </h3>
              <p className="mt-2 text-text/60">
                {language === 'TR' 
                  ? 'İlk kategorinizi ekleyerek başlayın.'
                  : 'Get started by adding your first category.'
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddCategory}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light transition-colors"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  {language === 'TR' ? 'Yeni Kategori Ekle' : 'Add New Category'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Category Modal */}
      {showAddModal && (
        <CategoryModal 
          category={editingCategory} 
          onClose={() => setShowAddModal(false)} 
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