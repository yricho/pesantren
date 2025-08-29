import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ebook.update({
      where: {
        id: params.id,
      },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating download count:', error);
    return NextResponse.json(
      { error: 'Failed to update download count' },
      { status: 500 }
    );
  }
}