import { config } from "@/config";
import { createDefaultData } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import NextAuth, { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

interface Props {
  user: User | AdapterUser;
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }: Props) {
      const dbUser = await prisma.users.findFirst({
        where: { email: user.email as string },
      });
      if (!dbUser) {
        await createDefaultData(user);
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
