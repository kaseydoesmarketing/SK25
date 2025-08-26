import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    isPro?: boolean;
    usageMinutes?: number;
    stripeCustomerId?: string;
  }

  interface Session {
    user: User & {
      id: string;
      isPro?: boolean;
      usageMinutes?: number;
      stripeCustomerId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isPro?: boolean;
    usageMinutes?: number;
    stripeCustomerId?: string;
  }
}