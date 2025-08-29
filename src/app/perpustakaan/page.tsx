'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Eye, BookOpen, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  subcategory?: string;
  fileUrl: string;
  coverImage?: string;
  fileSize?: number;
  pageCount?: number;
  language: string;
  publisher?: string;
  publishYear?: string;
  tags: string[];
  downloadCount: number;
  viewCount: number;
  isFeatured: boolean;
}

const categories = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'fiqh', label: 'Fiqh' },
  { value: 'hadith', label: 'Hadith' },
  { value: 'tafsir', label: 'Tafsir' },
  { value: 'akhlak', label: 'Akhlak' },
  { value: 'sirah', label: 'Sirah Nabawiyah' },
  { value: 'aqidah', label: 'Aqidah' },
];

export default function PerpustakaanPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEbooks();
  }, []);

  useEffect(() => {
    filterEbooks();
  }, [searchQuery, selectedCategory, ebooks]);

  const fetchEbooks = async () => {
    try {
      const response = await fetch('/api/ebooks');
      if (response.ok) {
        const data = await response.json();
        setEbooks(data);
        setFilteredEbooks(data);
      }
    } catch (error) {
      console.error('Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEbooks = () => {
    let filtered = [...ebooks];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => 
        book.category.toLowerCase() === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEbooks(filtered);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleView = (ebook: Ebook) => {
    window.open(`/perpustakaan/reader/${ebook.id}`, '_blank');
    // Update view count
    fetch(`/api/ebooks/${ebook.id}/view`, { method: 'POST' });
  };

  const handleDownload = async (ebook: Ebook) => {
    // Update download count
    await fetch(`/api/ebooks/${ebook.id}/download`, { method: 'POST' });
    
    // Download file
    const link = document.createElement('a');
    link.href = ebook.fileUrl;
    link.download = `${ebook.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          Perpustakaan Digital
        </h1>
        <p className="text-gray-600">
          Koleksi kitab dan buku Islam untuk menambah ilmu pengetahuan
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari judul, penulis, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Koleksi</p>
              <p className="text-2xl font-bold text-green-800">{ebooks.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kategori</p>
              <p className="text-2xl font-bold text-yellow-800">7</p>
            </div>
            <Filter className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Dibaca</p>
              <p className="text-2xl font-bold text-blue-800">
                {ebooks.reduce((sum, book) => sum + book.viewCount, 0)}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Download</p>
              <p className="text-2xl font-bold text-purple-800">
                {ebooks.reduce((sum, book) => sum + book.downloadCount, 0)}
              </p>
            </div>
            <Download className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Ebooks Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat koleksi buku...</p>
        </div>
      ) : filteredEbooks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Tidak ada buku ditemukan</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEbooks.map((ebook) => (
            <Card key={ebook.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] bg-gradient-to-br from-green-100 to-yellow-50 relative">
                {ebook.coverImage ? (
                  <img
                    src={ebook.coverImage}
                    alt={ebook.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-24 w-24 text-green-600" />
                  </div>
                )}
                {ebook.isFeatured && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    Unggulan
                  </Badge>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                  {ebook.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{ebook.author}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {ebook.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {ebook.category}
                  </Badge>
                  {ebook.pageCount && (
                    <Badge variant="outline" className="text-xs">
                      {ebook.pageCount} hal
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {formatFileSize(ebook.fileSize)}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleView(ebook)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Baca
                  </Button>
                  <Button
                    onClick={() => handleDownload(ebook)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEbooks.map((ebook) => (
            <Card key={ebook.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <div className="w-24 h-32 bg-gradient-to-br from-green-100 to-yellow-50 rounded flex-shrink-0">
                  {ebook.coverImage ? (
                    <img
                      src={ebook.coverImage}
                      alt={ebook.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-12 w-12 text-green-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {ebook.title}
                        {ebook.isFeatured && (
                          <Badge className="ml-2 bg-yellow-500">Unggulan</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{ebook.author}</p>
                      <p className="text-sm text-gray-500 mb-3">
                        {ebook.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{ebook.category}</Badge>
                        {ebook.pageCount && (
                          <Badge variant="outline">{ebook.pageCount} halaman</Badge>
                        )}
                        <Badge variant="outline">{formatFileSize(ebook.fileSize)}</Badge>
                        <Badge variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          {ebook.viewCount}
                        </Badge>
                        <Badge variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          {ebook.downloadCount}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleView(ebook)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Baca
                      </Button>
                      <Button
                        onClick={() => handleDownload(ebook)}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Unduh
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}