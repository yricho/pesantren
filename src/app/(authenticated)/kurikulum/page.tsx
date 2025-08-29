'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Plus, Users, Clock, BookOpen, Filter } from 'lucide-react'
import { Course } from '@/types'
import { CourseForm } from '@/components/kurikulum/course-form'
import { CourseDetail } from '@/components/kurikulum/course-detail'

export default function Kurikulum() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'completed'>('all')
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  useEffect(() => {
    // Simulate loading courses
    setTimeout(() => {
      setCourses([
        {
          id: '1',
          name: 'Tahfidz Al-Quran Tingkat Dasar',
          description: 'Program menghafal Al-Quran untuk tingkat pemula dengan target 5 juz',
          level: 'beginner',
          schedule: 'Senin-Kamis, 07:00-09:00',
          teacher: 'Ustadz Ahmad Fauzi, S.Pd.I',
          duration: '6 bulan',
          capacity: 20,
          enrolled: 18,
          status: 'active',
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Fiqih Muamalah',
          description: 'Pembelajaran tentang hukum Islam dalam bermuamalah dan transaksi',
          level: 'intermediate',
          schedule: 'Selasa-Jumat, 13:00-15:00',
          teacher: 'Ustadz Muhammad Yusuf, M.A',
          duration: '4 bulan',
          capacity: 25,
          enrolled: 22,
          status: 'active',
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Bahasa Arab Praktis',
          description: 'Pembelajaran bahasa Arab dengan fokus pada percakapan sehari-hari',
          level: 'beginner',
          schedule: 'Senin-Rabu, 15:30-17:00',
          teacher: 'Ustadzah Fatimah, Lc',
          duration: '8 bulan',
          capacity: 15,
          enrolled: 12,
          status: 'active',
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          name: 'Ilmu Hadits',
          description: 'Studi mendalam tentang hadits Rasulullah SAW dan metodologi pemahaman',
          level: 'advanced',
          schedule: 'Kamis-Sabtu, 19:00-21:00',
          teacher: 'Ustadz Dr. Abdullah Mansur',
          duration: '12 bulan',
          capacity: 12,
          enrolled: 8,
          status: 'active',
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '5',
          name: 'Tahsin Al-Quran',
          description: 'Program perbaikan bacaan Al-Quran sesuai kaidah tajwid',
          level: 'beginner',
          schedule: 'Sabtu-Minggu, 08:00-10:00',
          teacher: 'Ustadz Hafiz Rahman, S.Pd',
          duration: '3 bulan',
          capacity: 30,
          enrolled: 30,
          status: 'completed',
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesStatus = filter === 'all' || course.status === filter
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter
    return matchesStatus && matchesLevel
  })

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Pemula'
      case 'intermediate': return 'Menengah'
      case 'advanced': return 'Lanjutan'
      default: return level
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'inactive': return 'Tidak Aktif'
      case 'completed': return 'Selesai'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateEnrollmentPercentage = (enrolled: number, capacity: number) => {
    return Math.round((enrolled / capacity) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manajemen Kurikulum" />
      
      <main className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center">
                {courses.length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Total Kelas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-green-600">
                {courses.filter(c => c.status === 'active').length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Kelas Aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-blue-600">
                {courses.reduce((sum, c) => sum + c.enrolled, 0)}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Total Santri
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-purple-600">
                {Math.round(courses.reduce((sum, c) => sum + (c.enrolled / c.capacity * 100), 0) / courses.length)}%
              </div>
              <p className="text-sm text-gray-600 text-center">
                Rata-rata Kapasitas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="completed">Selesai</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Semua Level</option>
              <option value="beginner">Pemula</option>
              <option value="intermediate">Menengah</option>
              <option value="advanced">Lanjutan</option>
            </select>
          </div>

          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kelas
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Tidak ada kelas ditemukan
            </div>
          ) : (
            filteredCourses.map((course) => {
              const enrollmentPercentage = calculateEnrollmentPercentage(course.enrolled, course.capacity)
              
              return (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedCourse(course)}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                          {getLevelLabel(course.level)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                          {getStatusLabel(course.status)}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{course.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-medium">{course.teacher}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{course.schedule}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolled} / {course.capacity} santri</span>
                      </div>
                    </div>

                    {/* Enrollment Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Kapasitas</span>
                        <span>{enrollmentPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            enrollmentPercentage >= 90 ? 'bg-red-600' :
                            enrollmentPercentage >= 70 ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${enrollmentPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Durasi: {course.duration}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          enrollmentPercentage >= 90 ? 'bg-red-100 text-red-800' :
                          enrollmentPercentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {enrollmentPercentage >= 90 ? 'Penuh' :
                           enrollmentPercentage >= 70 ? 'Hampir Penuh' :
                           'Tersedia'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </main>

      {/* Course Form Modal */}
      {showForm && (
        <CourseForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            const newCourse: Course = {
              id: Math.random().toString(),
              ...data,
              enrolled: 0,
              createdBy: 'current-user',
              createdAt: new Date(),
              updatedAt: new Date()
            }
            setCourses([newCourse, ...courses])
            setShowForm(false)
          }}
        />
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onUpdate={(updatedCourse) => {
            setCourses(courses.map(c => 
              c.id === updatedCourse.id ? updatedCourse : c
            ))
            setSelectedCourse(null)
          }}
        />
      )}
    </div>
  )
}