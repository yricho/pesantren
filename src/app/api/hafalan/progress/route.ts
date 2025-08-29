import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const level = searchParams.get('level');
    const program = searchParams.get('program');
    const limit = searchParams.get('limit') || '50';
    const page = searchParams.get('page') || '1';

    let studentWhere: any = { isActive: true };
    
    if (classId) {
      studentWhere.studentClasses = {
        some: { classId, status: 'ACTIVE' }
      };
    }
    
    if (level) {
      studentWhere.grade = level;
    }

    if (program) {
      // Filter by program type in classes
      studentWhere.studentClasses = {
        some: { 
          class: { program },
          status: 'ACTIVE'
        }
      };
    }

    const students = await prisma.student.findMany({
      where: studentWhere,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      select: {
        id: true,
        fullName: true,
        nickname: true,
        photo: true,
        grade: true,
        institutionType: true,
        enrollmentDate: true
      }
    });

    // Get progress for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progress = await prisma.hafalanProgress.findUnique({
          where: { studentId: student.id }
        });

        // Get recent activity
        const recentRecord = await prisma.hafalanRecord.findFirst({
          where: { studentId: student.id },
          orderBy: { date: 'desc' },
          include: {
            surah: {
              select: {
                number: true,
                name: true,
                nameArabic: true
              }
            }
          }
        });

        // Get current target
        const currentTarget = await prisma.hafalanTarget.findFirst({
          where: {
            studentId: student.id,
            status: 'ACTIVE'
          },
          include: {
            surah: {
              select: {
                number: true,
                name: true,
                nameArabic: true
              }
            }
          },
          orderBy: { targetDate: 'asc' }
        });

        // Get achievement count
        const achievementCount = await prisma.hafalanAchievement.count({
          where: { studentId: student.id }
        });

        // Calculate days since last activity
        let daysSinceLastActivity = null;
        if (progress?.lastSetoranDate) {
          const daysDiff = Math.floor(
            (new Date().getTime() - progress.lastSetoranDate.getTime()) / (1000 * 3600 * 24)
          );
          daysSinceLastActivity = daysDiff;
        }

        return {
          ...student,
          progress: progress || {
            totalSurah: 0,
            totalAyat: 0,
            totalJuz: 0,
            juz30Progress: 0,
            overallProgress: 0,
            level: 'PEMULA',
            currentStreak: 0,
            totalSessions: 0,
            avgQuality: 0
          },
          recentRecord,
          currentTarget,
          achievementCount,
          daysSinceLastActivity,
          status: daysSinceLastActivity === null 
            ? 'BELUM_MULAI' 
            : daysSinceLastActivity === 0 
            ? 'AKTIF_HARI_INI'
            : daysSinceLastActivity <= 7 
            ? 'AKTIF' 
            : daysSinceLastActivity <= 30 
            ? 'KURANG_AKTIF' 
            : 'TIDAK_AKTIF'
        };
      })
    );

    // Sort by progress (descending)
    studentsWithProgress.sort((a, b) => {
      const progressA = a.progress?.overallProgress || 0;
      const progressB = b.progress?.overallProgress || 0;
      return progressB - progressA;
    });

    const total = await prisma.student.count({ where: studentWhere });

    // Calculate class/overall statistics
    const statistics = {
      totalStudents: studentsWithProgress.length,
      activeStudents: studentsWithProgress.filter(s => s.status === 'AKTIF' || s.status === 'AKTIF_HARI_INI').length,
      averageProgress: studentsWithProgress.reduce((sum, s) => sum + (s.progress?.overallProgress || 0), 0) / studentsWithProgress.length,
      averageJuz30Progress: studentsWithProgress.reduce((sum, s) => sum + (s.progress?.juz30Progress || 0), 0) / studentsWithProgress.length,
      totalCompletedSurahs: studentsWithProgress.reduce((sum, s) => sum + (s.progress?.totalSurah || 0), 0),
      totalAyatsMemorized: studentsWithProgress.reduce((sum, s) => sum + (s.progress?.totalAyat || 0), 0),
      levelDistribution: {
        PEMULA: studentsWithProgress.filter(s => s.progress?.level === 'PEMULA').length,
        MENENGAH: studentsWithProgress.filter(s => s.progress?.level === 'MENENGAH').length,
        LANJUT: studentsWithProgress.filter(s => s.progress?.level === 'LANJUT').length,
        HAFIDZ: studentsWithProgress.filter(s => s.progress?.level === 'HAFIDZ').length
      },
      activityStatus: {
        BELUM_MULAI: studentsWithProgress.filter(s => s.status === 'BELUM_MULAI').length,
        AKTIF_HARI_INI: studentsWithProgress.filter(s => s.status === 'AKTIF_HARI_INI').length,
        AKTIF: studentsWithProgress.filter(s => s.status === 'AKTIF').length,
        KURANG_AKTIF: studentsWithProgress.filter(s => s.status === 'KURANG_AKTIF').length,
        TIDAK_AKTIF: studentsWithProgress.filter(s => s.status === 'TIDAK_AKTIF').length
      }
    };

    return NextResponse.json({
      students: studentsWithProgress,
      statistics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching hafalan progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}