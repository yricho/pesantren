import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Complete list of Quran surahs with details
const QURAN_SURAHS = [
  { number: 1, name: "Al-Fatihah", nameArabic: "الفاتحة", totalAyat: 7, juz: 1, page: 1, type: "MAKKIYAH" },
  { number: 2, name: "Al-Baqarah", nameArabic: "البقرة", totalAyat: 286, juz: 1, page: 2, type: "MADANIYAH" },
  { number: 3, name: "Ali 'Imran", nameArabic: "آل عمران", totalAyat: 200, juz: 3, page: 50, type: "MADANIYAH" },
  { number: 4, name: "An-Nisa'", nameArabic: "النساء", totalAyat: 176, juz: 4, page: 77, type: "MADANIYAH" },
  { number: 5, name: "Al-Ma'idah", nameArabic: "المائدة", totalAyat: 120, juz: 6, page: 106, type: "MADANIYAH" },
  { number: 6, name: "Al-An'am", nameArabic: "الأنعام", totalAyat: 165, juz: 7, page: 128, type: "MAKKIYAH" },
  { number: 7, name: "Al-A'raf", nameArabic: "الأعراف", totalAyat: 206, juz: 8, page: 151, type: "MAKKIYAH" },
  { number: 8, name: "Al-Anfal", nameArabic: "الأنفال", totalAyat: 75, juz: 9, page: 177, type: "MADANIYAH" },
  { number: 9, name: "At-Tawbah", nameArabic: "التوبة", totalAyat: 129, juz: 10, page: 187, type: "MADANIYAH" },
  { number: 10, name: "Yunus", nameArabic: "يونس", totalAyat: 109, juz: 11, page: 208, type: "MAKKIYAH" },
  { number: 11, name: "Hud", nameArabic: "هود", totalAyat: 123, juz: 11, page: 221, type: "MAKKIYAH" },
  { number: 12, name: "Yusuf", nameArabic: "يوسف", totalAyat: 111, juz: 12, page: 235, type: "MAKKIYAH" },
  { number: 13, name: "Ar-Ra'd", nameArabic: "الرعد", totalAyat: 43, juz: 13, page: 249, type: "MADANIYAH" },
  { number: 14, name: "Ibrahim", nameArabic: "إبراهيم", totalAyat: 52, juz: 13, page: 255, type: "MAKKIYAH" },
  { number: 15, name: "Al-Hijr", nameArabic: "الحجر", totalAyat: 99, juz: 14, page: 262, type: "MAKKIYAH" },
  { number: 16, name: "An-Nahl", nameArabic: "النحل", totalAyat: 128, juz: 14, page: 267, type: "MAKKIYAH" },
  { number: 17, name: "Al-Isra'", nameArabic: "الإسراء", totalAyat: 111, juz: 15, page: 282, type: "MAKKIYAH" },
  { number: 18, name: "Al-Kahf", nameArabic: "الكهف", totalAyat: 110, juz: 15, page: 293, type: "MAKKIYAH" },
  { number: 19, name: "Maryam", nameArabic: "مريم", totalAyat: 98, juz: 16, page: 305, type: "MAKKIYAH" },
  { number: 20, name: "Ta-Ha", nameArabic: "طه", totalAyat: 135, juz: 16, page: 312, type: "MAKKIYAH" },
  { number: 21, name: "Al-Anbiya'", nameArabic: "الأنبياء", totalAyat: 112, juz: 17, page: 322, type: "MAKKIYAH" },
  { number: 22, name: "Al-Hajj", nameArabic: "الحج", totalAyat: 78, juz: 17, page: 332, type: "MADANIYAH" },
  { number: 23, name: "Al-Mu'minun", nameArabic: "المؤمنون", totalAyat: 118, juz: 18, page: 342, type: "MAKKIYAH" },
  { number: 24, name: "An-Nur", nameArabic: "النور", totalAyat: 64, juz: 18, page: 350, type: "MADANIYAH" },
  { number: 25, name: "Al-Furqan", nameArabic: "الفرقان", totalAyat: 77, juz: 18, page: 358, type: "MAKKIYAH" },
  { number: 26, name: "Ash-Shu'ara'", nameArabic: "الشعراء", totalAyat: 227, juz: 19, page: 367, type: "MAKKIYAH" },
  { number: 27, name: "An-Naml", nameArabic: "النمل", totalAyat: 93, juz: 19, page: 377, type: "MAKKIYAH" },
  { number: 28, name: "Al-Qasas", nameArabic: "القصص", totalAyat: 88, juz: 20, page: 385, type: "MAKKIYAH" },
  { number: 29, name: "Al-'Ankabut", nameArabic: "العنكبوت", totalAyat: 69, juz: 20, page: 396, type: "MAKKIYAH" },
  { number: 30, name: "Ar-Rum", nameArabic: "الروم", totalAyat: 60, juz: 21, page: 404, type: "MAKKIYAH" },
  { number: 31, name: "Luqman", nameArabic: "لقمان", totalAyat: 34, juz: 21, page: 411, type: "MAKKIYAH" },
  { number: 32, name: "As-Sajdah", nameArabic: "السجدة", totalAyat: 30, juz: 21, page: 415, type: "MAKKIYAH" },
  { number: 33, name: "Al-Ahzab", nameArabic: "الأحزاب", totalAyat: 73, juz: 21, page: 418, type: "MADANIYAH" },
  { number: 34, name: "Saba'", nameArabic: "سبأ", totalAyat: 54, juz: 22, page: 428, type: "MAKKIYAH" },
  { number: 35, name: "Fatir", nameArabic: "فاطر", totalAyat: 45, juz: 22, page: 434, type: "MAKKIYAH" },
  { number: 36, name: "Ya-Sin", nameArabic: "يس", totalAyat: 83, juz: 22, page: 440, type: "MAKKIYAH" },
  { number: 37, name: "As-Saffat", nameArabic: "الصافات", totalAyat: 182, juz: 23, page: 446, type: "MAKKIYAH" },
  { number: 38, name: "Sad", nameArabic: "ص", totalAyat: 88, juz: 23, page: 453, type: "MAKKIYAH" },
  { number: 39, name: "Az-Zumar", nameArabic: "الزمر", totalAyat: 75, juz: 23, page: 458, type: "MAKKIYAH" },
  { number: 40, name: "Ghafir", nameArabic: "غافر", totalAyat: 85, juz: 24, page: 467, type: "MAKKIYAH" },
  { number: 41, name: "Fussilat", nameArabic: "فصلت", totalAyat: 54, juz: 24, page: 477, type: "MAKKIYAH" },
  { number: 42, name: "Ash-Shura", nameArabic: "الشورى", totalAyat: 53, juz: 25, page: 483, type: "MAKKIYAH" },
  { number: 43, name: "Az-Zukhruf", nameArabic: "الزخرف", totalAyat: 89, juz: 25, page: 489, type: "MAKKIYAH" },
  { number: 44, name: "Ad-Dukhan", nameArabic: "الدخان", totalAyat: 59, juz: 25, page: 496, type: "MAKKIYAH" },
  { number: 45, name: "Al-Jathiyah", nameArabic: "الجاثية", totalAyat: 37, juz: 25, page: 499, type: "MAKKIYAH" },
  { number: 46, name: "Al-Ahqaf", nameArabic: "الأحقاف", totalAyat: 35, juz: 26, page: 502, type: "MAKKIYAH" },
  { number: 47, name: "Muhammad", nameArabic: "محمد", totalAyat: 38, juz: 26, page: 507, type: "MADANIYAH" },
  { number: 48, name: "Al-Fath", nameArabic: "الفتح", totalAyat: 29, juz: 26, page: 511, type: "MADANIYAH" },
  { number: 49, name: "Al-Hujurat", nameArabic: "الحجرات", totalAyat: 18, juz: 26, page: 515, type: "MADANIYAH" },
  { number: 50, name: "Qaf", nameArabic: "ق", totalAyat: 45, juz: 26, page: 518, type: "MAKKIYAH" },
  { number: 51, name: "Adh-Dhariyat", nameArabic: "الذاريات", totalAyat: 60, juz: 26, page: 520, type: "MAKKIYAH" },
  { number: 52, name: "At-Tur", nameArabic: "الطور", totalAyat: 49, juz: 27, page: 523, type: "MAKKIYAH" },
  { number: 53, name: "An-Najm", nameArabic: "النجم", totalAyat: 62, juz: 27, page: 526, type: "MAKKIYAH" },
  { number: 54, name: "Al-Qamar", nameArabic: "القمر", totalAyat: 55, juz: 27, page: 528, type: "MAKKIYAH" },
  { number: 55, name: "Ar-Rahman", nameArabic: "الرحمن", totalAyat: 78, juz: 27, page: 531, type: "MADANIYAH" },
  { number: 56, name: "Al-Waqi'ah", nameArabic: "الواقعة", totalAyat: 96, juz: 27, page: 534, type: "MAKKIYAH" },
  { number: 57, name: "Al-Hadid", nameArabic: "الحديد", totalAyat: 29, juz: 27, page: 537, type: "MADANIYAH" },
  { number: 58, name: "Al-Mujadilah", nameArabic: "المجادلة", totalAyat: 22, juz: 28, page: 542, type: "MADANIYAH" },
  { number: 59, name: "Al-Hashr", nameArabic: "الحشر", totalAyat: 24, juz: 28, page: 545, type: "MADANIYAH" },
  { number: 60, name: "Al-Mumtahanah", nameArabic: "الممتحنة", totalAyat: 13, juz: 28, page: 549, type: "MADANIYAH" },
  { number: 61, name: "As-Saff", nameArabic: "الصف", totalAyat: 14, juz: 28, page: 551, type: "MADANIYAH" },
  { number: 62, name: "Al-Jumu'ah", nameArabic: "الجمعة", totalAyat: 11, juz: 28, page: 553, type: "MADANIYAH" },
  { number: 63, name: "Al-Munafiqun", nameArabic: "المنافقون", totalAyat: 11, juz: 28, page: 554, type: "MADANIYAH" },
  { number: 64, name: "At-Taghabun", nameArabic: "التغابن", totalAyat: 18, juz: 28, page: 556, type: "MADANIYAH" },
  { number: 65, name: "At-Talaq", nameArabic: "الطلاق", totalAyat: 12, juz: 28, page: 558, type: "MADANIYAH" },
  { number: 66, name: "At-Tahrim", nameArabic: "التحريم", totalAyat: 12, juz: 28, page: 560, type: "MADANIYAH" },
  { number: 67, name: "Al-Mulk", nameArabic: "الملك", totalAyat: 30, juz: 29, page: 562, type: "MAKKIYAH" },
  { number: 68, name: "Al-Qalam", nameArabic: "القلم", totalAyat: 52, juz: 29, page: 564, type: "MAKKIYAH" },
  { number: 69, name: "Al-Haqqah", nameArabic: "الحاقة", totalAyat: 52, juz: 29, page: 566, type: "MAKKIYAH" },
  { number: 70, name: "Al-Ma'arij", nameArabic: "المعارج", totalAyat: 44, juz: 29, page: 568, type: "MAKKIYAH" },
  { number: 71, name: "Nuh", nameArabic: "نوح", totalAyat: 28, juz: 29, page: 570, type: "MAKKIYAH" },
  { number: 72, name: "Al-Jinn", nameArabic: "الجن", totalAyat: 28, juz: 29, page: 572, type: "MAKKIYAH" },
  { number: 73, name: "Al-Muzzammil", nameArabic: "المزمل", totalAyat: 20, juz: 29, page: 574, type: "MAKKIYAH" },
  { number: 74, name: "Al-Muddaththir", nameArabic: "المدثر", totalAyat: 56, juz: 29, page: 575, type: "MAKKIYAH" },
  { number: 75, name: "Al-Qiyamah", nameArabic: "القيامة", totalAyat: 40, juz: 29, page: 577, type: "MAKKIYAH" },
  { number: 76, name: "Al-Insan", nameArabic: "الإنسان", totalAyat: 31, juz: 29, page: 578, type: "MADANIYAH" },
  { number: 77, name: "Al-Mursalat", nameArabic: "المرسلات", totalAyat: 50, juz: 29, page: 580, type: "MAKKIYAH" },
  { number: 78, name: "An-Naba'", nameArabic: "النبأ", totalAyat: 40, juz: 30, page: 582, type: "MAKKIYAH" },
  { number: 79, name: "An-Nazi'at", nameArabic: "النازعات", totalAyat: 46, juz: 30, page: 583, type: "MAKKIYAH" },
  { number: 80, name: "'Abasa", nameArabic: "عبس", totalAyat: 42, juz: 30, page: 585, type: "MAKKIYAH" },
  { number: 81, name: "At-Takwir", nameArabic: "التكوير", totalAyat: 29, juz: 30, page: 586, type: "MAKKIYAH" },
  { number: 82, name: "Al-Infitar", nameArabic: "الإنفطار", totalAyat: 19, juz: 30, page: 587, type: "MAKKIYAH" },
  { number: 83, name: "Al-Mutaffifin", nameArabic: "المطففين", totalAyat: 36, juz: 30, page: 587, type: "MAKKIYAH" },
  { number: 84, name: "Al-Inshiqaq", nameArabic: "الإنشقاق", totalAyat: 25, juz: 30, page: 589, type: "MAKKIYAH" },
  { number: 85, name: "Al-Buruj", nameArabic: "البروج", totalAyat: 22, juz: 30, page: 590, type: "MAKKIYAH" },
  { number: 86, name: "At-Tariq", nameArabic: "الطارق", totalAyat: 17, juz: 30, page: 591, type: "MAKKIYAH" },
  { number: 87, name: "Al-A'la", nameArabic: "الأعلى", totalAyat: 19, juz: 30, page: 591, type: "MAKKIYAH" },
  { number: 88, name: "Al-Ghashiyah", nameArabic: "الغاشية", totalAyat: 26, juz: 30, page: 592, type: "MAKKIYAH" },
  { number: 89, name: "Al-Fajr", nameArabic: "الفجر", totalAyat: 30, juz: 30, page: 593, type: "MAKKIYAH" },
  { number: 90, name: "Al-Balad", nameArabic: "البلد", totalAyat: 20, juz: 30, page: 594, type: "MAKKIYAH" },
  { number: 91, name: "Ash-Shams", nameArabic: "الشمس", totalAyat: 15, juz: 30, page: 595, type: "MAKKIYAH" },
  { number: 92, name: "Al-Layl", nameArabic: "الليل", totalAyat: 21, juz: 30, page: 595, type: "MAKKIYAH" },
  { number: 93, name: "Ad-Duha", nameArabic: "الضحى", totalAyat: 11, juz: 30, page: 596, type: "MAKKIYAH" },
  { number: 94, name: "Ash-Sharh", nameArabic: "الشرح", totalAyat: 8, juz: 30, page: 596, type: "MAKKIYAH" },
  { number: 95, name: "At-Tin", nameArabic: "التين", totalAyat: 8, juz: 30, page: 597, type: "MAKKIYAH" },
  { number: 96, name: "Al-'Alaq", nameArabic: "العلق", totalAyat: 19, juz: 30, page: 597, type: "MAKKIYAH" },
  { number: 97, name: "Al-Qadr", nameArabic: "القدر", totalAyat: 5, juz: 30, page: 598, type: "MAKKIYAH" },
  { number: 98, name: "Al-Bayyinah", nameArabic: "البينة", totalAyat: 8, juz: 30, page: 598, type: "MADANIYAH" },
  { number: 99, name: "Az-Zalzalah", nameArabic: "الزلزلة", totalAyat: 8, juz: 30, page: 599, type: "MADANIYAH" },
  { number: 100, name: "Al-'Adiyat", nameArabic: "العاديات", totalAyat: 11, juz: 30, page: 599, type: "MAKKIYAH" },
  { number: 101, name: "Al-Qari'ah", nameArabic: "القارعة", totalAyat: 11, juz: 30, page: 600, type: "MAKKIYAH" },
  { number: 102, name: "At-Takathur", nameArabic: "التكاثر", totalAyat: 8, juz: 30, page: 600, type: "MAKKIYAH" },
  { number: 103, name: "Al-'Asr", nameArabic: "العصر", totalAyat: 3, juz: 30, page: 601, type: "MAKKIYAH" },
  { number: 104, name: "Al-Humazah", nameArabic: "الهمزة", totalAyat: 9, juz: 30, page: 601, type: "MAKKIYAH" },
  { number: 105, name: "Al-Fil", nameArabic: "الفيل", totalAyat: 5, juz: 30, page: 601, type: "MAKKIYAH" },
  { number: 106, name: "Quraysh", nameArabic: "قريش", totalAyat: 4, juz: 30, page: 602, type: "MAKKIYAH" },
  { number: 107, name: "Al-Ma'un", nameArabic: "الماعون", totalAyat: 7, juz: 30, page: 602, type: "MAKKIYAH" },
  { number: 108, name: "Al-Kawthar", nameArabic: "الكوثر", totalAyat: 3, juz: 30, page: 602, type: "MAKKIYAH" },
  { number: 109, name: "Al-Kafirun", nameArabic: "الكافرون", totalAyat: 6, juz: 30, page: 603, type: "MAKKIYAH" },
  { number: 110, name: "An-Nasr", nameArabic: "النصر", totalAyat: 3, juz: 30, page: 603, type: "MADANIYAH" },
  { number: 111, name: "Al-Masad", nameArabic: "المسد", totalAyat: 5, juz: 30, page: 603, type: "MAKKIYAH" },
  { number: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", totalAyat: 4, juz: 30, page: 604, type: "MAKKIYAH" },
  { number: 113, name: "Al-Falaq", nameArabic: "الفلق", totalAyat: 5, juz: 30, page: 604, type: "MAKKIYAH" },
  { number: 114, name: "An-Nas", nameArabic: "الناس", totalAyat: 6, juz: 30, page: 604, type: "MAKKIYAH" }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const juz = searchParams.get('juz');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    // Check if surahs already exist in database, if not seed them
    const existingSurahs = await prisma.quranSurah.count();
    
    if (existingSurahs === 0) {
      // Seed the database with surah data
      await prisma.quranSurah.createMany({
        data: QURAN_SURAHS.map(surah => ({
          number: surah.number,
          name: surah.name,
          nameArabic: surah.nameArabic,
          totalAyat: surah.totalAyat,
          juz: surah.juz,
          page: surah.page,
          type: surah.type,
          isActive: true,
          sortOrder: surah.number
        }))
      });
    }

    // Build query conditions
    let where: any = { isActive: true };
    
    if (juz) {
      where.juz = parseInt(juz);
    }
    
    if (type) {
      where.type = type.toUpperCase();
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameArabic: { contains: search } }
      ];
    }

    const surahs = await prisma.quranSurah.findMany({
      where,
      orderBy: { number: 'asc' },
      select: {
        id: true,
        number: true,
        name: true,
        nameArabic: true,
        totalAyat: true,
        juz: true,
        page: true,
        type: true,
        meaningId: true,
        meaningAr: true
      }
    });

    // Add summary statistics
    const stats = {
      totalSurahs: surahs.length,
      makkiyah: surahs.filter(s => s.type === 'MAKKIYAH').length,
      madaniyah: surahs.filter(s => s.type === 'MADANIYAH').length,
      totalAyat: surahs.reduce((sum, s) => sum + s.totalAyat, 0),
      juzRange: juz ? [parseInt(juz)] : [...new Set(surahs.map(s => s.juz))].sort((a, b) => a - b)
    };

    return NextResponse.json({
      surahs,
      stats,
      filters: {
        juz: juz ? parseInt(juz) : null,
        type: type ? type.toUpperCase() : null,
        search: search || null
      }
    });

  } catch (error) {
    console.error('Error fetching surahs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surahs' },
      { status: 500 }
    );
  }
}

// Initialize/seed surah data (for admin use)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Delete existing surahs and recreate
    await prisma.quranSurah.deleteMany();
    
    const created = await prisma.quranSurah.createMany({
      data: QURAN_SURAHS.map(surah => ({
        number: surah.number,
        name: surah.name,
        nameArabic: surah.nameArabic,
        totalAyat: surah.totalAyat,
        juz: surah.juz,
        page: surah.page,
        type: surah.type,
        isActive: true,
        sortOrder: surah.number
      }))
    });

    return NextResponse.json({
      message: 'Surah data initialized successfully',
      created: created.count
    });

  } catch (error) {
    console.error('Error initializing surah data:', error);
    return NextResponse.json(
      { error: 'Failed to initialize surah data' },
      { status: 500 }
    );
  }
}