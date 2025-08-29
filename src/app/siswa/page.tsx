'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { 
  Plus, Search, Filter, Users, GraduationCap, 
  Baby, School, User, Phone, Mail, MapPin,
  Calendar, Edit, Trash2, Eye, Download
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Student {
  id: string
  nisn?: string | null
  nis: string
  fullName: string
  nickname?: string | null
  birthPlace: string
  birthDate: Date
  gender: string
  bloodType?: string | null
  address: string
  city: string
  phone?: string | null
  email?: string | null
  fatherName: string
  motherName: string
  institutionType: string
  grade?: string | null
  enrollmentYear: string
  status: string
  photo?: string | null
}

export default function SiswaPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<'all' | 'TK' | 'SD' | 'PONDOK'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [selectedType])

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedType !== 'all') params.set('institutionType', selectedType)
      
      const response = await fetch(`/api/students?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data.data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nis.includes(searchTerm) ||
      (student.nisn && student.nisn.includes(searchTerm))
    return matchesSearch
  })

  const stats = {
    tk: students.filter(s => s.institutionType === 'TK').length,
    sd: students.filter(s => s.institutionType === 'SD').length,
    pondok: students.filter(s => s.institutionType === 'PONDOK').length,
    total: students.length
  }

  const exportToCSV = () => {
    const headers = ['NIS', 'NISN', 'Nama Lengkap', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Alamat', 'Kota', 'Nama Ayah', 'Nama Ibu', 'Institusi', 'Kelas', 'Status']
    const csvData = filteredStudents.map(s => [
      s.nis,
      s.nisn || '',
      s.fullName,
      s.gender === 'MALE' ? 'Laki-laki' : 'Perempuan',
      s.birthPlace,
      formatDate(s.birthDate),
      s.address,
      s.city,
      s.fatherName,
      s.motherName,
      s.institutionType,
      s.grade || '',
      s.status
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-siswa-${selectedType}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manajemen Siswa" />
      
      <main className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Siswa</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">TK</p>
                  <p className="text-2xl font-bold">{stats.tk}</p>
                </div>
                <Baby className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">SD</p>
                  <p className="text-2xl font-bold">{stats.sd}</p>
                </div>
                <School className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pondok</p>
                  <p className="text-2xl font-bold">{stats.pondok}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari nama, NIS, atau NISN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Filter by Institution */}
              <div className="flex gap-2">
                {(['all', 'TK', 'SD', 'PONDOK'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className={selectedType === type ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {type === 'all' ? 'Semua' : type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Siswa
              </Button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIS / NISN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institusi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    L/P
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orang Tua
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data siswa
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {student.photo ? (
                            <img src={student.photo} alt={student.fullName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.nis}</p>
                          {student.nisn && (
                            <p className="text-xs text-gray-500">{student.nisn}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.fullName}</p>
                          {student.nickname && (
                            <p className="text-xs text-gray-500">({student.nickname})</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          student.institutionType === 'TK' ? 'bg-yellow-100 text-yellow-800' :
                          student.institutionType === 'SD' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {student.institutionType}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {student.grade || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {student.gender === 'MALE' ? 'L' : 'P'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">Ayah: {student.fatherName}</p>
                          <p className="text-gray-500">Ibu: {student.motherName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          student.status === 'GRADUATED' ? 'bg-blue-100 text-blue-800' :
                          student.status === 'TRANSFERRED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {student.status === 'ACTIVE' ? 'Aktif' :
                           student.status === 'GRADUATED' ? 'Lulus' :
                           student.status === 'TRANSFERRED' ? 'Pindah' :
                           'Keluar'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedStudent(student)}
                            className="h-8 w-8"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">Detail Siswa</h2>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSelectedStudent(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Photo and Basic Info */}
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                      {selectedStudent.photo ? (
                        <img src={selectedStudent.photo} alt={selectedStudent.fullName} className="w-full h-full rounded-lg object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{selectedStudent.fullName}</h3>
                      {selectedStudent.nickname && (
                        <p className="text-sm text-gray-600">Panggilan: {selectedStudent.nickname}</p>
                      )}
                      <p className="text-sm text-gray-600">NIS: {selectedStudent.nis}</p>
                      {selectedStudent.nisn && (
                        <p className="text-sm text-gray-600">NISN: {selectedStudent.nisn}</p>
                      )}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Pribadi</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Jenis Kelamin:</span>
                        <span className="ml-2">{selectedStudent.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Golongan Darah:</span>
                        <span className="ml-2">{selectedStudent.bloodType || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tempat Lahir:</span>
                        <span className="ml-2">{selectedStudent.birthPlace}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tanggal Lahir:</span>
                        <span className="ml-2">{formatDate(selectedStudent.birthDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Kontak</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{selectedStudent.address}, {selectedStudent.city}</span>
                      </div>
                      {selectedStudent.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{selectedStudent.phone}</span>
                        </div>
                      )}
                      {selectedStudent.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{selectedStudent.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Orang Tua</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Nama Ayah:</p>
                        <p className="font-medium">{selectedStudent.fatherName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Nama Ibu:</p>
                        <p className="font-medium">{selectedStudent.motherName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Akademik</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Institusi:</span>
                        <span className="ml-2">{selectedStudent.institutionType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Kelas:</span>
                        <span className="ml-2">{selectedStudent.grade || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tahun Masuk:</span>
                        <span className="ml-2">{selectedStudent.enrollmentYear}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="ml-2">{selectedStudent.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setSelectedStudent(null)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}