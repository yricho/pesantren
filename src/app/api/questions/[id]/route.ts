import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET single question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      data: question
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pertanyaan'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE question (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Login required'
      }, { status: 401 })
    }
    
    // Check if user is admin or superadmin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Forbidden - Admin access required'
      }, { status: 403 })
    }
    
    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        answer: true
      }
    })
    
    if (!question) {
      return NextResponse.json({
        success: false,
        message: 'Pertanyaan tidak ditemukan'
      }, { status: 404 })
    }
    
    // Delete the question (this will cascade delete the answer if exists)
    await prisma.question.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Pertanyaan berhasil dihapus',
      data: {
        deletedId: params.id,
        hadAnswer: !!question.answer
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error deleting question:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus pertanyaan'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// For CORS support if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}