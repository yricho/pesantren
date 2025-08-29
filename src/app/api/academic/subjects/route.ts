import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const isActive = searchParams.get('active');

    const whereConditions: any = {};
    
    if (level) {
      whereConditions.level = level;
    }
    
    if (category) {
      whereConditions.category = category;
    }
    
    if (type) {
      whereConditions.type = type;
    }
    
    if (isActive === 'true') {
      whereConditions.isActive = true;
    }

    const subjects = await prisma.subject.findMany({
      where: whereConditions,
      include: {
        _count: {
          select: {
            teacherSubjects: true,
            curriculumSubjects: true,
            grades: true,
            schedules: true,
            exams: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { category: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      code,
      name,
      nameArabic,
      description,
      credits,
      type,
      category,
      level,
      minGrade,
      maxGrade,
      isActive,
      sortOrder
    } = body;

    // Validate required fields
    if (!code || !name || !level) {
      return NextResponse.json(
        { error: 'Code, name, and level are required' },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        code,
        name,
        nameArabic,
        description,
        credits: credits || 2,
        type: type || 'WAJIB',
        category: category || 'UMUM',
        level,
        minGrade,
        maxGrade,
        isActive: Boolean(isActive),
        sortOrder: sortOrder || 0,
      },
      include: {
        _count: {
          select: {
            teacherSubjects: true,
            curriculumSubjects: true,
            grades: true,
            schedules: true,
            exams: true,
          },
        },
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error('Error creating subject:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Subject with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      code,
      name,
      nameArabic,
      description,
      credits,
      type,
      category,
      level,
      minGrade,
      maxGrade,
      isActive,
      sortOrder
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Subject ID is required' },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        code,
        name,
        nameArabic,
        description,
        credits,
        type,
        category,
        level,
        minGrade,
        maxGrade,
        isActive: Boolean(isActive),
        sortOrder,
      },
      include: {
        _count: {
          select: {
            teacherSubjects: true,
            curriculumSubjects: true,
            grades: true,
            schedules: true,
            exams: true,
          },
        },
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Subject with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subject ID is required' },
        { status: 400 }
      );
    }

    // Check if subject has associated data
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            teacherSubjects: true,
            curriculumSubjects: true,
            grades: true,
            schedules: true,
            exams: true,
          },
        },
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    const { teacherSubjects, curriculumSubjects, grades, schedules, exams } = subject._count;
    if (teacherSubjects > 0 || curriculumSubjects > 0 || grades > 0 || schedules > 0 || exams > 0) {
      return NextResponse.json(
        { error: 'Cannot delete subject that has associated data' },
        { status: 409 }
      );
    }

    await prisma.subject.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}