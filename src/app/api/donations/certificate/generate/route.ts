import { NextRequest, NextResponse } from 'next/server'
import { CertificateData } from '@/types'

// This is a simplified implementation. In production, you would use a PDF generation library like puppeteer, jsPDF, or PDFKit
export async function POST(request: NextRequest) {
  try {
    const certificateData: CertificateData = await request.json()

    // Validate required fields
    if (!certificateData.donorName || !certificateData.amount || !certificateData.donationNo) {
      return NextResponse.json(
        { error: 'Data sertifikat tidak lengkap' },
        { status: 400 }
      )
    }

    // In a real implementation, you would generate a PDF here
    // For now, we'll return a simple HTML-based certificate that can be printed
    const htmlCertificate = generateCertificateHTML(certificateData)
    
    // Convert HTML to PDF (you would use a library like puppeteer here)
    // const pdfBuffer = await htmlToPdf(htmlCertificate)

    // For now, return the HTML content that can be printed
    return new NextResponse(htmlCertificate, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="sertifikat-donasi-${certificateData.certificateNo}.html"`
      }
    })
  } catch (error) {
    console.error('Error generating certificate:', error)
    return NextResponse.json(
      { error: 'Gagal membuat sertifikat' },
      { status: 500 }
    )
  }
}

function generateCertificateHTML(data: CertificateData): string {
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

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sertifikat Donasi - ${data.donorName}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            
            .certificate {
                background: white;
                max-width: 800px;
                padding: 3rem;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                position: relative;
                overflow: hidden;
            }
            
            .certificate::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 8px;
                background: linear-gradient(90deg, #059669, #3b82f6);
            }
            
            .header {
                text-align: center;
                margin-bottom: 3rem;
                position: relative;
            }
            
            .logo {
                width: 80px;
                height: 80px;
                background: #059669;
                border-radius: 50%;
                margin: 0 auto 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2rem;
            }
            
            .title {
                font-size: 2rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.5rem;
                letter-spacing: 2px;
            }
            
            .subtitle {
                font-size: 1.25rem;
                color: #059669;
                font-weight: 600;
                margin-bottom: 1rem;
            }
            
            .divider {
                width: 100px;
                height: 4px;
                background: #059669;
                margin: 0 auto;
            }
            
            .content {
                text-align: center;
                line-height: 2;
            }
            
            .content p {
                color: #6b7280;
                margin-bottom: 1rem;
            }
            
            .donor-name {
                font-size: 2rem;
                font-weight: 700;
                color: #1f2937;
                border-bottom: 2px dashed #d1d5db;
                display: inline-block;
                padding: 0.5rem 2rem;
                margin: 1rem 0;
            }
            
            .amount {
                font-size: 2.5rem;
                font-weight: 700;
                color: #059669;
                margin: 1rem 0;
            }
            
            .amount-words {
                color: #6b7280;
                font-style: italic;
                margin-bottom: 2rem;
            }
            
            .campaign-info {
                background: #f9fafb;
                padding: 1.5rem;
                border-radius: 8px;
                margin: 2rem 0;
            }
            
            .campaign-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1f2937;
            }
            
            .details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin: 2rem 0;
                padding: 2rem 0;
                border-top: 1px solid #e5e7eb;
            }
            
            .detail-item {
                text-align: center;
            }
            
            .detail-label {
                font-size: 0.875rem;
                color: #6b7280;
                margin-bottom: 0.5rem;
            }
            
            .detail-value {
                font-weight: 600;
                color: #1f2937;
            }
            
            .quote {
                background: #f0fdf4;
                padding: 2rem;
                border-radius: 8px;
                border-left: 4px solid #059669;
                margin: 2rem 0;
                font-style: italic;
                color: #374151;
                line-height: 1.6;
            }
            
            .quote-source {
                font-size: 0.875rem;
                color: #6b7280;
                margin-top: 1rem;
                text-align: right;
            }
            
            .signature-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-top: 3rem;
                padding-top: 2rem;
                border-top: 1px solid #e5e7eb;
            }
            
            .certificate-info {
                text-align: left;
            }
            
            .signature {
                text-align: right;
            }
            
            .signature-line {
                width: 200px;
                height: 1px;
                background: #d1d5db;
                margin: 3rem 0 0.5rem;
            }
            
            .footer {
                margin-top: 3rem;
                padding-top: 2rem;
                border-top: 1px solid #e5e7eb;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem;
                font-size: 0.875rem;
                color: #6b7280;
                text-align: center;
            }
            
            .footer-section h4 {
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 0.5rem;
            }
            
            .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 4rem;
                font-weight: 700;
                color: rgba(5, 150, 105, 0.05);
                pointer-events: none;
                user-select: none;
                z-index: 0;
            }
            
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                
                .certificate {
                    box-shadow: none;
                    max-width: none;
                    margin: 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="watermark">BARAKALLAHU FIIK</div>
            
            <div class="header">
                <div class="logo">🕌</div>
                <h1 class="title">SERTIFIKAT DONASI</h1>
                <h2 class="subtitle">Pondok Imam Syafi'i Blitar</h2>
                <div class="divider"></div>
            </div>
            
            <div class="content">
                <p>Dengan ini menyatakan bahwa</p>
                <div class="donor-name">${data.donorName}</div>
                
                <p>Telah berdonasi sebesar</p>
                <div class="amount">${formatCurrency(data.amount)}</div>
                <p class="amount-words">(${numberToWords(data.amount)} rupiah)</p>
                
                ${data.campaignTitle ? `
                    <div class="campaign-info">
                        <p>Untuk campaign</p>
                        <div class="campaign-title">"${data.campaignTitle}"</div>
                    </div>
                ` : `
                    <div class="campaign-info">
                        <p>Kategori</p>
                        <div class="campaign-title">${data.categoryName}</div>
                    </div>
                `}
                
                <div class="details">
                    <div class="detail-item">
                        <div class="detail-label">Nomor Donasi</div>
                        <div class="detail-value">${data.donationNo}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Tanggal</div>
                        <div class="detail-value">${formatDate(data.date)}</div>
                    </div>
                </div>
                
                <div class="quote">
                    "Perumpamaan orang yang menginfakkan hartanya di jalan Allah adalah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada tiap tangkai ada seratus biji. Allah melipatgandakan bagi siapa yang Dia kehendaki."
                    <div class="quote-source">(QS. Al-Baqarah: 261)</div>
                </div>
                
                <div class="signature-section">
                    <div class="certificate-info">
                        <div class="detail-label">Nomor Sertifikat</div>
                        <div class="detail-value" style="font-family: monospace;">${data.certificateNo}</div>
                    </div>
                    <div class="signature">
                        <p style="margin-bottom: 1rem;">Blitar, ${formatDate(data.date)}</p>
                        <div class="signature-line"></div>
                        <p>Pengurus Pondok</p>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-section">
                    <h4>Alamat</h4>
                    <p>Jl. Raya Blitar No. 123<br>Blitar, Jawa Timur</p>
                </div>
                <div class="footer-section">
                    <h4>Kontak</h4>
                    <p>Telp: (0342) 123456<br>WA: 081234567890</p>
                </div>
                <div class="footer-section">
                    <h4>Website</h4>
                    <p>www.pondokimamsyafii.com<br>donasi@pondokimamsyafii.com</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `
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