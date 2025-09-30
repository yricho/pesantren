'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Save, Loader2 } from 'lucide-react'

interface Alumni {
  id: string
  nisn?: string | null
  nis?: string | null
  fullName: string
  nickname?: string | null
  birthPlace: string
  birthDate: Date
  gender: string
  currentAddress: string
  currentCity: string
  currentProvince?: string | null
  currentCountry: string
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  facebook?: string | null
  instagram?: string | null
  linkedin?: string | null
  institutionType: string
  graduationYear: string
  generation?: string | null
  currentJob?: string | null
  jobPosition?: string | null
  company?: string | null
  furtherEducation?: string | null
  university?: string | null
  major?: string | null
  maritalStatus?: string | null
  spouseName?: string | null
  childrenCount: number
  photo?: string | null
  memories?: string | null
  message?: string | null
  availableForEvents: boolean
}

interface AlumniEditFormProps {
  alumni: Alumni
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

export function AlumniEditForm({ alumni, isOpen, onClose, onSubmit }: AlumniEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nisn: alumni.nisn || '',
    nis: alumni.nis || '',
    fullName: alumni.fullName,
    nickname: alumni.nickname || '',
    birthPlace: alumni.birthPlace,
    birthDate: new Date(alumni.birthDate).toISOString().split('T')[0],
    gender: alumni.gender,
    bloodType: '',
    currentAddress: alumni.currentAddress,
    currentCity: alumni.currentCity,
    currentProvince: alumni.currentProvince || '',
    currentCountry: alumni.currentCountry,
    phone: alumni.phone || '',
    whatsapp: alumni.whatsapp || '',
    email: alumni.email || '',
    facebook: alumni.facebook || '',
    instagram: alumni.instagram || '',
    linkedin: alumni.linkedin || '',
    fatherName: '',
    motherName: '',
    institutionType: alumni.institutionType,
    graduationYear: alumni.graduationYear,
    generation: alumni.generation || '',
    currentJob: alumni.currentJob || '',
    jobPosition: alumni.jobPosition || '',
    company: alumni.company || '',
    furtherEducation: alumni.furtherEducation || '',
    university: alumni.university || '',
    major: alumni.major || '',
    maritalStatus: alumni.maritalStatus || '',
    spouseName: alumni.spouseName || '',
    childrenCount: alumni.childrenCount,
    notes: '',
    photo: alumni.photo || '',
    memories: alumni.memories || '',
    message: alumni.message || '',
    availableForEvents: alumni.availableForEvents
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.birthPlace || !formData.currentAddress || !formData.currentCity || !formData.graduationYear) {
      setError('Mohon lengkapi semua field yang wajib')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Slide-out Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white shadow-xl z-50 transform transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Data Alumni</h2>
              <p className="text-sm text-gray-600">{alumni.fullName}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={loading}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Informasi Dasar</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    NISN
                  </label>
                  <Input
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Nomor Induk Siswa Nasional"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    NIS
                  </label>
                  <Input
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Nomor Induk Siswa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Lengkap *
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nama lengkap alumni"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Panggilan
                  </label>
                  <Input
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Nama panggilan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tempat Lahir *
                  </label>
                  <Input
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    placeholder="Tempat lahir"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tanggal Lahir *
                  </label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="MALE">Laki-laki</option>
                    <option value="FEMALE">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Institusi Alumni
                  </label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="TK">TK</option>
                    <option value="SD">SD</option>
                    <option value="PONDOK">PONDOK</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Current Address */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Alamat Saat Ini</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Alamat *
                  </label>
                  <textarea
                    value={formData.currentAddress}
                    onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Alamat lengkap saat ini"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kota *
                  </label>
                  <Input
                    value={formData.currentCity}
                    onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                    placeholder="Kota saat ini"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Provinsi
                  </label>
                  <Input
                    value={formData.currentProvince}
                    onChange={(e) => setFormData({ ...formData, currentProvince: e.target.value })}
                    placeholder="Provinsi saat ini"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Negara
                  </label>
                  <Input
                    value={formData.currentCountry}
                    onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                    placeholder="Negara saat ini"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Informasi Kontak</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nomor Telepon
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Nomor telepon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    WhatsApp
                  </label>
                  <Input
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="Nomor WhatsApp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Alamat email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Facebook
                  </label>
                  <Input
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="URL Facebook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Instagram
                  </label>
                  <Input
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="Username Instagram"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    LinkedIn
                  </label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="URL LinkedIn"
                  />
                </div>
              </div>
            </div>

            {/* Academic & Career */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Informasi Akademik & Karir</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tahun Lulus *
                  </label>
                  <Input
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    placeholder="Tahun kelulusan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Angkatan
                  </label>
                  <Input
                    value={formData.generation}
                    onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
                    placeholder="Angkatan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pekerjaan Saat Ini
                  </label>
                  <Input
                    value={formData.currentJob}
                    onChange={(e) => setFormData({ ...formData, currentJob: e.target.value })}
                    placeholder="Pekerjaan saat ini"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Posisi Jabatan
                  </label>
                  <Input
                    value={formData.jobPosition}
                    onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
                    placeholder="Posisi atau jabatan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Perusahaan
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nama perusahaan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pendidikan Lanjutan
                  </label>
                  <Input
                    value={formData.furtherEducation}
                    onChange={(e) => setFormData({ ...formData, furtherEducation: e.target.value })}
                    placeholder="Jenjang pendidikan lanjutan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Universitas
                  </label>
                  <Input
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="Nama universitas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Jurusan
                  </label>
                  <Input
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    placeholder="Jurusan atau bidang studi"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Informasi Personal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status Pernikahan
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Pilih status</option>
                    <option value="SINGLE">Belum Menikah</option>
                    <option value="MARRIED">Menikah</option>
                    <option value="DIVORCED">Cerai</option>
                    <option value="WIDOW">Janda/Duda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Pasangan
                  </label>
                  <Input
                    value={formData.spouseName}
                    onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                    placeholder="Nama suami/istri"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Jumlah Anak
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.childrenCount}
                    onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                    placeholder="Jumlah anak"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kenangan di Sekolah
                  </label>
                  <textarea
                    value={formData.memories}
                    onChange={(e) => setFormData({ ...formData, memories: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Ceritakan kenangan indah selama di sekolah..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pesan untuk Juniors
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Pesan dan motivasi untuk adik-adik kelas..."
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableForEvents}
                      onChange={(e) => setFormData({ ...formData, availableForEvents: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Bersedia diundang untuk acara sekolah</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="sticky bottom-0 bg-white border-t pt-4 mt-6 -mx-6 px-6">
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1"
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}