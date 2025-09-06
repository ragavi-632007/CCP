// No type import needed for Vercel API routes
import { storage } from "./storage";
import { hashPassword } from "./auth";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const {
    email,
    password,
    firstName,
    lastName,
    username,
    phone,
    preferredLanguage,
  } = req.body;
  const existingUser = await storage.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const existingUsername = await storage.getUserByUsername(username);
  if (existingUsername) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const user = await storage.createUser({
    email,
    username,
    firstName,
    lastName,
    phone,
    password: await hashPassword(password),
    preferredLanguage: preferredLanguage || "en",
  });
  // TODO: Set a session or JWT here for authentication
  res.status(201).json(user);
}
