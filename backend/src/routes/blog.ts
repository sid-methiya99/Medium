import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

blogRouter.use("/*", async (c, next) => {
    const header = c.req.header("Authorization") || "";
    const token = header.split("")[1];

    if (!header) {
        return c.text("Please add header", 411);
    }
    const verifyToken = await verify(header, c.env.JWT_SECRET);

    if (verifyToken.id) {
        next();
    } else {
        c.status(403);
        return c.json({
            msg: "Unauthorised",
        });
    }
});

blogRouter.post("/", async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    
    const blog  = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: "1"
        }
    })

    return c.json({
        id: blog.id
    })
});

blogRouter.put("/", (c) => {
    return c.text("Hello Hono!");
});

blogRouter.get("/:id", (c) => {
    return c.text("Hello Hono!");
});

blogRouter.post("/bulk", (c) => {
    return c.text("Hello Hono!");
});
