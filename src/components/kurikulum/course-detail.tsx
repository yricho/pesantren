'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Users, Clock, BookOpen, Edit, UserPlus, UserMinus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Course } from '@/types'

interface CourseDetailProps {
  course: Course
  onClose: () => void
  onUpdate: (course: Course) => void
}

export function CourseDetail({ course, onClose, onUpdate }: CourseDetailProps) {
  const [localCourse, setLocalCourse] = useState(course)

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

  const updateStatus = (newStatus: string) => {
    const updatedCourse = { ...localCourse, status: newStatus }
    setLocalCourse(updatedCourse)
    onUpdate(updatedCourse)
  }

  const adjustEnrollment = (increment: boolean) => {
    const currentEnrolled = localCourse.enrolled
    let newEnrolled = currentEnrolled

    if (increment && currentEnrolled < localCourse.capacity) {
      newEnrolled = currentEnrolled + 1
    } else if (!increment && currentEnrolled > 0) {
      newEnrolled = currentEnrolled - 1
    }

    if (newEnrolled !== currentEnrolled) {
      const updatedCourse = { ...localCourse, enrolled: newEnrolled }
      setLocalCourse(updatedCourse)
      onUpdate(updatedCourse)
    }
  }

  const enrollmentPercentage = Math.round((localCourse.enrolled / localCourse.capacity) * 100)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(localCourse.level)}`}>
                {getLevelLabel(localCourse.level)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(localCourse.status)}`}>
                {getStatusLabel(localCourse.status)}
              </span>
            </div>
            <CardTitle className="text-2xl">{localCourse.name}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Course Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed">{localCourse.description}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Pengajar:</span>
                  <span>{localCourse.teacher}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Jadwal:</span>
                  <span>{localCourse.schedule}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <span className="font-medium">Durasi:</span>
                  <span>{localCourse.duration}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Enrollment Management */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Manajemen Santri</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">
                          {localCourse.enrolled} / {localCourse.capacity} santri
                        </span>
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
                      <p className="text-sm text-gray-600 mt-1">
                        {enrollmentPercentage}% terisi
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustEnrollment(false)}
                      disabled={localCourse.enrolled <= 0}
                      className="flex-1"
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Kurangi Santri
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustEnrollment(true)}
                      disabled={localCourse.enrolled >= localCourse.capacity}
                      className="flex-1"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Tambah Santri
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Update Status</h3>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={localCourse.status === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStatus('active')}
                    className="justify-start"
                  >
                    Aktif
                  </Button>
                  <Button
                    variant={localCourse.status === 'inactive' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStatus('inactive')}
                    className="justify-start"
                  >
                    Tidak Aktif
                  </Button>
                  <Button
                    variant={localCourse.status === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStatus('completed')}
                    className="justify-start"
                  >
                    Selesai
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Dibuat: {formatDate(localCourse.createdAt)}</p>
                  <p>Terakhir diupdate: {formatDate(localCourse.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Students Section (Placeholder) */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Daftar Santri</h3>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Fitur daftar santri</p>
              <p className="text-sm text-gray-500">
                Akan menampilkan daftar santri yang terdaftar di kelas ini
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Edit Kelas
            </Button>
            <Button onClick={onClose} className="flex-1">
              Tutup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}