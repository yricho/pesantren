'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Header } from '@/components/layout/header'
import { 
  Plus, Search, Filter, Users, GraduationCap, 
  BookOpen, User, Phone, Mail, MapPin,
  Calendar, Edit, Trash2, Eye, UserCheck, UserX,
  BookOpenCheck, Building, Trophy, School,
  UserPlus, Save, X, AlertTriangle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Teacher {
  id: string
  nip?: string | null
  name: string
  title?: string | null
  gender: string
  birthPlace?: string | null
  birthDate?: Date | null
  phone?: string | null
  email?: string | null
  address?: string | null
  position: string
  subjects: string[]
  education?: string | null
  university?: string | null
  major?: string | null
  certifications: string[]
  employmentType: string
  joinDate?: Date | null
  status: string
  institution: string
  specialization?: string | null
  experience?: number | null
  photo?: string | null
  bio?: string | null
  achievements: string[]
  isUstadz: boolean
  createdAt: Date
  updatedAt: Date
}

interface TeacherFormData {
  nip?: string
  name: string
  title?: string
  gender: string
  birthPlace?: string
  birthDate?: string
  phone?: string
  email?: string
  address?: string
  position: string
  subjects: string[]
  education?: string
  university?: string
  major?: string
  certifications: string[]
  employmentType: string
  joinDate?: string
  status: string
  institution: string
  specialization?: string
  experience?: number
  photo?: string
  bio?: string
  achievements: string[]
  isUstadz: boolean
}

const initialFormData: TeacherFormData = {
  name: '',
  gender: 'L',
  position: '',
  subjects: [],
  certifications: [],
  employmentType: 'TETAP',
  status: 'ACTIVE',
  institution: 'PONDOK',
  achievements: [],
  isUstadz: true
}

export default function PengajarPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'all' | 'ustadz' | 'ustadzah'>('all')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState<TeacherFormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  
  // Selected items
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null)

  useEffect(() => {
    fetchTeachers()
  }, [])

  useEffect(() => {
    filterTeachers()
  }, [teachers, searchTerm, selectedInstitution, selectedStatus, activeTab])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/teachers?limit=1000')
      if (response.ok) {
        const data = await response.json()
        setTeachers(data.teachers)
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterTeachers = () => {
    let filtered = teachers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.nip && teacher.nip.includes(searchTerm)) ||
        (teacher.specialization && teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by institution
    if (selectedInstitution !== 'all') {
      filtered = filtered.filter(teacher => 
        teacher.institution === selectedInstitution || teacher.institution === 'ALL'
      )
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(teacher => teacher.status === selectedStatus)
    }

    // Filter by tab (Ustadz/Ustadzah)
    if (activeTab === 'ustadz') {
      filtered = filtered.filter(teacher => teacher.isUstadz === true)
    } else if (activeTab === 'ustadzah') {
      filtered = filtered.filter(teacher => teacher.isUstadz === false)
    }

    setFilteredTeachers(filtered)
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Nama wajib diisi'
    }
    
    if (!formData.gender) {
      errors.gender = 'Jenis kelamin wajib dipilih'
    }
    
    if (!formData.position.trim()) {
      errors.position = 'Jabatan wajib diisi'
    }
    
    if (!formData.institution) {
      errors.institution = 'Institusi wajib dipilih'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email tidak valid'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)
      const method = showEditModal ? 'PUT' : 'POST'
      const url = '/api/teachers'
      
      const submitData = {
        ...formData,
        ...(showEditModal && selectedTeacher ? { id: selectedTeacher.id } : {})
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal menyimpan data')
      }

      const savedTeacher = await response.json()
      
      if (showEditModal && selectedTeacher) {
        setTeachers(teachers.map(t => t.id === selectedTeacher.id ? savedTeacher : t))
      } else {
        setTeachers([savedTeacher, ...teachers])
      }

      handleCloseModal()
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!teacherToDelete) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/teachers?id=${teacherToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus data')
      }

      setTeachers(teachers.filter(t => t.id !== teacherToDelete.id))
      setShowDeleteModal(false)
      setTeacherToDelete(null)
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setShowDetailModal(false)
    setFormData(initialFormData)
    setFormErrors({})
    setSelectedTeacher(null)
  }

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setFormData({
      nip: teacher.nip || '',
      name: teacher.name,
      title: teacher.title || '',
      gender: teacher.gender,
      birthPlace: teacher.birthPlace || '',
      birthDate: teacher.birthDate ? new Date(teacher.birthDate).toISOString().split('T')[0] : '',
      phone: teacher.phone || '',
      email: teacher.email || '',
      address: teacher.address || '',
      position: teacher.position,
      subjects: teacher.subjects || [],
      education: teacher.education || '',
      university: teacher.university || '',
      major: teacher.major || '',
      certifications: teacher.certifications || [],
      employmentType: teacher.employmentType,
      joinDate: teacher.joinDate ? new Date(teacher.joinDate).toISOString().split('T')[0] : '',
      status: teacher.status,
      institution: teacher.institution,
      specialization: teacher.specialization || '',
      experience: teacher.experience || undefined,
      photo: teacher.photo || '',
      bio: teacher.bio || '',
      achievements: teacher.achievements || [],
      isUstadz: teacher.isUstadz
    })
    setShowEditModal(true)
  }

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, '']
    })
  }

  const removeSubject = (index: number) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index)
    })
  }

  const updateSubject = (index: number, value: string) => {
    const newSubjects = [...formData.subjects]
    newSubjects[index] = value
    setFormData({
      ...formData,
      subjects: newSubjects
    })
  }

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, '']
    })
  }

  const removeCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index)
    })
  }

  const updateCertification = (index: number, value: string) => {
    const newCertifications = [...formData.certifications]
    newCertifications[index] = value
    setFormData({
      ...formData,
      certifications: newCertifications
    })
  }

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, '']
    })
  }

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    })
  }

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...formData.achievements]
    newAchievements[index] = value
    setFormData({
      ...formData,
      achievements: newAchievements
    })
  }

  const stats = {
    total: teachers.length,
    ustadz: teachers.filter(t => t.isUstadz === true).length,
    ustadzah: teachers.filter(t => t.isUstadz === false).length,
    active: teachers.filter(t => t.status === 'ACTIVE').length,
    tk: teachers.filter(t => t.institution === 'TK' || t.institution === 'ALL').length,
    sd: teachers.filter(t => t.institution === 'SD' || t.institution === 'ALL').length,
    pondok: teachers.filter(t => t.institution === 'PONDOK' || t.institution === 'ALL').length
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
      <Header title="Manajemen Pengajar" />
      
      <main className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pengajar</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ustadz</p>
                  <p className="text-2xl font-bold">{stats.ustadz}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ustadzah</p>
                  <p className="text-2xl font-bold">{stats.ustadzah}</p>
                </div>
                <UserX className="w-8 h-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aktif</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
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
                  placeholder="Cari nama, NIP, jabatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="px-5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Semua Institusi</option>
                  <option value="TK">TK</option>
                  <option value="SD">SD</option>
                  <option value="PONDOK">Pondok</option>
                  <option value="ALL">Semua Jenjang</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Tidak Aktif</option>
                  <option value="LEAVE">Cuti</option>
                </select>
              </div>
            </div>

            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pengajar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'ustadz' | 'ustadzah')}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">Semua ({stats.total})</TabsTrigger>
            <TabsTrigger value="ustadz">Ustadz ({stats.ustadz})</TabsTrigger>
            <TabsTrigger value="ustadzah">Ustadzah ({stats.ustadzah})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <TeachersTable teachers={filteredTeachers} onEdit={handleEdit} onDelete={(teacher) => {
              setTeacherToDelete(teacher)
              setShowDeleteModal(true)
            }} onView={(teacher) => {
              setSelectedTeacher(teacher)
              setShowDetailModal(true)
            }} />
          </TabsContent>

          <TabsContent value="ustadz" className="space-y-4">
            <TeachersTable teachers={filteredTeachers} onEdit={handleEdit} onDelete={(teacher) => {
              setTeacherToDelete(teacher)
              setShowDeleteModal(true)
            }} onView={(teacher) => {
              setSelectedTeacher(teacher)
              setShowDetailModal(true)
            }} />
          </TabsContent>

          <TabsContent value="ustadzah" className="space-y-4">
            <TeachersTable teachers={filteredTeachers} onEdit={handleEdit} onDelete={(teacher) => {
              setTeacherToDelete(teacher)
              setShowDeleteModal(true)
            }} onView={(teacher) => {
              setSelectedTeacher(teacher)
              setShowDetailModal(true)
            }} />
          </TabsContent>
        </Tabs>

        {/* Add/Edit Modal */}
        <Dialog open={showAddModal || showEditModal} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">
                {showEditModal ? 'Edit Pengajar' : 'Tambah Pengajar'}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {showEditModal ? 'Perbarui data pengajar' : 'Tambahkan pengajar baru ke dalam sistem'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nip" className="text-gray-700">NIP</Label>
                  <Input
                    id="nip"
                    value={formData.nip}
                    onChange={(e) => setFormData({...formData, nip: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700">Gelar Akademik</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="S.Pd., M.Pd., Dr., dll"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700">Jenis Kelamin *</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value, isUstadz: e.target.value === 'L'})}
                    className={`w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${formErrors.gender ? 'border-red-500' : ''}`}
                  >
                    <option value="L">Laki-laki (Ustadz)</option>
                    <option value="P">Perempuan (Ustadzah)</option>
                  </select>
                  {formErrors.gender && <p className="text-red-500 text-sm">{formErrors.gender}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="text-gray-700">Tempat Lahir</Label>
                  <Input
                    id="birthPlace"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-gray-700">Tanggal Lahir</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">No. Telepon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">Alamat</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                />
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-gray-700">Jabatan *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="Guru Kelas, Guru Mapel, Kepala Sekolah, dll"
                    className={formErrors.position ? 'border-red-500' : ''}
                  />
                  {formErrors.position && <p className="text-red-500 text-sm">{formErrors.position}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-gray-700">Institusi *</Label>
                  <select
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    className={`w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${formErrors.institution ? 'border-red-500' : ''}`}
                  >
                    <option value="">Pilih Institusi</option>
                    <option value="TK">TK</option>
                    <option value="SD">SD</option>
                    <option value="PONDOK">Pondok</option>
                    <option value="ALL">Semua Jenjang</option>
                  </select>
                  {formErrors.institution && <p className="text-red-500 text-sm">{formErrors.institution}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-gray-700">Spesialisasi</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    placeholder="Tahfidz, Kitab, Bahasa Arab, dll"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-gray-700">Pengalaman (Tahun)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience || ''}
                    onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || undefined})}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType" className="text-gray-700">Jenis Kepegawaian</Label>
                  <select
                    id="employmentType"
                    value={formData.employmentType}
                    onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="TETAP">Tetap</option>
                    <option value="HONORER">Honorer</option>
                    <option value="KONTRAK">Kontrak</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joinDate" className="text-gray-700">Tanggal Bergabung</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-700">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="ACTIVE">Aktif</option>
                    <option value="INACTIVE">Tidak Aktif</option>
                    <option value="LEAVE">Cuti</option>
                  </select>
                </div>
              </div>

              {/* Education */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-gray-700">Pendidikan Terakhir</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                    placeholder="S1, S2, S3, dll"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university" className="text-gray-700">Universitas</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major" className="text-gray-700">Jurusan</Label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                  />
                </div>
              </div>

              {/* Subjects */}
              <div className="space-y-2">
                <Label className="text-gray-700">Mata Pelajaran yang Diajar</Label>
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={subject}
                      onChange={(e) => updateSubject(index, e.target.value)}
                      placeholder="Nama mata pelajaran"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSubject(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSubject}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Mata Pelajaran
                </Button>
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <Label className="text-gray-700">Sertifikasi</Label>
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={cert}
                      onChange={(e) => updateCertification(index, e.target.value)}
                      placeholder="Nama sertifikasi"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCertification(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCertification}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Sertifikasi
                </Button>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <Label className="text-gray-700">Prestasi</Label>
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="Prestasi yang dicapai"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeAchievement(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAchievement}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Prestasi
                </Button>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-700">Biografi Singkat</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  placeholder="Ceritakan sedikit tentang pengajar ini..."
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-gray-900">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Konfirmasi Hapus
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Apakah Anda yakin ingin menghapus data pengajar <strong className="text-gray-900">{teacherToDelete?.name}</strong>?
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? 'Menghapus...' : 'Hapus'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={() => setShowDetailModal(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Detail Pengajar</DialogTitle>
            </DialogHeader>

            {selectedTeacher && (
              <div className="space-y-6">
                {/* Header with photo and basic info */}
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                    {selectedTeacher.photo ? (
                      <img src={selectedTeacher.photo} alt={selectedTeacher.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{selectedTeacher.name}</h3>
                    {selectedTeacher.title && (
                      <p className="text-gray-600">{selectedTeacher.title}</p>
                    )}
                    <p className="text-lg text-green-600 font-semibold">{selectedTeacher.position}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedTeacher.isUstadz ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {selectedTeacher.isUstadz ? 'Ustadz' : 'Ustadzah'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedTeacher.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        selectedTeacher.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedTeacher.status === 'ACTIVE' ? 'Aktif' :
                         selectedTeacher.status === 'INACTIVE' ? 'Tidak Aktif' : 'Cuti'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informasi Pribadi
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    {selectedTeacher.nip && (
                      <div>
                        <p className="text-sm text-gray-600">NIP</p>
                        <p className="font-medium">{selectedTeacher.nip}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Jenis Kelamin</p>
                      <p className="font-medium">{selectedTeacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                    </div>
                    {selectedTeacher.birthPlace && (
                      <div>
                        <p className="text-sm text-gray-600">Tempat Lahir</p>
                        <p className="font-medium">{selectedTeacher.birthPlace}</p>
                      </div>
                    )}
                    {selectedTeacher.birthDate && (
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Lahir</p>
                        <p className="font-medium">{formatDate(selectedTeacher.birthDate)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Informasi Kontak
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    {selectedTeacher.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedTeacher.phone}</span>
                      </div>
                    )}
                    {selectedTeacher.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedTeacher.email}</span>
                      </div>
                    )}
                    {selectedTeacher.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <span>{selectedTeacher.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Informasi Profesional
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Institusi</p>
                      <p className="font-medium">{selectedTeacher.institution}</p>
                    </div>
                    {selectedTeacher.specialization && (
                      <div>
                        <p className="text-sm text-gray-600">Spesialisasi</p>
                        <p className="font-medium">{selectedTeacher.specialization}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Jenis Kepegawaian</p>
                      <p className="font-medium">{selectedTeacher.employmentType}</p>
                    </div>
                    {selectedTeacher.experience && (
                      <div>
                        <p className="text-sm text-gray-600">Pengalaman</p>
                        <p className="font-medium">{selectedTeacher.experience} tahun</p>
                      </div>
                    )}
                    {selectedTeacher.joinDate && (
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Bergabung</p>
                        <p className="font-medium">{formatDate(selectedTeacher.joinDate)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Education */}
                {(selectedTeacher.education || selectedTeacher.university || selectedTeacher.major) && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Pendidikan
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                      {selectedTeacher.education && (
                        <div>
                          <p className="text-sm text-gray-600">Jenjang</p>
                          <p className="font-medium">{selectedTeacher.education}</p>
                        </div>
                      )}
                      {selectedTeacher.university && (
                        <div>
                          <p className="text-sm text-gray-600">Universitas</p>
                          <p className="font-medium">{selectedTeacher.university}</p>
                        </div>
                      )}
                      {selectedTeacher.major && (
                        <div>
                          <p className="text-sm text-gray-600">Jurusan</p>
                          <p className="font-medium">{selectedTeacher.major}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Subjects */}
                {selectedTeacher.subjects && selectedTeacher.subjects.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <BookOpenCheck className="w-5 h-5" />
                      Mata Pelajaran
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {selectedTeacher.subjects.map((subject, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {selectedTeacher.certifications && selectedTeacher.certifications.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Sertifikasi
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="space-y-1">
                        {selectedTeacher.certifications.map((cert, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {selectedTeacher.achievements && selectedTeacher.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Prestasi
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="space-y-1">
                        {selectedTeacher.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Biography */}
                {selectedTeacher.bio && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Biografi</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{selectedTeacher.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setShowDetailModal(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

// Teachers Table Component
interface TeachersTableProps {
  teachers: Teacher[]
  onEdit: (teacher: Teacher) => void
  onDelete: (teacher: Teacher) => void
  onView: (teacher: Teacher) => void
}

function TeachersTable({ teachers, onEdit, onDelete, onView }: TeachersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIP
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jabatan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institusi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mata Pelajaran
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis
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
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada data pengajar
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {teacher.photo ? (
                        <img src={teacher.photo} alt={teacher.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                      {teacher.title && (
                        <p className="text-xs text-gray-500">{teacher.title}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {teacher.nip || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {teacher.position}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      teacher.institution === 'TK' ? 'bg-yellow-100 text-yellow-800' :
                      teacher.institution === 'SD' ? 'bg-green-100 text-green-800' :
                      teacher.institution === 'PONDOK' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {teacher.institution}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-32">
                      {teacher.subjects && teacher.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.slice(0, 2).map((subject, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {subject}
                            </span>
                          ))}
                          {teacher.subjects.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{teacher.subjects.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      teacher.isUstadz ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                    }`}>
                      {teacher.isUstadz ? 'Ustadz' : 'Ustadzah'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      teacher.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      teacher.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {teacher.status === 'ACTIVE' ? 'Aktif' :
                       teacher.status === 'INACTIVE' ? 'Tidak Aktif' : 'Cuti'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onView(teacher)}
                        className="h-8 w-8"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(teacher)}
                        className="h-8 w-8"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(teacher)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        title="Hapus"
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
  )
}