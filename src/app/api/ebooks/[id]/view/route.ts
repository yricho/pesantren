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
        viewCount: {
          increment: 1,
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    );
  }
}