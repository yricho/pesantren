import { authOptions } from '@/lib/auth'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Disable static generation for auth routes
export const dynamic = 'force-dynamic'