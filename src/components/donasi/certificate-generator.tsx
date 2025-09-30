'use client'

import { useState } from 'react'
import { CertificateData } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

interface CertificateGeneratorProps {
  certificateData: CertificateData
}

export function CertificateGenerator({ certificateData }: CertificateGeneratorProps) {
  const [generating, setGenerating] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const generateCertificatePDF = async () => {
    setGenerating(true)
    
    try {
      const response = await fetch('/api/donations/certificate/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(certificateData)
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `sertifikat-donasi-${certificateData.certificateNo}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Gagal membuat sertifikat')
      }
    } catch (error) {
      console.error('Error generating certificate:', error)
      alert('Terjadi kesalahan saat membuat sertifikat')
    } finally {
      setGenerating(false)
    }
  }

  const printCertificate = () => {
    const printContent = document.getElementById('certificate-preview')
    if (!printContent) return

    const originalContent = document.body.innerHTML
    document.body.innerHTML = printContent.innerHTML
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }

  const shareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: `Sertifikat Donasi - ${certificateData.donorName}`,
        text: `Alhamdulillah telah berdonasi ${formatCurrency(certificateData.amount)} untuk ${certificateData.campaignTitle || certificateData.categoryName}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link berhasil disalin!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div id="certificate-preview" className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">SERTIFIKAT DONASI</h1>
            <h2 className="text-lg text-green-600 font-semibold">Pondok Imam Syafi'i Blitar</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mt-4"></div>
          </div>

          {/* Content */}
          <div className="space-y-6 text-center">
            <div>
              <p className="text-gray-600 mb-2">Dengan ini menyatakan bahwa</p>
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-dashed border-gray-300 pb-2 inline-block px-4">
                {certificateData.donorName}
              </h3>
            </div>

            <div>
              <p className="text-gray-600 mb-2">Telah berdonasi sebesar</p>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(certificateData.amount)}
              </div>
              <p className="text-gray-600">({numberToWords(certificateData.amount)} rupiah)</p>
            </div>

            {certificateData.campaignTitle ? (
              <div>
                <p className="text-gray-600 mb-2">Untuk campaign</p>
                <p className="text-lg font-semibold text-gray-800">"{certificateData.campaignTitle}"</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Kategori</p>
                <p className="text-lg font-semibold text-gray-800">{certificateData.categoryName}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nomor Donasi</p>
                <p className="font-semibold text-gray-800">{certificateData.donationNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tanggal</p>
                <p className="font-semibold text-gray-800">{formatDate(certificateData.date)}</p>
              </div>
            </div>

            <div className="mt-8 pt-6">
              <p className="text-sm text-gray-600 italic">
                "Perumpamaan orang yang menginfakkan hartanya di jalan Allah adalah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada tiap tangkai ada seratus biji. Allah melipatgandakan bagi siapa yang Dia kehendaki."
              </p>
              <p className="text-sm text-gray-500 mt-2">(QS. Al-Baqarah: 261)</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Nomor Sertifikat</p>
                  <p className="font-mono text-sm text-gray-700">{certificateData.certificateNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-4">Blitar, {formatDate(certificateData.date)}</p>
                  <div className="w-24 h-16 border-b border-gray-400 mb-2"></div>
                  <p className="text-sm text-gray-700">Pengurus Pondok</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
              <div>
                <p className="font-semibold">Alamat:</p>
                <p>Jl. Raya Blitar No. 123<br />Blitar, Jawa Timur</p>
              </div>
              <div>
                <p className="font-semibold">Kontak:</p>
                <p>Telp: (0342) 123456<br />WA: 081234567890</p>
              </div>
              <div>
                <p className="font-semibold">Website:</p>
                <p>www.pondokimamsyafii.com<br />donasi@pondokimamsyafii.com</p>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <div className="text-6xl font-bold text-green-600 transform -rotate-45">
              BARAKALLAHU FIIK
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={generateCertificatePDF}
          disabled={generating}
          className="bg-green-600 hover:bg-green-700"
        >
          {generating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Membuat PDF...
            </div>
          ) : (
            <>
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>

        <Button
          onClick={printCertificate}
          variant="outline"
        >
          <PrinterIcon className="w-4 h-4 mr-2" />
          Print
        </Button>

        <Button
          onClick={shareCertificate}
          variant="outline"
        >
          <ShareIcon className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Additional Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium text-blue-900">Tentang Sertifikat Ini</h4>
            <p className="text-sm text-blue-700 mt-1">
              Sertifikat ini adalah bukti sah bahwa donasi Anda telah diterima dan diverifikasi oleh Pondok Imam Syafi'i Blitar. 
              Sertifikat dapat digunakan untuk keperluan administrasi dan pelaporan zakat/donasi Anda.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Helper function to convert number to words (simplified Indonesian)
function numberToWords(num: number): string {
  const ones = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']
  const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas']
  const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh']
  const thousands = ['', 'ribu', 'juta', 'miliar', 'triliun']

  if (num === 0) return 'nol'

  function convertHundreds(n: number): string {
    let result = ''

    if (n >= 100) {
      if (Math.floor(n / 100) === 1) {
        result += 'seratus '
      } else {
        result += ones[Math.floor(n / 100)] + ' ratus '
      }
      n %= 100
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)]
      if (n % 10 !== 0) {
        result += ' ' + ones[n % 10]
      }
    } else if (n >= 10) {
      result += teens[n - 10]
    } else if (n > 0) {
      result += ones[n]
    }

    return result.trim()
  }

  function convert(n: number): string {
    if (n === 0) return ''

    let result = ''
    let thousandCounter = 0

    while (n > 0) {
      if (n % 1000 !== 0) {
        const group = convertHundreds(n % 1000)
        if (thousandCounter === 1 && n % 1000 === 1) {
          result = 'seribu ' + result
        } else {
          result = group + (thousands[thousandCounter] ? ' ' + thousands[thousandCounter] + ' ' : ' ') + result
        }
      }
      n = Math.floor(n / 1000)
      thousandCounter++
    }

    return result.trim()
  }

  return convert(num)
}