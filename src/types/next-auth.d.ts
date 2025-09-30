import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    username: string
    email: string
    name: string
    role: string
    isUstadz: boolean
    requires2FA?: boolean
  }

  interface Session {
    user: {
      id: string
      username?: string
      role?: string
      isUstadz?: boolean
      requires2FA?: boolean
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    username?: string
    isUstadz?: boolean
    requires2FA?: boolean
  }
}