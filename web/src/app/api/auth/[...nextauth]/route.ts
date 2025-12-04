import NextAuth from "next-auth/next";
import { authOptions } from "../__nextauth/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
