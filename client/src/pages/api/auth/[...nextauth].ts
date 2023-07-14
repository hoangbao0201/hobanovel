// import NextAuth, { Session, User } from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import FacebookProvider from "next-auth/providers/facebook";
// import GoogleProvider from "next-auth/providers/google";

// interface CustomUser extends User {
//     tokenCv?: string;
// }

// export default NextAuth({
//     providers: [
//         GithubProvider({
//             clientId: "4523926d484d11d47436",
//             clientSecret: "51f34193e205f06c1f8c462caaf28660f8281fc0",
//         }),
//         FacebookProvider({
//             clientId: "1130584121043505",
//             clientSecret: "234525da06e202a238b8cd313770de8f",
//         }),
//         GoogleProvider({
//             clientId:
//                 "377296193685-2f90ipkk132sa8r2aiuuq357id7bee29.apps.googleusercontent.com",
//             clientSecret: "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",
//         }),
//     ],

//     secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET as string,

//     callbacks: {
//     },

// });
