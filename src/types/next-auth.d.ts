import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { User, UserRole } from "@prisma/client";

declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		/** OpenID ID Token */
		// idToken?: string;
		role: UserRole;
	}
}

declare module "next-auth" {
	interface Session {
		user: User & {
			role: UserRole;
			userId: string;
		};
	}
}
