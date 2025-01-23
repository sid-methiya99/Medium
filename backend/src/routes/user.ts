import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

userRouter.post("/signup", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const checkUser = await prisma.user.findFirst({
        where: {
            email: body.email,
        },
    });

    if (checkUser) {
        return c.text("Username already exists", 411);
    }
    try {
        const response = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
            },
        });

        const id = response.id;
        const token = await sign(
            {
                id,
            },
            c.env.JWT_SECRET,
        );
        return c.json({
            token,
        });
    } catch (error) {
        console.log(error);
    }
});

userRouter.post("/signin", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const checkUser = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });

    if (!checkUser) {
        return c.text("Invalid username", 411);
    }
    return c.text("Welcome back user");
});
