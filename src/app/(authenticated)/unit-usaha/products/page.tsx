'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  AlertTriangle,
  Filter
} from 'lucide-react'

interface Product {
  id: string
  name: string
  code: string
  price: number
  cost: number
  stock: number
  minStock: number
  unit: string
  category: { name: string }
  isActive: boolean
  location: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL')
  const [showLowStock, setShowLowStock] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock products data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Nasi Gudeg',
        code: 'NGD001',
        price: 15000,
        cost: 10000,
        stock: 20,
        minStock: 10,
        unit: 'porsi',
        category: { name: 'Makanan' },
        isActive: true,
        location: 'KANTIN'
      },
      {
        id: '2',
        name: 'Es Teh Manis',
        code: 'ETM001',
        price: 3000,
        cost: 1500,
        stock: 5, // Low stock
        minStock: 10,
        unit: 'gelas',
        category: { name: 'Minuman' },
        isActive: true,
        location: 'KANTIN'
      },
      {
        id: '3',
        name: 'Keripik Tempe',
        code: 'KTP001',
        price: 8000,
        cost: 5000,
        stock: 30,
        minStock: 15,
        unit: 'bungkus',
        category: { name: 'Snack' },
        isActive: true,
        location: 'KOPERASI'
      },
      {
        id: '4',
        name: 'Buku Tulis',
        code: 'BT001',
        price: 5000,
        cost: 3000,
        stock: 8, // Low stock
        minStock: 20,
        unit: 'buah',
        category: { name: 'ATK' },
        isActive: true,
        location: 'KOPERASI'
      }
    ]
    
    setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === 'ALL' || product.location === selectedLocation
    const matchesLowStock = !showLowStock || product.stock < product.minStock
    
    return matchesSearch && matchesLocation && matchesLowStock && product.isActive
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { text: 'Habis', color: 'text-red-600 bg-red-100' }
    if (product.stock < product.minStock) return { text: 'Rendah', color: 'text-orange-600 bg-orange-100' }
    return { text: 'Normal', color: 'text-green-600 bg-green-100' }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kelola Produk</h1>
          <p className="text-gray-600">Kelola katalog produk dan stok</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="ALL">Semua Lokasi</option>
            <option value="KOPERASI">Koperasi</option>
            <option value="KANTIN">Kantin</option>
            <option value="KATERING">Katering</option>
          </select>
          <Button
            variant={showLowStock ? "default" : "outline"}
            onClick={() => setShowLowStock(!showLowStock)}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Stok Rendah
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Lainnya
          </Button>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const stockStatus = getStockStatus(product)
          const profitMargin = ((product.price - product.cost) / product.price) * 100
          
          return (
            <Card key={product.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.code}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Harga Jual:</span>
                  <span className="font-bold text-primary-600">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Modal:</span>
                  <span className="text-sm">
                    {formatCurrency(product.cost)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Margin:</span>
                  <span className="text-sm font-medium text-green-600">
                    {profitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">Stok: {product.stock} {product.unit}</p>
                  <p className="text-xs text-gray-400">Min: {product.minStock}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{product.category.name}</span>
                <span>{product.location}</span>
              </div>

              {product.stock < product.minStock && (
                <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-orange-700">
                      Stok di bawah minimum!
                    </span>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || showLowStock 
              ? 'Coba ubah filter pencarian Anda'
              : 'Mulai dengan menambahkan produk pertama Anda'
            }
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        </div>
      )}
    </div>
  )
}