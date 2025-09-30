export interface NotificationTemplate {
  subject: string;
  text: string;
  html: string;
}

interface NotificationData {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  recipientName: string;
}

export function createNotificationEmail(data: NotificationData): NotificationTemplate {
  const subject = data.title;
  
  const text = `
Assalamu'alaikum ${data.recipientName},

${data.message}

${data.actionUrl ? `Untuk detail lebih lanjut, silakan kunjungi: ${data.actionUrl}` : ''}

Barakallahu fiikum,
Tim Pondok Pesantren Imam Syafi'i
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .header {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      color: white;
      padding: 30px 20px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header .subtitle {
      margin: 5px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      background: white;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .message {
      background: #f8fafc;
      border-left: 4px solid #10B981;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 5px 5px 0;
    }
    .action-button {
      display: inline-block;
      background: #10B981;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.3s;
    }
    .action-button:hover {
      background: #059669;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 10px 10px;
      color: #6b7280;
      font-size: 14px;
    }
    .islamic-greeting {
      color: #10B981;
      font-weight: 600;
      margin-bottom: 15px;
    }
    .signature {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
    }
    .logo {
      width: 50px;
      height: 50px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      font-size: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🕌</div>
      <h1>Pondok Pesantren Imam Syafi'i</h1>
      <div class="subtitle">Notification System</div>
    </div>
    
    <div class="content">
      <div class="islamic-greeting">Assalamu'alaikum Warahmatullahi Wabarakatuh</div>
      <p>Yth. ${data.recipientName},</p>
      
      <div class="message">
        <strong>${data.title}</strong><br>
        ${data.message}
      </div>
      
      ${data.actionUrl ? `
        <div style="text-align: center;">
          <a href="${data.actionUrl}" class="action-button">${data.actionText || 'Lihat Detail'}</a>
        </div>
      ` : ''}
      
      <div class="signature">
        <p>Barakallahu fiikum,<br>
        <strong>Tim Administrasi<br>
        Pondok Pesantren Imam Syafi'i</strong></p>
        
        <p><small>
          Email ini dikirim secara otomatis. Jika Anda memiliki pertanyaan, 
          silakan hubungi kami melalui WhatsApp atau datang langsung ke kantor administrasi.
        </small></p>
      </div>
    </div>
    
    <div class="footer">
      <p>Pondok Pesantren Imam Syafi'i<br>
      Jalan Pendidikan Islam No. 123, Kota Pembelajaran<br>
      WhatsApp: +62 812-3456-7890 | Email: admin@ponpesimamsyafii.id</p>
      
      <p><small>Untuk mengubah preferensi notifikasi, silakan login ke portal orang tua Anda.</small></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}

// Grade update notification template
export function createGradeUpdateEmail(data: {
  studentName: string;
  subject: string;
  grade: string;
  semester: string;
  teacherName: string;
  recipientName: string;
  actionUrl?: string;
}): NotificationTemplate {
  return createNotificationEmail({
    title: `Update Nilai ${data.subject} - ${data.studentName}`,
    message: `Nilai ${data.subject} untuk ${data.studentName} telah diperbarui. 
              Nilai yang diperoleh: ${data.grade} untuk semester ${data.semester}. 
              Guru pengampu: ${data.teacherName}.`,
    recipientName: data.recipientName,
    actionUrl: data.actionUrl,
    actionText: 'Lihat Rapor Lengkap',
  });
}

// Payment reminder template
export function createPaymentReminderEmail(data: {
  studentName: string;
  billType: string;
  amount: number;
  dueDate: string;
  recipientName: string;
  actionUrl?: string;
}): NotificationTemplate {
  return createNotificationEmail({
    title: `Pengingat Pembayaran ${data.billType} - ${data.studentName}`,
    message: `Terdapat tagihan ${data.billType} untuk ${data.studentName} sebesar Rp ${data.amount.toLocaleString('id-ID')} 
              yang jatuh tempo pada ${data.dueDate}. Mohon segera melakukan pembayaran untuk menghindari denda keterlambatan.`,
    recipientName: data.recipientName,
    actionUrl: data.actionUrl,
    actionText: 'Bayar Sekarang',
  });
}

// Attendance alert template
export function createAttendanceAlertEmail(data: {
  studentName: string;
  date: string;
  status: string;
  recipientName: string;
  actionUrl?: string;
}): NotificationTemplate {
  const statusText = {
    ALPHA: 'tidak hadir tanpa keterangan',
    SAKIT: 'tidak hadir karena sakit',
    IZIN: 'tidak hadir dengan izin',
    TERLAMBAT: 'terlambat',
  }[data.status] || 'tidak hadir';

  return createNotificationEmail({
    title: `Informasi Kehadiran ${data.studentName}`,
    message: `${data.studentName} ${statusText} pada tanggal ${data.date}. 
              Mohon perhatikan kehadiran putra/putri Anda di sekolah.`,
    recipientName: data.recipientName,
    actionUrl: data.actionUrl,
    actionText: 'Lihat Kehadiran',
  });
}

// Hafalan progress template
export function createHafalanProgressEmail(data: {
  studentName: string;
  surahName: string;
  progress: string;
  teacherName: string;
  recipientName: string;
  actionUrl?: string;
}): NotificationTemplate {
  return createNotificationEmail({
    title: `Progress Hafalan ${data.studentName}`,
    message: `Alhamdulillah, ${data.studentName} telah menyelesaikan hafalan ${data.surahName} 
              dengan ${data.progress}. Ustadz/Ustadzah ${data.teacherName} memberikan penilaian dan catatan khusus.`,
    recipientName: data.recipientName,
    actionUrl: data.actionUrl,
    actionText: 'Lihat Detail Progress',
  });
}

// Achievement notification template
export function createAchievementEmail(data: {
  studentName: string;
  achievementTitle: string;
  achievementDescription: string;
  recipientName: string;
  actionUrl?: string;
}): NotificationTemplate {
  return createNotificationEmail({
    title: `🎉 Prestasi Baru ${data.studentName}`,
    message: `Alhamdulillah, ${data.studentName} telah meraih prestasi "${data.achievementTitle}". 
              ${data.achievementDescription} Semoga menjadi motivasi untuk terus berprestasi.`,
    recipientName: data.recipientName,
    actionUrl: data.actionUrl,
    actionText: 'Lihat Prestasi',
  });
}

// Appointment reminder template
export function createAppointmentReminderEmail(data: {
  appointmentType: string;
  date: string;
  time: string;
  location: string;
  recipientName: string;
  notes?: string;
  actionUrl?: string;
}): NotificationTemplate {
  return createNotificationEmail({
    title: `Pengingat ${data.appointmentType}`,
    message: `Anda memiliki jadwal ${data.appointmentType} pada ${data.date} pukul ${data.time} 
              di ${data.location}. ${data.notes ? 'Catatan: ' + data.notes : ''} 
              Mohon hadir tepat waktu.`,
    recipientName: data.recipientName,
    actionUrl: data.actionUrl,
    actionText: 'Konfirmasi Kehadiran',
  });
}