import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {admin} from "better-auth/plugins"
import prisma from './prisma';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",

        

    }),
    plugins: [admin()],

    user: {
        additionalFields: {
            appRole: {
                type: "string",
                required: false,
                defaultValue: "STUDENT",
                input: false, // Bloqueia o usuário de definir o próprio cargo no cadastro público
            },
        },
    },
    

    trustedOrigins: [process.env.FRONTEND_ORIGIN || "*", "http://localhost:3000"],
    advanced: {
        disableOriginCheck: true,
    },
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: { enabled: true },
});