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
    const academicYearId = searchParams.get('academicYearId');
    const level = searchParams.get('level');
    const grade = searchParams.get('grade');
    const isActive = searchParams.get('active');

    const whereConditions: any = {};
    
    if (academicYearId) {
      whereConditions.academicYearId = academicYearId;
    }
    
    if (level) {
      whereConditions.level = level;
    }
    
    if (grade) {
      whereConditions.grade = grade;
    }
    
    if (isActive === 'true') {
      whereConditions.isActive = true;
    }

    const classes = await prisma.class.findMany({
      where: whereConditions,
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            studentClasses: true,
            teacherSubjects: true,
            schedules: true,
            exams: true,
          },
        },
      },
      orderBy: [
        { academicYear: { startDate: 'desc' } },
        { level: 'asc' },
        { grade: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
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
      name,
      grade,
      section,
      academicYearId,
      teacherId,
      capacity,
      room,
      level,
      program,
      description,
      isActive
    } = body;

    // Validate required fields
    if (!name || !grade || !academicYearId || !level) {
      return NextResponse.json(
        { error: 'Name, grade, academic year, and level are required' },
        { status: 400 }
      );
    }

    // Check if academic year exists
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!academicYear) {
      return NextResponse.json(
        { error: 'Academic year not found' },
        { status: 404 }
      );
    }

    // Check if teacher exists (if provided)
    if (teacherId) {
      const teacher = await prisma.user.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        return NextResponse.json(
          { error: 'Teacher not found' },
          { status: 404 }
        );
      }
    }

    const classData = await prisma.class.create({
      data: {
        name,
        grade,
        section,
        academicYearId,
        teacherId,
        capacity: capacity || 30,
        room,
        level,
        program,
        description,
        isActive: Boolean(isActive),
      },
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            studentClasses: true,
            teacherSubjects: true,
            schedules: true,
            exams: true,
          },
        },
      },
    });

    return NextResponse.json(classData, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Class with this name already exists in the academic year' },
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
      name,
      grade,
      section,
      teacherId,
      capacity,
      room,
      level,
      program,
      description,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Class ID is required' },
        { status: 400 }
      );
    }

    // Check if teacher exists (if provided)
    if (teacherId) {
      const teacher = await prisma.user.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        return NextResponse.json(
          { error: 'Teacher not found' },
          { status: 404 }
        );
      }
    }

    const classData = await prisma.class.update({
      where: { id },
      data: {
        name,
        grade,
        section,
        teacherId,
        capacity,
        room,
        level,
        program,
        description,
        isActive: Boolean(isActive),
      },
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            studentClasses: true,
            teacherSubjects: true,
            schedules: true,
            exams: true,
          },
        },
      },
    });

    return NextResponse.json(classData);
  } catch (error) {
    console.error('Error updating class:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Class with this name already exists in the academic year' },
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
        { error: 'Class ID is required' },
        { status: 400 }
      );
    }

    // Check if class has associated data
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            studentClasses: true,
            teacherSubjects: true,
            schedules: true,
            exams: true,
          },
        },
      },
    });

    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    const { studentClasses, teacherSubjects, schedules, exams } = classData._count;
    if (studentClasses > 0 || teacherSubjects > 0 || schedules > 0 || exams > 0) {
      return NextResponse.json(
        { error: 'Cannot delete class that has students, subjects, schedules, or exams associated with it' },
        { status: 409 }
      );
    }

    await prisma.class.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}