import z from "zod";


export const vaultItemSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).max(20, { message: "Title must be less than 20 characters" }),
    category: z.enum(["Social Media", "Utils", "Bank", "Email", "Others", "Documents"], { message: "Please select a category" }),
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    website: z.string()
})

export type vaultItemType = z.infer<typeof vaultItemSchema>