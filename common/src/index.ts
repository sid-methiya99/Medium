import zod from "zod";

export const signUpSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
  name: zod.string().optional(),
});

export const signInSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

export const createBlog = zod.object({
  title: zod.string(),
  content: zod.string(),
});

export const updateBlog = zod.object({
  id: zod.string(),
  title: zod.string().optional(),
  content: zod.string().optional(),
});

export type SignUpInput = zod.infer<typeof signUpSchema>;
export type SignInInput = zod.infer<typeof signInSchema>;
export type createBlogInput = zod.infer<typeof createBlog>;
export type updateBlogInput = zod.infer<typeof updateBlog>;
