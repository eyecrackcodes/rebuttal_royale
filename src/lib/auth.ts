import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UserRole, UserProfile } from "@/types/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Set default role for new users
        token.role = {
          role: 'trainee',
          level: 'beginner'
        } as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
};

// Helper functions for auth
export function getUserLevel(user: UserProfile | null): 'beginner' | 'intermediate' | 'advanced' {
  return user?.role?.level || 'beginner';
}

export function canAccessLevel(
  user: UserProfile | null, 
  targetLevel: 'beginner' | 'intermediate' | 'advanced'
): boolean {
  const currentLevel = getUserLevel(user);
  const levels = ['beginner', 'intermediate', 'advanced'];
  return levels.indexOf(currentLevel) >= levels.indexOf(targetLevel);
} 