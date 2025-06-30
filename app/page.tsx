'use client'

import React, { useState, useEffect } from 'react'
import { Search, MapPin, Filter, Heart, Clock, Star, ShoppingBag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import SearchSuggestions from '@/components/SearchSuggestions'
import dynamic from 'next/dynamic'
import FilterModal from '@/components/FilterModal'
import { Product, Store, Category } from '@/types'
import { searchProducts } from '../src/utils/search'
import { ProductService } from '../src/lib/github/services/ProductService'
import { GitHubDatabase } from '../src/lib/github/database'

// Динамический импорт карты без SSR - единственный способ импорта
const MapComponentClient = dynamic(() => import('@/components/MapComponentClient'), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">
          Карта магазинов со скидками
        </h2>
        <div className="text-sm text-neutral-600">
          Загрузка карты...
        </div>
      </div>
      <div className="relative" style={{ height: 500 }}>
        <div className="w-full h-full bg-neutral-100 rounded-xl flex items-center justify-center">
          <div className="text-neutral-500">Загрузка карты...</div>
        </div>
      </div>
    </div>
  )
})

const categories: Category[] = [
  { id: 'all', name: 'Все', icon: '🍽️' },
  { id: 'dairy', name: 'Молочка', icon: '🥛' },
  { id: 'bakery', name: 'Выпечка', icon: '🥖' },
  { id: 'fruits', name: 'Фрукты', icon: '🍎' },
  { id: 'vegetables', name: 'Овощи', icon: '🥬' },
  { id: 'meat', name: 'Мясо', icon: '🥩' },
  { id: 'grocery', name: 'Бакалея', icon: '🛒' }
]

export default function HomePage() {
  // Состояние для управления интерфейсом
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMap, setShowMap] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<'distance' | 'discount' | 'expiry'>('distance')

  const db = new GitHubDatabase()
  const productService = new ProductService(db)

  // Получение геолокации пользователя при загрузке страницы
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Ошибка получения геолокации:', error)
          // Устанавливаем координаты Ташкента по умолчанию
          setUserLocation({ lat: 41.2995, lng: 69.2401 })
        }
      )
    }
  }, [])

  useEffect(() => {
    productService.getAllProducts().then((products) => {
      setAllProducts(products)
      setFilteredProducts(products)
    })
  }, [])

  useEffect(() => {
    let filtered = searchProducts(allProducts, searchQuery)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product: any) => product.category === selectedCategory)
    }
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'distance':
          return a.store.distance - b.store.distance
        case 'discount':
          return b.discountPercentage - a.discountPercentage
        case 'expiry':
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        default:
          return 0
      }
    })
    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, sortBy, allProducts])

  // Обработчик поиска - обновляет поисковый запрос
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(false) // Скрываем подсказки при вводе
  }

  // Обработчик клика по подсказке
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }

  // Обработчик фокуса на поле поиска
  const handleSearchFocus = () => {
    setShowSuggestions(true)
  }

  // Обработчик клика вне поля поиска
  const handleClickOutside = () => {
    setShowSuggestions(false)
  }

  // Обработчик изменения категории
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  // Обработчик добавления в избранное
  const handleAddToFavorites = (productId: string) => {
    console.log('Добавлено в избранное:', productId)
    // Здесь будет логика добавления в избранное
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Шапка сайта */}
      <Header />
      
      {/* Основной контент */}
      <main className="container mx-auto px-4 py-6">
        {/* Поисковая секция */}
        <section className="mb-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 mb-6">
              Найдите товары со скидками рядом с вами
            </h1>
            <p className="text-lg text-neutral-600 text-center mb-8">
              Экономьте деньги и помогайте бороться с фуд-вэйстом в Узбекистане
            </p>
            
            {/* Поисковая строка с интеллектуальным поиском */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск товаров или магазинов... (поддерживает опечатки)"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleClickOutside}
                className="w-full pl-12 pr-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
              
              {/* Подсказки поиска */}
              <SearchSuggestions
                isVisible={showSuggestions}
                searchQuery={searchQuery}
                onSuggestionClick={handleSuggestionClick}
                onClose={() => setShowSuggestions(false)}
              />
            </div>

            {/* Кнопки переключения вида */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setShowMap(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !showMap 
                    ? 'bg-primary-500 text-white shadow-medium' 
                    : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <ShoppingBag className="inline-block w-4 h-4 mr-2" />
                Список товаров
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showMap 
                    ? 'bg-primary-500 text-white shadow-medium' 
                    : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <MapPin className="inline-block w-4 h-4 mr-2" />
                Карта магазинов
              </button>
            </div>
          </div>
        </section>

        {/* Фильтры и сортировка */}
        <section className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Категории */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Кнопка фильтров */}
            <button
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-all duration-200 flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </button>
          </div>

          {/* Сортировка */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Найдено {filteredProducts.length} товаров
              {searchQuery && (
                <span className="ml-2 text-primary-600">
                  по запросу "{searchQuery}"
                </span>
              )}
            </p>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'distance' | 'discount' | 'expiry')}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="distance">По расстоянию</option>
              <option value="discount">По размеру скидки</option>
              <option value="expiry">По сроку годности</option>
            </select>
          </div>
        </section>

        {/* Контент: карта или список товаров */}
        {showMap ? (
          <section className="mb-8">
            <MapComponentClient 
              key={`map-${showMap}-${Date.now()}`}
              products={filteredProducts}
              userLocation={userLocation}
            />
          </section>
        ) : (
          <section className="mb-8">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToFavorites={handleAddToFavorites}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Товары не найдены
                </h3>
                <p className="text-neutral-600">
                  {searchQuery 
                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить запрос или проверьте правописание.`
                    : 'Попробуйте изменить параметры поиска или фильтры'
                  }
                </p>
              </div>
            )}
          </section>
        )}

        {/* Статистика */}
        <section className="bg-white rounded-xl p-6 shadow-soft mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Статистика FoodSave
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">1,247</div>
              <div className="text-sm text-neutral-600">Товаров спасено от утилизации</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-600 mb-2">₿ 12.5M</div>
              <div className="text-sm text-neutral-600">Сэкономлено покупателями</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-600 mb-2">89</div>
              <div className="text-sm text-neutral-600">Магазинов участвует</div>
            </div>
          </div>
        </section>
      </main>

      {/* Подвал сайта */}
      <Footer />

      {/* Модальное окно фильтров */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={(filters) => {
          console.log('Применены фильтры:', filters)
          setShowFilters(false)
        }}
      />
    </div>
  )
} 