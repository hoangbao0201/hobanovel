import NextAuth, { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";


export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET as string,
        }),
        FacebookProvider({
            clientId: process.env.NEXT_PUBLIC_FACEBOOK_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET as string,
        }),
    ],

    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET as string,

    pages: {
        signIn: "/",
        error: "/api/auth/login",
    },

    callbacks: {
        async session({ session, user, token }) {
            // if (session.user && session.user.email && session.user.name && session.user.image) {
            //     const dataReq = {
            //         name: user.name as string,
            //         username: user.email.split("@")[0],
            //         email: user.email,
            //         avatarUrl: user.image as string,
            //         token: token
            //     }
            //     const userRes = await checkExistUserByAccoutHandle(dataReq);

            //     if (userRes.success) {
            //         return {
            //             ...session,
            //             success: true,
            //             data: userRes
            //             // token: userRes.token,
            //         };
            //     }
            // }

            return {
                ...session,
                success: false,
                token: token
            };
        },

    },
});
