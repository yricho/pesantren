export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const createRegistrationConfirmationEmail = (data: {
  fullName: string;
  registrationNo: string;
  level: string;
  registrationFee: number;
}): EmailTemplate => ({
  subject: `Konfirmasi Pendaftaran PPDB - ${data.registrationNo}`,
  html: `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Konfirmasi Pendaftaran PPDB</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; }
            .highlight { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .info-table td:first-child { font-weight: bold; color: #374151; width: 40%; }
            .payment-info { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #6b7280; font-size: 14px; }
            .btn { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Pendaftaran Berhasil!</h1>
                <p>Pondok Pesantren Imam Syafi'i Blitar</p>
            </div>
            
            <div class="content">
                <p>Assalamualaikum Wr. Wb.</p>
                
                <p>Alhamdulillah, pendaftaran PPDB atas nama <strong>${data.fullName}</strong> telah berhasil diterima oleh sistem kami.</p>
                
                <div class="highlight">
                    <h3>📋 Detail Pendaftaran</h3>
                    <table class="info-table">
                        <tr>
                            <td>Nomor Pendaftaran:</td>
                            <td><strong>${data.registrationNo}</strong></td>
                        </tr>
                        <tr>
                            <td>Nama Lengkap:</td>
                            <td>${data.fullName}</td>
                        </tr>
                        <tr>
                            <td>Jenjang:</td>
                            <td>${data.level}</td>
                        </tr>
                        <tr>
                            <td>Tanggal Daftar:</td>
                            <td>${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="payment-info">
                    <h3>💳 Informasi Pembayaran</h3>
                    <p><strong>Biaya Pendaftaran: Rp ${data.registrationFee.toLocaleString('id-ID')}</strong></p>
                    <p>Silakan lakukan pembayaran dalam waktu <strong>2x24 jam</strong> untuk mengaktifkan pendaftaran Anda.</p>
                    
                    <h4>Metode Pembayaran:</h4>
                    <ul>
                        <li><strong>Bank BRI:</strong> 1234-5678-9012-3456</li>
                        <li><strong>Bank Mandiri:</strong> 987-6543-210987</li>
                        <li><strong>Bank BCA:</strong> 234-567-8901</li>
                    </ul>
                    <p><em>a.n. Yayasan Imam Syafi'i</em></p>
                    
                    <p><strong>⚠️ Penting:</strong></p>
                    <ul>
                        <li>Cantumkan nomor pendaftaran <strong>${data.registrationNo}</strong> dalam berita transfer</li>
                        <li>Kirim bukti transfer ke WhatsApp: <strong>0812-3456-7890</strong></li>
                        <li>Format pesan: "Nama: ${data.fullName}, No. Pendaftaran: ${data.registrationNo}, Bank: [Nama Bank], Jumlah: Rp ${data.registrationFee.toLocaleString('id-ID')}"</li>
                    </ul>
                </div>
                
                <h3>📝 Langkah Selanjutnya:</h3>
                <ol>
                    <li>Lakukan pembayaran sesuai instruksi di atas</li>
                    <li>Kirim bukti transfer via WhatsApp</li>
                    <li>Tunggu verifikasi dari tim kami (1x24 jam)</li>
                    <li>Dapatkan jadwal tes masuk</li>
                    <li>Ikuti tes sesuai jadwal yang ditentukan</li>
                </ol>
                
                <p>Jika ada pertanyaan, silakan hubungi kami:</p>
                <ul>
                    <li>📞 Telepon: 0342-123456</li>
                    <li>📱 WhatsApp: 0812-3456-7890</li>
                    <li>✉️ Email: ppdb@ponpesimamsyafii.id</li>
                </ul>
                
                <p>Barakallahu fiikum wa fi awladikum. Semoga anak Anda menjadi generasi yang sholeh dan cerdas.</p>
                
                <p>Wassalamualaikum Wr. Wb.</p>
            </div>
            
            <div class="footer">
                <p>Pondok Pesantren Imam Syafi'i Blitar</p>
                <p>Jl. Imam Syafi'i No. 123, Blitar, Jawa Timur 66111</p>
                <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
            </div>
        </div>
    </body>
    </html>
  `,
  text: `
Assalamualaikum Wr. Wb.

Alhamdulillah, pendaftaran PPDB atas nama ${data.fullName} telah berhasil diterima.

DETAIL PENDAFTARAN:
- Nomor Pendaftaran: ${data.registrationNo}
- Nama Lengkap: ${data.fullName}
- Jenjang: ${data.level}
- Tanggal Daftar: ${new Date().toLocaleDateString('id-ID')}

INFORMASI PEMBAYARAN:
Biaya Pendaftaran: Rp ${data.registrationFee.toLocaleString('id-ID')}

Silakan lakukan pembayaran dalam waktu 2x24 jam ke:
- Bank BRI: 1234-5678-9012-3456
- Bank Mandiri: 987-6543-210987
- Bank BCA: 234-567-8901
a.n. Yayasan Imam Syafi'i

PENTING:
- Cantumkan nomor pendaftaran ${data.registrationNo} dalam berita transfer
- Kirim bukti transfer ke WhatsApp: 0812-3456-7890

KONTAK:
- Telepon: 0342-123456
- WhatsApp: 0812-3456-7890
- Email: ppdb@ponpesimamsyafii.id

Wassalamualaikum Wr. Wb.

Pondok Pesantren Imam Syafi'i Blitar
  `
});

export const createStatusUpdateEmail = (data: {
  fullName: string;
  registrationNo: string;
  status: string;
  statusDescription: string;
  message?: string;
  testSchedule?: string;
  testVenue?: string;
  testResult?: string;
}): EmailTemplate => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return '✅';
      case 'TEST_SCHEDULED': return '📅';
      case 'PASSED': return '🎉';
      case 'FAILED': return '😔';
      case 'REJECTED': return '❌';
      default: return '📢';
    }
  };

  return {
    subject: `Update Status Pendaftaran - ${data.registrationNo}`,
    html: `
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Update Status Pendaftaran</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { padding: 30px; }
              .status-update { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; text-align: center; }
              .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
              .info-table td:first-child { font-weight: bold; color: #374151; width: 40%; }
              .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #6b7280; font-size: 14px; }
              .success { background-color: #f0fdf4; border-color: #10b981; }
              .warning { background-color: #fffbeb; border-color: #f59e0b; }
              .error { background-color: #fef2f2; border-color: #ef4444; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${getStatusIcon(data.status)} Update Status</h1>
                  <p>Pondok Pesantren Imam Syafi'i Blitar</p>
              </div>
              
              <div class="content">
                  <p>Assalamualaikum Wr. Wb.</p>
                  
                  <p>Kami ingin menginformasikan update status pendaftaran PPDB atas nama <strong>${data.fullName}</strong>.</p>
                  
                  <div class="status-update ${
                    data.status === 'PASSED' ? 'success' : 
                    data.status === 'FAILED' || data.status === 'REJECTED' ? 'error' : 
                    'warning'
                  }">
                      <h2>${getStatusIcon(data.status)} ${data.statusDescription}</h2>
                      <p><strong>Nomor Pendaftaran: ${data.registrationNo}</strong></p>
                  </div>
                  
                  ${data.message ? `<p><strong>Pesan:</strong> ${data.message}</p>` : ''}
                  
                  ${data.testSchedule && data.testVenue ? `
                  <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                      <h3>📅 Jadwal Tes</h3>
                      <table class="info-table">
                          <tr>
                              <td>Tanggal & Waktu:</td>
                              <td>${new Date(data.testSchedule).toLocaleString('id-ID', { 
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                              })}</td>
                          </tr>
                          <tr>
                              <td>Lokasi:</td>
                              <td>${data.testVenue}</td>
                          </tr>
                      </table>
                      <p><strong>⚠️ Harap datang 15 menit sebelum waktu tes dimulai.</strong></p>
                  </div>
                  ` : ''}
                  
                  ${data.testResult === 'PASSED' ? `
                  <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                      <h3>🎉 Selamat!</h3>
                      <p>Alhamdulillah, anak Anda <strong>LULUS</strong> seleksi PPDB Pondok Pesantren Imam Syafi'i Blitar!</p>
                      <p><strong>Langkah selanjutnya:</strong></p>
                      <ol>
                          <li>Lakukan daftar ulang dalam waktu 7 hari</li>
                          <li>Siapkan dokumen yang diperlukan</li>
                          <li>Hubungi kami untuk informasi lebih lanjut</li>
                      </ol>
                  </div>
                  ` : data.testResult === 'FAILED' ? `
                  <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                      <h3>😔 Maaf</h3>
                      <p>Mohon maaf, kali ini anak Anda belum berhasil lolos seleksi PPDB kami.</p>
                      <p>Kami mengapresiasi partisipasi Anda dan semoga di kesempatan selanjutnya bisa bergabung dengan kami.</p>
                      <p>Tetap semangat dan jangan menyerah. Barakallahu fiikum.</p>
                  </div>
                  ` : ''}
                  
                  <p>Jika ada pertanyaan atau membutuhkan bantuan, silakan hubungi kami:</p>
                  <ul>
                      <li>📞 Telepon: 0342-123456</li>
                      <li>📱 WhatsApp: 0812-3456-7890</li>
                      <li>✉️ Email: ppdb@ponpesimamsyafii.id</li>
                  </ul>
                  
                  <p>Barakallahu fiikum wa fi awladikum.</p>
                  
                  <p>Wassalamualaikum Wr. Wb.</p>
              </div>
              
              <div class="footer">
                  <p>Pondok Pesantren Imam Syafi'i Blitar</p>
                  <p>Jl. Imam Syafi'i No. 123, Blitar, Jawa Timur 66111</p>
                  <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
              </div>
          </div>
      </body>
      </html>
    `,
    text: `
Assalamualaikum Wr. Wb.

Update Status Pendaftaran PPDB

Nama: ${data.fullName}
Nomor Pendaftaran: ${data.registrationNo}
Status: ${data.statusDescription}

${data.message ? `Pesan: ${data.message}` : ''}

${data.testSchedule && data.testVenue ? `
JADWAL TES:
Tanggal & Waktu: ${new Date(data.testSchedule).toLocaleString('id-ID')}
Lokasi: ${data.testVenue}

Harap datang 15 menit sebelum waktu tes dimulai.
` : ''}

${data.testResult === 'PASSED' ? `
SELAMAT! Anak Anda LULUS seleksi PPDB!
Silakan lakukan daftar ulang dalam waktu 7 hari.
` : data.testResult === 'FAILED' ? `
Mohon maaf, kali ini anak Anda belum berhasil lolos seleksi.
Tetap semangat dan jangan menyerah!
` : ''}

KONTAK:
- Telepon: 0342-123456
- WhatsApp: 0812-3456-7890
- Email: ppdb@ponpesimamsyafii.id

Wassalamualaikum Wr. Wb.
Pondok Pesantren Imam Syafi'i Blitar
    `
  };
};