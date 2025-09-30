'use client'

import { DonationCategory } from '@/types'
import { Card } from '@/components/ui/card'

interface CategorySelectorProps {
  categories: DonationCategory[]
  selectedId?: string
  onSelect: (categoryId: string) => void
  layout?: 'grid' | 'list'
  showDescription?: boolean
}

export function CategorySelector({ 
  categories, 
  selectedId, 
  onSelect, 
  layout = 'grid',
  showDescription = true 
}: CategorySelectorProps) {
  
  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
    : 'space-y-3'

  return (
    <div className={gridClasses}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`text-left transition-all ${
            layout === 'grid' ? 'w-full' : 'block w-full'
          }`}
        >
          <Card 
            className={`p-4 hover:shadow-md transition-shadow ${
              selectedId === category.id
                ? 'ring-2 ring-green-500 bg-green-50'
                : 'hover:border-green-300'
            } ${layout === 'list' ? 'flex items-center space-x-4' : 'text-center'}`}
          >
            {/* Icon */}
            <div 
              className={`${
                layout === 'grid' 
                  ? 'w-12 h-12 mx-auto mb-3' 
                  : 'w-10 h-10 flex-shrink-0'
              } rounded-full flex items-center justify-center text-white text-xl font-semibold`}
              style={{ backgroundColor: category.color || '#10B981' }}
            >
              {category.icon || '💝'}
            </div>
            
            <div className={layout === 'list' ? 'flex-1' : ''}>
              {/* Name */}
              <h3 className={`font-semibold text-gray-900 ${
                layout === 'grid' ? 'mb-2' : 'mb-1'
              }`}>
                {category.name}
              </h3>
              
              {/* Description */}
              {showDescription && category.description && (
                <p className={`text-gray-600 ${
                  layout === 'grid' ? 'text-sm' : 'text-sm'
                }`}>
                  {category.description}
                </p>
              )}

              {/* Stats */}
              {category._count && (
                <div className={`${
                  layout === 'grid' ? 'mt-3 pt-3 border-t border-gray-200' : 'mt-2'
                } text-xs text-gray-500`}>
                  <div className={`${
                    layout === 'grid' 
                      ? 'flex justify-between' 
                      : 'flex space-x-4'
                  }`}>
                    <span>{category._count.campaigns} campaign</span>
                    <span>{category._count.donations} donasi</span>
                  </div>
                </div>
              )}
            </div>

            {/* Selected indicator */}
            {selectedId === category.id && (
              <div className={`${
                layout === 'grid' 
                  ? 'absolute top-2 right-2' 
                  : 'ml-4'
              } w-6 h-6 bg-green-500 rounded-full flex items-center justify-center`}>
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            )}
          </Card>
        </button>
      ))}
    </div>
  )
}

// Quick category buttons for donation form
export function QuickCategoryButtons({ categories, selectedId, onSelect }: {
  categories: DonationCategory[]
  selectedId?: string
  onSelect: (categoryId: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.slice(0, 4).map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedId === category.id
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-green-100'
          }`}
        >
          <span className="mr-2">{category.icon || '💝'}</span>
          {category.name}
        </button>
      ))}
    </div>
  )
}