import type { NextRequest } from 'next/server'

// Create handler with lazy loading to prevent build-time issues
const handler = async (req: NextRequest) => {
  const NextAuth = (await import('next-auth')).default
  const { authOptions } = await import('@/lib/auth')
  
  const authHandler = NextAuth(authOptions)
  // @ts-ignore - NextAuth types
  return authHandler(req)
}

export { handler as GET, handler as POST }

// Force dynamic rendering and disable static optimization
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'