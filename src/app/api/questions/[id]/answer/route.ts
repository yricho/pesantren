import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const prisma = new PrismaClient()

const answerSchema = z.object({
  answer: z.string().min(10, 'Jawaban minimal 10 karakter').max(5000, 'Jawaban maksimal 5000 karakter')
})

// Submit answer to a question
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Please login first.'
      }, { status: 401 })
    }
    
    // Check if user is ustadz
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, isUstadz: true, name: true }
    })
    
    if (!user || (!user.isUstadz && !['ADMIN', 'SUPER_ADMIN'].includes(user.role))) {
      return NextResponse.json({
        success: false,
        message: 'Forbidden. Only ustadz can answer questions.'
      }, { status: 403 })
    }
    
    // Parse request body
    const body = await request.json()
    const validatedData = answerSchema.parse(body)
    
    // Check if question exists and is still pending
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: { answer: true }
    })
    
    if (!question) {
      return NextResponse.json({
        success: false,
        message: 'Pertanyaan tidak ditemukan'
      }, { status: 404 })
    }
    
    if (question.answer) {
      return NextResponse.json({
        success: false,
        message: 'Pertanyaan sudah dijawab. Gunakan endpoint PUT untuk mengedit jawaban.'
      }, { status: 409 })
    }
    
    // Create answer and update question status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the answer
      const answer = await tx.answer.create({
        data: {
          questionId: params.id,
          ustadzId: user.id,
          answer: validatedData.answer.trim()
        },
        include: {
          ustadz: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
      
      // Update question status to answered
      await tx.question.update({
        where: { id: params.id },
        data: { 
          status: 'answered',
          updatedAt: new Date()
        }
      })
      
      return answer
    })
    
    return NextResponse.json({
      success: true,
      message: 'Jawaban berhasil disimpan',
      data: {
        id: result.id,
        answer: result.answer,
        ustadz: result.ustadz,
        createdAt: result.createdAt
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error submitting answer:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Data tidak valid',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat menyimpan jawaban'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Update existing answer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Please login first.'
      }, { status: 401 })
    }
    
    // Check if user is ustadz
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, isUstadz: true, name: true }
    })
    
    if (!user || (!user.isUstadz && !['ADMIN', 'SUPER_ADMIN'].includes(user.role))) {
      return NextResponse.json({
        success: false,
        message: 'Forbidden. Only ustadz can edit answers.'
      }, { status: 403 })
    }
    
    // Parse request body
    const body = await request.json()
    const validatedData = answerSchema.parse(body)
    
    // Check if question exists and has an answer
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: { 
        answer: {
          include: {
            ustadz: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    
    if (!question) {
      return NextResponse.json({
        success: false,
        message: 'Pertanyaan tidak ditemukan'
      }, { status: 404 })
    }
    
    if (!question.answer) {
      return NextResponse.json({
        success: false,
        message: 'Pertanyaan belum dijawab. Gunakan endpoint POST untuk membuat jawaban.'
      }, { status: 404 })
    }
    
    // Only allow the original answerer or admin to edit
    if (question.answer.ustadzId !== user.id && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({
        success: false,
        message: 'Forbidden. You can only edit your own answers.'
      }, { status: 403 })
    }
    
    // Update the answer
    const updatedAnswer = await prisma.answer.update({
      where: { id: question.answer.id },
      data: {
        answer: validatedData.answer.trim(),
        updatedAt: new Date()
      },
      include: {
        ustadz: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    
    // Also update question's updatedAt
    await prisma.question.update({
      where: { id: params.id },
      data: { updatedAt: new Date() }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Jawaban berhasil diperbarui',
      data: {
        id: updatedAnswer.id,
        answer: updatedAnswer.answer,
        ustadz: updatedAnswer.ustadz,
        createdAt: updatedAnswer.createdAt,
        updatedAt: updatedAnswer.updatedAt
      }
    })
    
  } catch (error) {
    console.error('Error updating answer:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Data tidak valid',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui jawaban'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Get specific question with answer (for ustadz to view details)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Please login first.'
      }, { status: 401 })
    }
    
    // Check if user is ustadz
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, isUstadz: true }
    })
    
    if (!user || (!user.isUstadz && !['ADMIN', 'SUPER_ADMIN'].includes(user.role))) {
      return NextResponse.json({
        success: false,
        message: 'Forbidden. Only ustadz can access this resource.'
      }, { status: 403 })
    }
    
    // Get question with answer
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        answer: {
          include: {
            ustadz: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    
    if (!question) {
      return NextResponse.json({
        success: false,
        message: 'Pertanyaan tidak ditemukan'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: question.id,
        question: question.question,
        category: question.category,
        askerName: question.isAnonymous ? 'Anonim' : (question.askerName || 'Anonim'),
        isAnonymous: question.isAnonymous,
        status: question.status,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        answer: question.answer ? {
          id: question.answer.id,
          answer: question.answer.answer,
          ustadz: question.answer.ustadz,
          createdAt: question.answer.createdAt,
          updatedAt: question.answer.updatedAt
        } : null
      }
    })
    
  } catch (error) {
    console.error('Error fetching question details:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil detail pertanyaan'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}