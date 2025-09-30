'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Registration {
  id: string
  registrationNo: string
  fullName: string
  nickname?: string
  gender: string
  birthPlace: string
  birthDate: string
  nik?: string
  nisn?: string
  address: string
  rt?: string
  rw?: string
  village: string
  district: string
  city: string
  province: string
  postalCode?: string
  level: string
  previousSchool?: string
  gradeTarget?: string
  programType?: string
  boardingType?: string
  fatherName: string
  fatherNik?: string
  fatherJob?: string
  fatherPhone?: string
  fatherEducation?: string
  fatherIncome?: string
  motherName: string
  motherNik?: string
  motherJob?: string
  motherPhone?: string
  motherEducation?: string
  motherIncome?: string
  guardianName?: string
  guardianRelation?: string
  guardianPhone?: string
  guardianAddress?: string
  phoneNumber: string
  whatsapp: string
  email?: string
  bloodType?: string
  height?: number
  weight?: number
  specialNeeds?: string
  medicalHistory?: string
  status: string
  paymentStatus: string
  documents: Array<{
    type: string
    fileName: string
    url: string
    status?: string
  }>
  testSchedule?: string
  testVenue?: string
  testScore?: {
    quran?: number
    arabic?: number
    interview?: number
    total?: number
  }
  testResult?: string
  ranking?: number
  registrationFee: number
  paymentMethod?: string
  paymentDate?: string
  paymentProof?: string
  notes?: string
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
  payments: Array<{
    id: string
    amount: number
    paymentType: string
    status: string
    method?: string
    proofUrl?: string
    createdAt: string
  }>
}

interface ActionLog {
  id: string
  action: string
  details: string
  performedBy: string
  performedAt: string
}

export default function PPDBDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const registrationId = params.id as string
  
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form states
  const [notes, setNotes] = useState('')
  const [testScore, setTestScore] = useState({
    quran: 0,
    arabic: 0,
    interview: 0
  })
  const [testSchedule, setTestSchedule] = useState('')
  const [testVenue, setTestVenue] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  // Check admin access
  useEffect(() => {
    if (session && session.user.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, router])

  // Load registration data
  useEffect(() => {
    if (registrationId) {
      loadRegistration()
    }
  }, [registrationId])

  const loadRegistration = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ppdb/admin/registrations/${registrationId}`)
      const data = await response.json()
      
      if (data.success) {
        setRegistration(data.data)
        setNotes(data.data.notes || '')
        if (data.data.testScore) {
          setTestScore(data.data.testScore)
        }
        if (data.data.testSchedule) {
          setTestSchedule(format(new Date(data.data.testSchedule), "yyyy-MM-dd'T'HH:mm"))
        }
        setTestVenue(data.data.testVenue || '')
        setRejectionReason(data.data.rejectionReason || '')
      }
    } catch (error) {
      console.error('Error loading registration:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string, additionalData?: any) => {
    try {
      setSaving(true)
      
      let endpoint = ''
      let body: any = { 
        registrationId, 
        action: newStatus,
        ...additionalData 
      }

      switch (newStatus) {
        case 'VERIFY':
        case 'REJECT':
          endpoint = '/api/ppdb/admin/verify'
          if (newStatus === 'REJECT') {
            body.reason = rejectionReason
          }
          break
        case 'SCHEDULE_TEST':
          endpoint = '/api/ppdb/admin/test-schedule'
          body.testSchedule = new Date(testSchedule)
          body.testVenue = testVenue
          break
        case 'INPUT_SCORE':
          endpoint = '/api/ppdb/admin/test-score'
          body.testScore = testScore
          break
        default:
          endpoint = '/api/ppdb/admin/status'
          body.status = newStatus
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()
      
      if (result.success) {
        loadRegistration() // Refresh data
      } else {
        console.error('Status change failed:', result.error)
        alert('Gagal mengubah status: ' + result.error)
      }
    } catch (error) {
      console.error('Error changing status:', error)
      alert('Terjadi kesalahan saat mengubah status')
    } finally {
      setSaving(false)
    }
  }

  const handleVerifyPayment = async () => {
    await handleStatusChange('VERIFY_PAYMENT')
  }

  const handleSaveNotes = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/ppdb/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registrationId,
          notes
        })
      })

      const result = await response.json()
      if (result.success) {
        loadRegistration()
      } else {
        alert('Gagal menyimpan catatan: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Terjadi kesalahan saat menyimpan catatan')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'secondary'
      case 'SUBMITTED': return 'warning'
      case 'DOCUMENT_CHECK': return 'info'
      case 'VERIFIED': return 'success'
      case 'TEST_SCHEDULED': return 'info'
      case 'TEST_TAKEN': return 'warning'
      case 'PASSED': return 'success'
      case 'FAILED': return 'danger'
      case 'REGISTERED': return 'success'
      default: return 'secondary'
    }
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
          <p className="text-gray-600 mb-4">Anda tidak memiliki akses ke halaman admin PPDB.</p>
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-500">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Data Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-4">Pendaftaran dengan ID tersebut tidak ditemukan.</p>
          <Link href="/ppdb-admin" className="text-primary-600 hover:text-primary-500">
            Kembali ke Admin PPDB
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/ppdb-admin"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Kembali
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detail Pendaftaran: {registration.fullName}
              </h1>
              <p className="text-gray-600">
                {registration.registrationNo} • {registration.level}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={getStatusBadgeVariant(registration.status)}>
              {registration.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Pribadi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <p className="text-sm text-gray-900">{registration.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Panggilan
                </label>
                <p className="text-sm text-gray-900">{registration.nickname || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin
                </label>
                <p className="text-sm text-gray-900">
                  {registration.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempat, Tanggal Lahir
                </label>
                <p className="text-sm text-gray-900">
                  {registration.birthPlace}, {format(new Date(registration.birthDate), 'dd MMMM yyyy', { locale: id })}
                  <span className="text-gray-500 ml-2">
                    ({calculateAge(registration.birthDate)} tahun)
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIK
                </label>
                <p className="text-sm text-gray-900">{registration.nik || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NISN
                </label>
                <p className="text-sm text-gray-900">{registration.nisn || '-'}</p>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alamat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <p className="text-sm text-gray-900">{registration.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RT/RW
                </label>
                <p className="text-sm text-gray-900">
                  {registration.rt}/{registration.rw}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desa/Kelurahan
                </label>
                <p className="text-sm text-gray-900">{registration.village}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kecamatan
                </label>
                <p className="text-sm text-gray-900">{registration.district}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kota/Kabupaten
                </label>
                <p className="text-sm text-gray-900">{registration.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provinsi
                </label>
                <p className="text-sm text-gray-900">{registration.province}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Pos
                </label>
                <p className="text-sm text-gray-900">{registration.postalCode || '-'}</p>
              </div>
            </div>
          </Card>

          {/* Education Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Pendidikan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenjang yang Dituju
                </label>
                <p className="text-sm text-gray-900">{registration.level}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kelas yang Dituju
                </label>
                <p className="text-sm text-gray-900">{registration.gradeTarget || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sekolah Sebelumnya
                </label>
                <p className="text-sm text-gray-900">{registration.previousSchool || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Program
                </label>
                <p className="text-sm text-gray-900">{registration.programType || '-'}</p>
              </div>
              {registration.level === 'PONDOK' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Mondok
                  </label>
                  <p className="text-sm text-gray-900">{registration.boardingType || '-'}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Parent Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Orang Tua</h2>
            
            {/* Father */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Data Ayah</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Ayah
                  </label>
                  <p className="text-sm text-gray-900">{registration.fatherName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK Ayah
                  </label>
                  <p className="text-sm text-gray-900">{registration.fatherNik || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan
                  </label>
                  <p className="text-sm text-gray-900">{registration.fatherJob || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Telepon
                  </label>
                  <p className="text-sm text-gray-900">{registration.fatherPhone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pendidikan
                  </label>
                  <p className="text-sm text-gray-900">{registration.fatherEducation || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Penghasilan
                  </label>
                  <p className="text-sm text-gray-900">{registration.fatherIncome || '-'}</p>
                </div>
              </div>
            </div>

            {/* Mother */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Data Ibu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Ibu
                  </label>
                  <p className="text-sm text-gray-900">{registration.motherName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK Ibu
                  </label>
                  <p className="text-sm text-gray-900">{registration.motherNik || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan
                  </label>
                  <p className="text-sm text-gray-900">{registration.motherJob || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Telepon
                  </label>
                  <p className="text-sm text-gray-900">{registration.motherPhone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pendidikan
                  </label>
                  <p className="text-sm text-gray-900">{registration.motherEducation || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Penghasilan
                  </label>
                  <p className="text-sm text-gray-900">{registration.motherIncome || '-'}</p>
                </div>
              </div>
            </div>

            {/* Guardian (if exists) */}
            {registration.guardianName && (
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Data Wali</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Wali
                    </label>
                    <p className="text-sm text-gray-900">{registration.guardianName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hubungan
                    </label>
                    <p className="text-sm text-gray-900">{registration.guardianRelation || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. Telepon
                    </label>
                    <p className="text-sm text-gray-900">{registration.guardianPhone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat
                    </label>
                    <p className="text-sm text-gray-900">{registration.guardianAddress || '-'}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kontak</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Telepon
                </label>
                <p className="text-sm text-gray-900">{registration.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <p className="text-sm text-gray-900">{registration.whatsapp}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">{registration.email || '-'}</p>
              </div>
            </div>
          </Card>

          {/* Health Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Kesehatan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Golongan Darah
                </label>
                <p className="text-sm text-gray-900">{registration.bloodType || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tinggi/Berat Badan
                </label>
                <p className="text-sm text-gray-900">
                  {registration.height ? `${registration.height} cm` : '-'} / 
                  {registration.weight ? ` ${registration.weight} kg` : ' -'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kebutuhan Khusus
                </label>
                <p className="text-sm text-gray-900">{registration.specialNeeds || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Riwayat Penyakit
                </label>
                <p className="text-sm text-gray-900">{registration.medicalHistory || '-'}</p>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dokumen</h2>
            {registration.documents && registration.documents.length > 0 ? (
              <div className="space-y-3">
                {registration.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                      <p className="text-xs text-gray-500">{doc.fileName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.status && (
                        <Badge variant={doc.status === 'VERIFIED' ? 'success' : 'warning'}>
                          {doc.status}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        Lihat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Belum ada dokumen yang diupload.</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Status</h3>
            
            {registration.status === 'SUBMITTED' && (
              <div className="space-y-3">
                <Button
                  onClick={() => handleStatusChange('VERIFY')}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Verifikasi Dokumen
                </Button>
                
                <div>
                  <Input
                    placeholder="Alasan penolakan"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    onClick={() => handleStatusChange('REJECT')}
                    disabled={saving || !rejectionReason}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Tolak Dokumen
                  </Button>
                </div>
              </div>
            )}

            {registration.status === 'VERIFIED' && (
              <div className="space-y-3">
                <div>
                  <Input
                    type="datetime-local"
                    value={testSchedule}
                    onChange={(e) => setTestSchedule(e.target.value)}
                    className="mb-2"
                  />
                  <Input
                    placeholder="Tempat tes"
                    value={testVenue}
                    onChange={(e) => setTestVenue(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    onClick={() => handleStatusChange('SCHEDULE_TEST')}
                    disabled={saving || !testSchedule || !testVenue}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Jadwalkan Tes
                  </Button>
                </div>
              </div>
            )}

            {registration.status === 'TEST_TAKEN' && (
              <div className="space-y-3">
                <div>
                  <Input
                    type="number"
                    placeholder="Nilai Quran"
                    value={testScore.quran}
                    onChange={(e) => setTestScore({...testScore, quran: parseInt(e.target.value) || 0})}
                    className="mb-2"
                  />
                  <Input
                    type="number"
                    placeholder="Nilai Bahasa Arab"
                    value={testScore.arabic}
                    onChange={(e) => setTestScore({...testScore, arabic: parseInt(e.target.value) || 0})}
                    className="mb-2"
                  />
                  <Input
                    type="number"
                    placeholder="Nilai Wawancara"
                    value={testScore.interview}
                    onChange={(e) => setTestScore({...testScore, interview: parseInt(e.target.value) || 0})}
                    className="mb-2"
                  />
                  <Button
                    onClick={() => handleStatusChange('INPUT_SCORE')}
                    disabled={saving}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Input Nilai
                  </Button>
                </div>
              </div>
            )}

            {registration.paymentStatus === 'PAID' && (
              <Button
                onClick={handleVerifyPayment}
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Verifikasi Pembayaran
              </Button>
            )}
          </Card>

          {/* Payment Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pembayaran</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biaya Pendaftaran
                </label>
                <p className="text-sm text-gray-900">
                  {formatCurrency(Number(registration.registrationFee))}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Pembayaran
                </label>
                <Badge variant={
                  registration.paymentStatus === 'VERIFIED' ? 'success' :
                  registration.paymentStatus === 'PAID' ? 'warning' : 'danger'
                }>
                  {registration.paymentStatus}
                </Badge>
              </div>

              {registration.paymentProof && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bukti Transfer
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(registration.paymentProof, '_blank')}
                    className="w-full"
                  >
                    Lihat Bukti
                  </Button>
                </div>
              )}

              {registration.payments && registration.payments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Riwayat Pembayaran
                  </label>
                  <div className="space-y-2">
                    {registration.payments.map((payment, index) => (
                      <div key={payment.id} className="text-xs bg-gray-50 p-2 rounded">
                        <div className="flex justify-between">
                          <span>{payment.paymentType}</span>
                          <Badge variant={payment.status === 'SUCCESS' ? 'success' : 'warning'}>
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="text-gray-600">
                          {formatCurrency(Number(payment.amount))} • {format(new Date(payment.createdAt), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Test Information */}
          {(registration.testSchedule || registration.testScore) && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Tes</h3>
              
              <div className="space-y-3">
                {registration.testSchedule && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jadwal Tes
                    </label>
                    <p className="text-sm text-gray-900">
                      {format(new Date(registration.testSchedule), 'dd MMMM yyyy, HH:mm', { locale: id })}
                    </p>
                  </div>
                )}

                {registration.testVenue && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tempat Tes
                    </label>
                    <p className="text-sm text-gray-900">{registration.testVenue}</p>
                  </div>
                )}

                {registration.testScore && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nilai Tes
                    </label>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Quran:</span>
                        <span className="font-medium">{registration.testScore.quran}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bahasa Arab:</span>
                        <span className="font-medium">{registration.testScore.arabic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wawancara:</span>
                        <span className="font-medium">{registration.testScore.interview}</span>
                      </div>
                      {registration.testScore.total && (
                        <div className="flex justify-between font-semibold border-t pt-1">
                          <span>Total:</span>
                          <span>{registration.testScore.total}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {registration.testResult && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hasil Tes
                    </label>
                    <Badge variant={registration.testResult === 'PASSED' ? 'success' : 'danger'}>
                      {registration.testResult}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Catatan Admin</h3>
            
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={saving}
                size="sm"
                className="w-full"
              >
                Simpan Catatan
              </Button>
            </div>

            {registration.rejectionReason && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800">Alasan Penolakan:</p>
                <p className="text-sm text-red-700">{registration.rejectionReason}</p>
              </div>
            )}
          </Card>

          {/* Timeline */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dibuat:</span>
                <span>{format(new Date(registration.createdAt), 'dd/MM/yyyy HH:mm')}</span>
              </div>
              
              {registration.verifiedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Diverifikasi:</span>
                  <span>{format(new Date(registration.verifiedAt), 'dd/MM/yyyy HH:mm')}</span>
                </div>
              )}
              
              {registration.paymentDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Pembayaran:</span>
                  <span>{format(new Date(registration.paymentDate), 'dd/MM/yyyy HH:mm')}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}