import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active') === 'true'

    const where: any = {}
    if (active) {
      where.isActive = true
    }

    const categories = await prisma.donationCategory.findMany({
      where,
      include: {
        _count: {
          select: {
            campaigns: true,
            donations: {
              where: { paymentStatus: 'VERIFIED' }
            }
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching donation categories:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil kategori donasi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, icon, color, sortOrder = 0 } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Nama kategori harus diisi' },
        { status: 400 }
      )
    }

    // Check if category name already exists
    const existingCategory = await prisma.donationCategory.findUnique({
      where: { name }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Nama kategori sudah ada' },
        { status: 400 }
      )
    }

    const category = await prisma.donationCategory.create({
      data: {
        name,
        description: description || null,
        icon: icon || null,
        color: color || null,
        sortOrder,
        isActive: true
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating donation category:', error)
    return NextResponse.json(
      { error: 'Gagal membuat kategori donasi' },
      { status: 500 }
    )
  }
}