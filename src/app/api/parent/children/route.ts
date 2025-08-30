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

    const userId = session.user.id;

    // Get parent account with children
    const parentAccount = await prisma.parentAccount.findUnique({
      where: { userId },
      include: {
        parentStudents: {
          include: {
            student: {
              include: {
                studentClasses: {
                  where: {
                    status: 'ACTIVE'
                  },
                  include: {
                    class: {
                      include: {
                        academicYear: {
                          select: {
                            name: true,
                            isActive: true
                          }
                        },
                        teacher: {
                          select: {
                            name: true,
                            email: true
                          }
                        }
                      }
                    }
                  }
                },
                grades: {
                  include: {
                    semester: {
                      include: {
                        academicYear: {
                          select: { name: true }
                        }
                      }
                    },
                    subject: {
                      select: {
                        name: true,
                        code: true,
                        category: true
                      }
                    }
                  }
                },
                attendances: {
                  include: {
                    semester: true
                  }
                },
                payments: {
                  where: {
                    createdAt: {
                      gte: new Date(new Date().getFullYear(), 0, 1), // Current year
                    }
                  },
                  orderBy: { createdAt: 'desc' },
                  take: 10
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

    // Get current semester for calculations
    const currentSemester = await prisma.semester.findFirst({
      where: { isActive: true }
    });

    const children = parentAccount.parentStudents.map((parentStudent: { student: any; relationship: string; isPrimary: boolean; canViewGrades: boolean; canViewAttendance: boolean; canViewPayments: boolean; canReceiveMessages: boolean }) => {
      const student = parentStudent.student;
      
      // Calculate current attendance stats
      const currentAttendances = student.attendances.filter(
        (att: { semesterId: string; status: string; semester: { isActive: boolean } }) => 
          currentSemester && 
          att.semesterId === currentSemester.id &&
          att.semester.isActive
      );
      
      const attendanceStats = {
        totalDays: currentAttendances.length,
        presentDays: currentAttendances.filter((att: { status: string }) => att.status === 'HADIR').length,
        absentDays: currentAttendances.filter((att: { status: string }) => att.status === 'ALPHA').length,
        sickDays: currentAttendances.filter((att: { status: string }) => att.status === 'SAKIT').length,
        permittedDays: currentAttendances.filter((att: { status: string }) => att.status === 'IZIN').length,
        lateDays: currentAttendances.filter((att: { status: string }) => att.status === 'TERLAMBAT').length,
        percentage: currentAttendances.length > 0 
          ? Math.round((currentAttendances.filter((att: { status: string }) => att.status === 'HADIR').length / currentAttendances.length) * 100)
          : 0
      };

      // Calculate current semester grades
      const currentGrades = student.grades.filter(
        (grade: { semesterId: string; total: any; semester: { isActive: boolean } }) => 
          currentSemester && 
          grade.semesterId === currentSemester.id && 
          grade.total &&
          grade.semester.isActive
      );

      const gradeStats = {
        totalSubjects: currentGrades.length,
        average: currentGrades.length > 0 
          ? Math.round(currentGrades.reduce((sum: number, grade: { total: { toNumber(): number } }) => sum + (grade.total?.toNumber() || 0), 0) / currentGrades.length * 100) / 100
          : 0,
        subjects: currentGrades.map((grade: { subject: { name: string; code: string; category: string }; total: { toNumber(): number }; grade: string; point: { toNumber(): number } }) => ({
          name: grade.subject.name,
          code: grade.subject.code,
          category: grade.subject.category,
          score: grade.total?.toNumber(),
          grade: grade.grade,
          point: grade.point?.toNumber()
        }))
      };

      // Calculate payment stats
      const paymentStats = {
        totalAmount: student.payments.reduce((sum: number, payment: { amount: { toNumber(): number } }) => sum + payment.amount.toNumber(), 0),
        paidAmount: student.payments
          .filter((payment: { status: string }) => payment.status === 'SUCCESS')
          .reduce((sum: number, payment: { amount: { toNumber(): number } }) => sum + payment.amount.toNumber(), 0),
        pendingAmount: student.payments
          .filter((payment: { status: string }) => payment.status === 'PENDING')
          .reduce((sum: number, payment: { amount: { toNumber(): number } }) => sum + payment.amount.toNumber(), 0),
        pendingCount: student.payments.filter((payment: { status: string }) => payment.status === 'PENDING').length,
        recentPayments: student.payments.slice(0, 3).map((payment: { id: string; paymentType: string; amount: { toNumber(): number }; status: string; createdAt: Date }) => ({
          id: payment.id,
          type: payment.paymentType,
          amount: payment.amount.toNumber(),
          status: payment.status,
          date: payment.createdAt
        }))
      };

      // Get current class info
      const currentClass = student.studentClasses.find((sc: { status: string; class: { academicYear: { isActive: boolean } } }) => 
        sc.status === 'ACTIVE' && sc.class.academicYear.isActive
      );

      return {
        id: student.id,
        nis: student.nis,
        fullName: student.fullName,
        nickname: student.nickname,
        photo: student.photo,
        institutionType: student.institutionType,
        grade: student.grade,
        status: student.status,
        enrollmentYear: student.enrollmentYear,
        enrollmentDate: student.enrollmentDate,
        relationship: parentStudent.relationship,
        isPrimary: parentStudent.isPrimary,
        canViewGrades: parentStudent.canViewGrades,
        canViewAttendance: parentStudent.canViewAttendance,
        canViewPayments: parentStudent.canViewPayments,
        canReceiveMessages: parentStudent.canReceiveMessages,
        currentClass: currentClass ? {
          id: currentClass.class.id,
          name: currentClass.class.name,
          level: currentClass.class.level,
          program: currentClass.class.program,
          room: currentClass.class.room,
          teacher: currentClass.class.teacher,
          academicYear: currentClass.class.academicYear.name,
          rollNumber: currentClass.rollNumber
        } : null,
        attendance: attendanceStats,
        grades: gradeStats,
        payments: paymentStats
      };
    });

    return NextResponse.json({
      parentInfo: {
        id: parentAccount.id,
        phoneNumber: parentAccount.phoneNumber,
        whatsapp: parentAccount.whatsapp,
        emergencyContact: parentAccount.emergencyContact,
        preferredLanguage: parentAccount.preferredLanguage
      },
      children,
      totalChildren: children.length,
      currentSemester: currentSemester ? {
        id: currentSemester.id,
        name: currentSemester.name,
        startDate: currentSemester.startDate,
        endDate: currentSemester.endDate
      } : null
    });
    
  } catch (error) {
    console.error('Error fetching parent children:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}