import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Function to calculate grade and point from total score
function calculateGradeAndPoint(score: number): { grade: string; point: number } {
  if (score >= 90) return { grade: 'A', point: 4.0 };
  if (score >= 85) return { grade: 'A-', point: 3.7 };
  if (score >= 80) return { grade: 'B+', point: 3.3 };
  if (score >= 75) return { grade: 'B', point: 3.0 };
  if (score >= 70) return { grade: 'B-', point: 2.7 };
  if (score >= 65) return { grade: 'C+', point: 2.3 };
  if (score >= 60) return { grade: 'C', point: 2.0 };
  if (score >= 55) return { grade: 'C-', point: 1.7 };
  if (score >= 50) return { grade: 'D+', point: 1.3 };
  if (score >= 45) return { grade: 'D', point: 1.0 };
  return { grade: 'E', point: 0.0 };
}

// Function to calculate total score from components
function calculateTotalScore(components: any): number | null {
  const {
    midterm,
    final,
    assignment,
    quiz,
    participation,
    project,
    daily
  } = components;

  let total = 0;
  let totalWeight = 0;

  // Define weights for each component
  if (midterm !== null && midterm !== undefined) {
    total += (midterm * 0.3); // 30%
    totalWeight += 0.3;
  }

  if (final !== null && final !== undefined) {
    total += (final * 0.35); // 35%
    totalWeight += 0.35;
  }

  if (assignment !== null && assignment !== undefined) {
    total += (assignment * 0.15); // 15%
    totalWeight += 0.15;
  }

  if (quiz !== null && quiz !== undefined) {
    total += (quiz * 0.10); // 10%
    totalWeight += 0.10;
  }

  if (participation !== null && participation !== undefined) {
    total += (participation * 0.05); // 5%
    totalWeight += 0.05;
  }

  if (project !== null && project !== undefined) {
    total += (project * 0.05); // 5%
    totalWeight += 0.05;
  }

  // Only calculate if we have enough components (at least 50% weight)
  if (totalWeight >= 0.5) {
    return total / totalWeight * 100;
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const semesterId = searchParams.get('semesterId');
    const studentId = searchParams.get('studentId');
    const subjectId = searchParams.get('subjectId');
    const classId = searchParams.get('classId');

    const whereConditions: any = {};
    
    if (semesterId) {
      whereConditions.semesterId = semesterId;
    }
    
    if (studentId) {
      whereConditions.studentId = studentId;
    }
    
    if (subjectId) {
      whereConditions.subjectId = subjectId;
    }

    if (classId) {
      whereConditions.classId = classId;
    }

    const grades = await prisma.grade.findMany({
      where: whereConditions,
      include: {
        student: {
          select: {
            id: true,
            nis: true,
            fullName: true,
            photo: true,
          },
        },
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            nameArabic: true,
            credits: true,
          },
        },
        semester: {
          select: {
            id: true,
            name: true,
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { semester: { startDate: 'desc' } },
        { student: { fullName: 'asc' } },
        { subject: { name: 'asc' } },
      ],
    });

    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
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
      studentId,
      subjectId,
      semesterId,
      classId,
      midterm,
      final,
      assignment,
      quiz,
      participation,
      project,
      daily,
      akhlak,
      quranMemory,
      notes
    } = body;

    // Validate required fields
    if (!studentId || !subjectId || !semesterId) {
      return NextResponse.json(
        { error: 'Student, subject, and semester are required' },
        { status: 400 }
      );
    }

    // Calculate total score and grade
    const totalScore = calculateTotalScore({
      midterm,
      final,
      assignment,
      quiz,
      participation,
      project,
      daily
    });

    let gradeInfo = null;
    if (totalScore !== null) {
      gradeInfo = calculateGradeAndPoint(totalScore);
    }

    const grade = await prisma.grade.create({
      data: {
        studentId,
        subjectId,
        semesterId,
        classId,
        midterm: midterm ? parseFloat(midterm) : null,
        final: final ? parseFloat(final) : null,
        assignment: assignment ? parseFloat(assignment) : null,
        quiz: quiz ? parseFloat(quiz) : null,
        participation: participation ? parseFloat(participation) : null,
        project: project ? parseFloat(project) : null,
        daily: daily ? parseFloat(daily) : null,
        total: totalScore ? parseFloat(totalScore.toFixed(2)) : null,
        grade: gradeInfo?.grade || null,
        point: gradeInfo?.point || null,
        akhlak,
        quranMemory,
        notes,
        enteredBy: session.user?.id,
        enteredAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            nis: true,
            fullName: true,
            photo: true,
          },
        },
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            nameArabic: true,
            credits: true,
          },
        },
        semester: {
          select: {
            id: true,
            name: true,
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(grade, { status: 201 });
  } catch (error) {
    console.error('Error creating grade:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Grade already exists for this student, subject, and semester' },
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
      midterm,
      final,
      assignment,
      quiz,
      participation,
      project,
      daily,
      akhlak,
      quranMemory,
      notes
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Grade ID is required' },
        { status: 400 }
      );
    }

    // Check if grade is locked
    const existingGrade = await prisma.grade.findUnique({
      where: { id },
      select: { isLocked: true },
    });

    if (!existingGrade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      );
    }

    if (existingGrade.isLocked) {
      return NextResponse.json(
        { error: 'Cannot modify locked grade' },
        { status: 409 }
      );
    }

    // Calculate total score and grade
    const totalScore = calculateTotalScore({
      midterm,
      final,
      assignment,
      quiz,
      participation,
      project,
      daily
    });

    let gradeInfo = null;
    if (totalScore !== null) {
      gradeInfo = calculateGradeAndPoint(totalScore);
    }

    const grade = await prisma.grade.update({
      where: { id },
      data: {
        midterm: midterm ? parseFloat(midterm) : null,
        final: final ? parseFloat(final) : null,
        assignment: assignment ? parseFloat(assignment) : null,
        quiz: quiz ? parseFloat(quiz) : null,
        participation: participation ? parseFloat(participation) : null,
        project: project ? parseFloat(project) : null,
        daily: daily ? parseFloat(daily) : null,
        total: totalScore ? parseFloat(totalScore.toFixed(2)) : null,
        grade: gradeInfo?.grade || null,
        point: gradeInfo?.point || null,
        akhlak,
        quranMemory,
        notes,
        enteredBy: session.user?.id,
        enteredAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            nis: true,
            fullName: true,
            photo: true,
          },
        },
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            nameArabic: true,
            credits: true,
          },
        },
        semester: {
          select: {
            id: true,
            name: true,
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(grade);
  } catch (error) {
    console.error('Error updating grade:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Grade not found' },
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
        { error: 'Grade ID is required' },
        { status: 400 }
      );
    }

    // Check if grade is locked
    const grade = await prisma.grade.findUnique({
      where: { id },
      select: { isLocked: true },
    });

    if (!grade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      );
    }

    if (grade.isLocked) {
      return NextResponse.json(
        { error: 'Cannot delete locked grade' },
        { status: 409 }
      );
    }

    await prisma.grade.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Error deleting grade:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}