import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string; // Custom variable type for userId
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const header = c.req.header("Authorization") || "";

  if (!header.startsWith("Bearer ")) {
    return c.text("Authorization header is missing or invalid", 411);
  }

  const token = header.split(" ")[1]; // Correctly split the Bearer token
  try {
    const verifyToken = await verify(token, c.env.JWT_SECRET); // Verify the JWT
    if (!verifyToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const userId = verifyToken.id ? String(verifyToken.id) : "";
    // Set the userId into Variables for downstream access
    c.set("userId", userId);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
});
//Route for creating blog
blogRouter.post("/1", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const id = c.get("userId");
  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: id,
    },
  });

  return c.json({
    id: blog.id,
  });
});
// Route for updating blog
blogRouter.put("/update", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const id = c.get("userId");

  const updateBlog = await prisma.post.update({
    where: {
      id: body.id,
      authorId: id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.text("Updated Blog!", 200);
});
// Learned something interesting that params id should be followed by simple get method only
blogRouter.get("/get", async (c) => {
    console.log("Hello");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    console.log("Hello2");
    try {
        const allPosts = await prisma.post.findMany({});
        console.log(allPosts)
        return c.json(allPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

blogRouter.get("/:id", async (c) => {
    const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  return c.json({post});
});

