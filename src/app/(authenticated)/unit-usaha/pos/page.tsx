'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  X, 
  Search, 
  CreditCard,
  Banknote,
  Smartphone,
  QrCode
} from 'lucide-react'

interface Product {
  id: string
  name: string
  code: string
  price: number
  stock: number
  category: { name: string }
  unit: string
}

interface CartItem {
  product: Product
  quantity: number
  subtotal: number
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<'KOPERASI' | 'KANTIN' | 'KATERING'>('KOPERASI')
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER' | 'QRIS'>('CASH')
  const [paidAmount, setPaidAmount] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock products data - in real implementation, fetch from API
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Nasi Gudeg',
        code: 'NGD001',
        price: 15000,
        stock: 20,
        category: { name: 'Makanan' },
        unit: 'porsi'
      },
      {
        id: '2',
        name: 'Es Teh Manis',
        code: 'ETM001',
        price: 3000,
        stock: 50,
        category: { name: 'Minuman' },
        unit: 'gelas'
      },
      {
        id: '3',
        name: 'Keripik Tempe',
        code: 'KTP001',
        price: 8000,
        stock: 30,
        category: { name: 'Snack' },
        unit: 'bungkus'
      }
    ]
    setProducts(mockProducts)
  }, [])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        updateQuantity(product.id, existingItem.quantity + 1)
      }
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        subtotal: product.price
      }
      setCart([...cart, newItem])
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map(item => 
      item.product.id === productId 
        ? { 
            ...item, 
            quantity: newQuantity,
            subtotal: item.product.price * newQuantity
          }
        : item
    ))
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setShowPayment(false)
    setPaidAmount('')
  }

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax
  const change = paidAmount ? Math.max(0, parseFloat(paidAmount) - total) : 0

  const handleCheckout = async () => {
    if (cart.length === 0) return
    if (!paidAmount || parseFloat(paidAmount) < total) return

    setIsLoading(true)
    try {
      // In real implementation, call the sales API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Mock API call
      
      // Show success message and clear cart
      alert('Transaksi berhasil!')
      clearCart()
    } catch (error) {
      alert('Transaksi gagal!')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const paymentIcons = {
    CASH: <Banknote className="w-5 h-5" />,
    CARD: <CreditCard className="w-5 h-5" />,
    TRANSFER: <Smartphone className="w-5 h-5" />,
    QRIS: <QrCode className="w-5 h-5" />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - Products */}
      <div className="flex-1 p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Point of Sale</h1>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari produk atau kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="KOPERASI">Koperasi</option>
              <option value="KANTIN">Kantin</option>
              <option value="KATERING">Katering</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <Card 
              key={product.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => addToCart(product)}
            >
              <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{product.code}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary-600">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs text-gray-500">
                  Stok: {product.stock}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{product.category.name}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-96 bg-white shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Keranjang ({cart.length})
          </h2>
          {cart.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Keranjang kosong</p>
            <p className="text-sm">Pilih produk untuk mulai</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mb-4 max-h-64">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between py-2 border-b">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.product.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (10%):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {!showPayment ? (
              <Button 
                className="w-full mt-4"
                onClick={() => setShowPayment(true)}
              >
                Bayar
              </Button>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {(['CASH', 'CARD', 'TRANSFER', 'QRIS'] as const).map(method => (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentMethod(method)}
                      className="flex flex-col items-center p-2 h-12"
                    >
                      {paymentIcons[method]}
                      <span className="text-xs mt-1">{method}</span>
                    </Button>
                  ))}
                </div>
                
                <Input
                  type="number"
                  placeholder="Jumlah bayar"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
                
                {paidAmount && parseFloat(paidAmount) >= total && (
                  <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
                    <span className="text-green-700 font-medium">
                      Kembalian: {formatCurrency(change)}
                    </span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPayment(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={!paidAmount || parseFloat(paidAmount) < total || isLoading}
                  >
                    {isLoading ? 'Proses...' : 'Selesai'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}