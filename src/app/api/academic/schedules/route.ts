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
    const classId = searchParams.get('classId');
    const teacherId = searchParams.get('teacherId');
    const day = searchParams.get('day');
    const isActive = searchParams.get('active');

    const whereConditions: any = {};
    
    if (classId) {
      whereConditions.classId = classId;
    }
    
    if (teacherId) {
      whereConditions.teacherId = teacherId;
    }
    
    if (day) {
      whereConditions.day = day;
    }
    
    if (isActive === 'true') {
      whereConditions.isActive = true;
    }

    const schedules = await prisma.schedule.findMany({
      where: whereConditions,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            grade: true,
            level: true,
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        },
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            nameArabic: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { day: 'asc' },
        { period: 'asc' },
        { startTime: 'asc' },
      ],
    });

    // Group schedules by day for better presentation
    const groupedSchedules = schedules.reduce((acc, schedule) => {
      const day = schedule.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(schedule);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      schedules,
      grouped: groupedSchedules,
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
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
      classId,
      subjectId,
      teacherId,
      day,
      startTime,
      endTime,
      room,
      period,
      notes,
      isActive
    } = body;

    // Validate required fields
    if (!classId || !subjectId || !teacherId || !day || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Class, subject, teacher, day, start time, and end time are required' },
        { status: 400 }
      );
    }

    // Validate day
    const validDays = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
    if (!validDays.includes(day)) {
      return NextResponse.json(
        { error: 'Invalid day. Must be one of: ' + validDays.join(', ') },
        { status: 400 }
      );
    }

    // Check for conflicts (same class, same time)
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        classId,
        day,
        startTime,
        isActive: true,
      },
    });

    if (existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule conflict: Class already has a schedule at this time' },
        { status: 409 }
      );
    }

    // Check teacher availability (same teacher, same time)
    const teacherConflict = await prisma.schedule.findFirst({
      where: {
        teacherId,
        day,
        startTime,
        isActive: true,
      },
    });

    if (teacherConflict) {
      return NextResponse.json(
        { error: 'Schedule conflict: Teacher is not available at this time' },
        { status: 409 }
      );
    }

    const schedule = await prisma.schedule.create({
      data: {
        classId,
        subjectId,
        teacherId,
        day,
        startTime,
        endTime,
        room,
        period,
        notes,
        isActive: Boolean(isActive),
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            grade: true,
            level: true,
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        },
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            nameArabic: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Schedule already exists for this class, day, and time' },
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
      subjectId,
      teacherId,
      day,
      startTime,
      endTime,
      room,
      period,
      notes,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    // Get current schedule to check conflicts
    const currentSchedule = await prisma.schedule.findUnique({
      where: { id },
      select: { classId: true, day: true, startTime: true },
    });

    if (!currentSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    // If day or startTime is being changed, check for conflicts
    if ((day && day !== currentSchedule.day) || (startTime && startTime !== currentSchedule.startTime)) {
      const newDay = day || currentSchedule.day;
      const newStartTime = startTime || currentSchedule.startTime;

      // Check for class conflicts
      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          classId: currentSchedule.classId,
          day: newDay,
          startTime: newStartTime,
          isActive: true,
          NOT: { id },
        },
      });

      if (existingSchedule) {
        return NextResponse.json(
          { error: 'Schedule conflict: Class already has a schedule at this time' },
          { status: 409 }
        );
      }

      // Check teacher availability if teacher is being changed
      if (teacherId) {
        const teacherConflict = await prisma.schedule.findFirst({
          where: {
            teacherId,
            day: newDay,
            startTime: newStartTime,
            isActive: true,
            NOT: { id },
          },
        });

        if (teacherConflict) {
          return NextResponse.json(
            { error: 'Schedule conflict: Teacher is not available at this time' },
            { status: 409 }
          );
        }
      }
    }

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        subjectId,
        teacherId,
        day,
        startTime,
        endTime,
        room,
        period,
        notes,
        isActive: Boolean(isActive),
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            grade: true,
            level: true,
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        },
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            nameArabic: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
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
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    await prisma.schedule.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}