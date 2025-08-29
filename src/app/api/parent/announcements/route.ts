import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // GENERAL, ACADEMIC, EVENT, PAYMENT, EMERGENCY
    const priority = searchParams.get('priority'); // LOW, NORMAL, HIGH, URGENT
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    // Get parent's children to determine relevant announcements
    const parentAccount = await prisma.parentAccount.findUnique({
      where: { userId: session.user.id },
      include: {
        parentStudents: {
          include: {
            student: {
              include: {
                studentClasses: {
                  where: { status: 'ACTIVE' },
                  include: {
                    class: {
                      select: {
                        id: true,
                        grade: true,
                        level: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!parentAccount) {
      return NextResponse.json({ 
        error: 'Parent account not found' 
      }, { status: 404 });
    }

    // Get relevant class IDs and grades for targeting
    const studentClasses = parentAccount.parentStudents
      .flatMap(ps => ps.student.studentClasses)
      .map(sc => sc.class);
    
    const relevantClassIds = studentClasses.map(c => c.id);
    const relevantGrades = [...new Set(studentClasses.map(c => c.grade))];

    // Build where conditions
    const whereConditions: any = {
      status: 'PUBLISHED',
      publishDate: { lte: new Date() },
      OR: [
        { expiryDate: null },
        { expiryDate: { gte: new Date() } }
      ],
      AND: [
        {
          OR: [
            { targetAudience: 'ALL' },
            { targetAudience: 'PARENTS' },
            {
              AND: [
                { targetAudience: 'SPECIFIC_CLASS' },
                {
                  targetClasses: {
                    contains: JSON.stringify(relevantClassIds).slice(1, -1) // Remove outer brackets
                  }
                }
              ]
            },
            {
              AND: [
                { targetAudience: 'SPECIFIC_GRADE' },
                {
                  targetGrades: {
                    in: relevantGrades.map(grade => `\"${grade}\"`)
                  }
                }
              ]
            }
          ]
        }
      ]
    };

    if (category) {
      whereConditions.category = category;
    }

    if (priority) {
      whereConditions.priority = priority;
    }

    if (search) {
      whereConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get announcements
    const announcements = await prisma.announcement.findMany({
      where: whereConditions,
      orderBy: [
        { isPinned: 'desc' },
        { priority: 'desc' },
        { publishDate: 'desc' }
      ],
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        category: true,
        priority: true,
        isPinned: true,
        featuredImage: true,
        attachments: true,
        tags: true,
        publishDate: true,
        expiryDate: true,
        viewCount: true,
        createdAt: true,
        targetAudience: true
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.announcement.count({
      where: whereConditions
    });

    // Format announcements
    const formattedAnnouncements = announcements.map(announcement => ({
      ...announcement,
      attachments: JSON.parse(announcement.attachments),
      tags: JSON.parse(announcement.tags),
      isExpiringSoon: announcement.expiryDate 
        ? announcement.expiryDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        : false,
      timeAgo: getTimeAgo(announcement.publishDate)
    }));

    // Get pinned announcements separately if not filtered
    const pinnedAnnouncements = !search && offset === 0 ? 
      await prisma.announcement.findMany({
        where: {
          ...whereConditions,
          isPinned: true
        },
        orderBy: [
          { priority: 'desc' },
          { publishDate: 'desc' }
        ],
        take: 5,
        select: {
          id: true,
          title: true,
          summary: true,
          category: true,
          priority: true,
          featuredImage: true,
          publishDate: true
        }
      }) : [];\n\n    // Get announcement statistics\n    const stats = {\n      total: totalCount,\n      unread: totalCount, // For now, assume all are unread. Could implement read tracking\n      byCategory: await getAnnouncementsByCategory(whereConditions),\n      byPriority: await getAnnouncementsByPriority(whereConditions),\n      recent: announcements.filter(a => \n        (Date.now() - a.publishDate.getTime()) < 7 * 24 * 60 * 60 * 1000\n      ).length\n    };\n\n    const result = {\n      announcements: formattedAnnouncements,\n      pinnedAnnouncements: pinnedAnnouncements.map(announcement => ({\n        ...announcement,\n        timeAgo: getTimeAgo(announcement.publishDate)\n      })),\n      stats,\n      pagination: {\n        total: totalCount,\n        limit,\n        offset,\n        hasMore: offset + announcements.length < totalCount,\n        totalPages: Math.ceil(totalCount / limit),\n        currentPage: Math.floor(offset / limit) + 1\n      },\n      filters: {\n        availableCategories: ['GENERAL', 'ACADEMIC', 'EVENT', 'PAYMENT', 'EMERGENCY'],\n        availablePriorities: ['LOW', 'NORMAL', 'HIGH', 'URGENT']\n      }\n    };\n\n    return NextResponse.json(result);\n  } catch (error) {\n    console.error('Error fetching announcements:', error);\n    return NextResponse.json(\n      { error: 'Internal server error' },\n      { status: 500 }\n    );\n  }\n}\n\n// Helper function to get time ago string\nfunction getTimeAgo(date: Date): string {\n  const now = new Date();\n  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);\n\n  if (diffInSeconds < 60) {\n    return 'Baru saja';\n  } else if (diffInSeconds < 3600) {\n    const minutes = Math.floor(diffInSeconds / 60);\n    return `${minutes} menit yang lalu`;\n  } else if (diffInSeconds < 86400) {\n    const hours = Math.floor(diffInSeconds / 3600);\n    return `${hours} jam yang lalu`;\n  } else if (diffInSeconds < 604800) {\n    const days = Math.floor(diffInSeconds / 86400);\n    return `${days} hari yang lalu`;\n  } else {\n    const weeks = Math.floor(diffInSeconds / 604800);\n    return `${weeks} minggu yang lalu`;\n  }\n}\n\n// Helper function to get announcements by category\nasync function getAnnouncementsByCategory(baseWhere: any) {\n  const categories = ['GENERAL', 'ACADEMIC', 'EVENT', 'PAYMENT', 'EMERGENCY'];\n  const results = await Promise.all(\n    categories.map(async (category) => {\n      const count = await prisma.announcement.count({\n        where: {\n          ...baseWhere,\n          category\n        }\n      });\n      return { category, count };\n    })\n  );\n  return results.filter(r => r.count > 0);\n}\n\n// Helper function to get announcements by priority\nasync function getAnnouncementsByPriority(baseWhere: any) {\n  const priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];\n  const results = await Promise.all(\n    priorities.map(async (priority) => {\n      const count = await prisma.announcement.count({\n        where: {\n          ...baseWhere,\n          priority\n        }\n      });\n      return { priority, count };\n    })\n  );\n  return results.filter(r => r.count > 0);\n}\n\n// POST endpoint to mark announcement as read (optional)\nexport async function POST(request: NextRequest) {\n  try {\n    const session = await getServerSession(authOptions);\n    if (!session || session.user.role !== 'PARENT') {\n      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n    }\n\n    const body = await request.json();\n    const { announcementId } = body;\n\n    if (!announcementId) {\n      return NextResponse.json(\n        { error: 'Announcement ID is required' },\n        { status: 400 }\n      );\n    }\n\n    // Increment view count\n    await prisma.announcement.update({\n      where: { id: announcementId },\n      data: {\n        viewCount: {\n          increment: 1\n        }\n      }\n    });\n\n    return NextResponse.json({ success: true });\n  } catch (error) {\n    console.error('Error updating announcement view:', error);\n    return NextResponse.json(\n      { error: 'Internal server error' },\n      { status: 500 }\n    );\n  }\n}