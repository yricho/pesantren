import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const createActivitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string().min(1, 'Type is required'),
  date: z.string(),
  location: z.string().optional().nullable(),
  status: z.enum(['planned', 'ongoing', 'completed']).default('planned'),
  photos: z.array(z.string()).optional().default([]),
});

export async function GET(request: NextRequest) {
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // For now, return mock data since we don't have Activity model in the schema yet
    const mockActivities = [
      {
        id: '1',
        title: 'Kajian Rutin Mingguan',
        description: 'Kajian rutin setiap hari Jumat dengan tema Fiqih Muamalah',
        type: 'kajian',
        date: new Date('2024-03-22'),
        location: 'Masjid Pondok',
        photos: ['/photos/kajian1.jpg', '/photos/kajian2.jpg'],
        status: 'planned',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Pelatihan Komputer',
        description: 'Pelatihan komputer dasar untuk santri tingkat menengah',
        type: 'pelatihan',
        date: new Date('2024-03-20'),
        location: 'Lab Komputer',
        photos: ['/photos/pelatihan1.jpg'],
        status: 'completed',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Bakti Sosial',
        description: 'Kegiatan bakti sosial di desa sekitar pondok',
        type: 'sosial',
        date: new Date('2024-03-18'),
        location: 'Desa Sumberejo',
        photos: ['/photos/baksos1.jpg', '/photos/baksos2.jpg', '/photos/baksos3.jpg'],
        status: 'completed',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'Seminar Kewirausahaan',
        description: 'Seminar motivasi kewirausahaan untuk alumni dan santri senior',
        type: 'seminar',
        date: new Date('2024-03-25'),
        location: 'Aula Pondok',
        photos: [],
        status: 'planned',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Apply filters to mock data
    let filteredActivities = mockActivities;

    if (type) {
      filteredActivities = filteredActivities.filter(activity => activity.type === type);
    }

    if (status) {
      filteredActivities = filteredActivities.filter(activity => activity.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredActivities = filteredActivities.filter(activity =>
        activity.title.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        (activity.location && activity.location.toLowerCase().includes(searchLower))
      );
    }

    // Apply pagination
    const paginatedActivities = filteredActivities.slice(skip, skip + limit);

    return NextResponse.json({
      data: paginatedActivities,
      pagination: {
        page,
        limit,
        total: filteredActivities.length,
        totalPages: Math.ceil(filteredActivities.length / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = createActivitySchema.parse(body);

    // For now, return a mock created activity since we don't have Activity model
    const newActivity = {
      id: Math.random().toString(),
      ...validated,
      date: new Date(validated.date),
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(newActivity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}