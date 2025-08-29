import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const createStudentSchema = z.object({
  nisn: z.string().optional().nullable(),
  nis: z.string().min(1, 'NIS is required'),
  fullName: z.string().min(1, 'Name is required'),
  nickname: z.string().optional().nullable(),
  birthPlace: z.string().min(1, 'Birth place is required'),
  birthDate: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  bloodType: z.string().optional().nullable(),
  address: z.string().min(1, 'Address is required'),
  village: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  city: z.string().min(1, 'City is required'),
  province: z.string().default('Jawa Timur'),
  postalCode: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  fatherName: z.string().min(1, 'Father name is required'),
  fatherJob: z.string().optional().nullable(),
  fatherPhone: z.string().optional().nullable(),
  fatherEducation: z.string().optional().nullable(),
  motherName: z.string().min(1, 'Mother name is required'),
  motherJob: z.string().optional().nullable(),
  motherPhone: z.string().optional().nullable(),
  motherEducation: z.string().optional().nullable(),
  guardianName: z.string().optional().nullable(),
  guardianJob: z.string().optional().nullable(),
  guardianPhone: z.string().optional().nullable(),
  guardianRelation: z.string().optional().nullable(),
  institutionType: z.enum(['TK', 'SD', 'PONDOK']),
  grade: z.string().optional().nullable(),
  enrollmentDate: z.string(),
  enrollmentYear: z.string(),
  previousSchool: z.string().optional().nullable(),
  specialNeeds: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const { default: prisma } = await import('@/lib/prisma');
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const institutionType = searchParams.get('institutionType');
    const status = searchParams.get('status');
    const grade = searchParams.get('grade');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (institutionType) {
      where.institutionType = institutionType;
    }

    if (status) {
      where.status = status;
    }

    if (grade) {
      where.grade = grade;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { nis: { contains: search, mode: 'insensitive' } },
        { nisn: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          creator: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
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
    const validated = createStudentSchema.parse(body);

    const student = await prisma.student.create({
      data: {
        ...validated,
        birthDate: new Date(validated.birthDate),
        enrollmentDate: new Date(validated.enrollmentDate),
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}