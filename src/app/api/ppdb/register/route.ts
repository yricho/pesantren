import { NextRequest, NextResponse } from 'next/server';

// Generate registration number
function generateRegistrationNo(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `PPDB-${year}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { default: prisma } = await import('@/lib/prisma');
    
    // Generate unique registration number
    let registrationNo = generateRegistrationNo();
    let exists = await prisma.registration.findUnique({
      where: { registrationNo }
    });
    
    while (exists) {
      registrationNo = generateRegistrationNo();
      exists = await prisma.registration.findUnique({
        where: { registrationNo }
      });
    }
    
    // Create registration
    const registration = await prisma.registration.create({
      data: {
        registrationNo,
        ...body,
        birthDate: new Date(body.birthDate),
        documents: JSON.stringify(body.documents || []),
        status: 'DRAFT'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: registration,
      message: 'Pendaftaran berhasil dibuat'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal membuat pendaftaran',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { default: prisma } = await import('@/lib/prisma');
    
    const registrationNo = searchParams.get('registrationNo');
    const status = searchParams.get('status');
    const level = searchParams.get('level');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    if (registrationNo) where.registrationNo = registrationNo;
    if (status) where.status = status;
    if (level) where.level = level;
    
    // Get registrations with pagination
    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          payments: {
            orderBy: { createdAt: 'desc' }
          }
        }
      }),
      prisma.registration.count({ where })
    ]);
    
    // Parse JSON fields
    const parsedRegistrations = registrations.map(reg => ({
      ...reg,
      documents: JSON.parse(reg.documents),
      testScore: reg.testScore ? JSON.parse(reg.testScore) : null
    }));
    
    return NextResponse.json({
      success: true,
      data: parsedRegistrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data pendaftaran' 
      },
      { status: 500 }
    );
  }
}