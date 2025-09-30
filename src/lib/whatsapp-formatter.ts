// Utility functions for formatting content for WhatsApp sharing

export interface ActivityShareData {
  title: string;
  description: string;
  date: string;
  location?: string;
  category?: string;
  link?: string;
}

export interface VideoShareData {
  title: string;
  description: string;
  speaker?: string;
  duration?: string;
  date?: string;
  link?: string;
}

export interface DonationShareData {
  campaignName: string;
  description: string;
  targetAmount?: number;
  collectedAmount?: number;
  percentage?: number;
  accountNumber?: string;
  accountName?: string;
  link?: string;
}

export interface DocumentShareData {
  title: string;
  description?: string;
  author?: string;
  category?: string;
  link?: string;
}

// Format date to Indonesian format
export const formatDateIndonesian = (date: string | Date): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return d.toLocaleDateString('id-ID', options);
};

// Format currency to Indonesian Rupiah
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format activity for WhatsApp
export const formatActivityForWhatsApp = (data: ActivityShareData): string => {
  const lines = [
    `*🌟 ${data.title.toUpperCase()} 🌟*`,
    '',
    `📝 *Deskripsi:*`,
    data.description,
    '',
    `📅 *Tanggal:* ${formatDateIndonesian(data.date)}`,
  ];

  if (data.location) {
    lines.push(`📍 *Lokasi:* ${data.location}`);
  }

  if (data.category) {
    lines.push(`🏷️ *Kategori:* ${data.category}`);
  }

  lines.push(
    '',
    `━━━━━━━━━━━━━━━`,
    `🏫 *Pondok Pesantren Imam Syafi'i Blitar*`,
    `📱 Hubungi: 0812-3456-7890`,
    `🌐 Website: ${data.link || 'https://pondokimamsyafii.sch.id'}`
  );

  return lines.join('\n');
};

// Format video/kajian for WhatsApp
export const formatVideoForWhatsApp = (data: VideoShareData): string => {
  const lines = [
    `*🎥 KAJIAN: ${data.title.toUpperCase()} 🎥*`,
    '',
    `📖 *Tema:*`,
    data.description,
    ''
  ];

  if (data.speaker) {
    lines.push(`👤 *Pemateri:* ${data.speaker}`);
  }

  if (data.date) {
    lines.push(`📅 *Tanggal:* ${formatDateIndonesian(data.date)}`);
  }

  if (data.duration) {
    lines.push(`⏱️ *Durasi:* ${data.duration}`);
  }

  lines.push(
    '',
    `🔗 *Link Video:* ${data.link || 'Klik di website kami'}`,
    '',
    `━━━━━━━━━━━━━━━`,
    `✨ _Mari tingkatkan ilmu agama kita bersama_`,
    '',
    `🏫 *Pondok Pesantren Imam Syafi'i Blitar*`,
    `📱 Info: 0812-3456-7890`,
    `🌐 www.pondokimamsyafii.sch.id`
  );

  return lines.join('\n');
};

// Format donation campaign for WhatsApp
export const formatDonationForWhatsApp = (data: DonationShareData): string => {
  const lines = [
    `*🤲 AJAKAN BERDONASI 🤲*`,
    '',
    `*${data.campaignName.toUpperCase()}*`,
    '',
    `📋 *Keterangan:*`,
    data.description,
    ''
  ];

  if (data.targetAmount) {
    lines.push(`💰 *Target:* ${formatRupiah(data.targetAmount)}`);
  }

  if (data.collectedAmount && data.percentage) {
    lines.push(
      `📊 *Terkumpul:* ${formatRupiah(data.collectedAmount)} (${data.percentage}%)`,
      ''
    );
  }

  if (data.accountNumber && data.accountName) {
    lines.push(
      `*💳 REKENING DONASI:*`,
      `${data.accountNumber}`,
      `a.n. ${data.accountName}`,
      ''
    );
  }

  lines.push(
    `_"Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain"_`,
    `_(HR. Ahmad, ath-Thabrani, ad-Daruqutni)_`,
    '',
    `━━━━━━━━━━━━━━━`,
    `🏫 *Pondok Pesantren Imam Syafi'i Blitar*`,
    `📱 Konfirmasi: 0812-3456-7890`,
    `🌐 ${data.link || 'www.pondokimamsyafii.sch.id/donasi'}`
  );

  return lines.join('\n');
};

// Format document/ebook for WhatsApp
export const formatDocumentForWhatsApp = (data: DocumentShareData): string => {
  const lines = [
    `*📚 ${data.title.toUpperCase()} 📚*`,
    ''
  ];

  if (data.description) {
    lines.push(
      `📝 *Deskripsi:*`,
      data.description,
      ''
    );
  }

  if (data.author) {
    lines.push(`✍️ *Penulis:* ${data.author}`);
  }

  if (data.category) {
    lines.push(`🏷️ *Kategori:* ${data.category}`);
  }

  lines.push(
    '',
    `📥 *Download:* ${data.link || 'Tersedia di perpustakaan digital kami'}`,
    '',
    `━━━━━━━━━━━━━━━`,
    `📖 _Ayo tambah ilmu dengan membaca!_`,
    '',
    `🏫 *Pondok Pesantren Imam Syafi'i Blitar*`,
    `📚 Perpustakaan Digital`,
    `🌐 www.pondokimamsyafii.sch.id/library`
  );

  return lines.join('\n');
};

// Format OTA (Orang Tua Asuh) for WhatsApp
export const formatOTAForWhatsApp = (data: {
  studentCode: string;
  institution: string;
  grade: string;
  monthlyTarget: number;
  description: string;
  progress?: number;
}): string => {
  const lines = [
    `*🤝 PROGRAM ORANG TUA ASUH (OTA) 🤝*`,
    '',
    `*Kode Anak Asuh:* ${data.studentCode}`,
    `*Institusi:* ${data.institution}`,
    `*Kelas:* ${data.grade}`,
    '',
    `📋 *Informasi:*`,
    data.description,
    '',
    `💰 *Kebutuhan Bulanan:* ${formatRupiah(data.monthlyTarget)}`
  ];

  if (data.progress !== undefined) {
    lines.push(`📊 *Progress Bulan Ini:* ${data.progress}%`);
  }

  lines.push(
    '',
    `*💳 REKENING OTA:*`,
    `BSI: 7215748xxx`,
    `a.n. Yayasan Imam Syafi'i`,
    `_Konfirmasi dengan kode anak asuh_`,
    '',
    `_"Barangsiapa yang menanggung anak yatim, maka aku dan dia di surga seperti dua jari ini"_`,
    `_(HR. Bukhari)_`,
    '',
    `━━━━━━━━━━━━━━━`,
    `🏫 *Pondok Pesantren Imam Syafi'i Blitar*`,
    `📱 Admin OTA: 0812-3456-7890`,
    `🌐 www.pondokimamsyafii.sch.id/donasi/ota`
  );

  return lines.join('\n');
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Use the modern clipboard API if available
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

// Create a toast notification
export const showCopyNotification = (success: boolean) => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50 ${
    success 
      ? 'bg-green-500 text-white' 
      : 'bg-red-500 text-white'
  }`;
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      ${success 
        ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
        : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
      }
      <span>${success ? 'Berhasil disalin! Silakan paste ke WhatsApp' : 'Gagal menyalin teks'}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateY(-10px)';
    notification.style.opacity = '1';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};