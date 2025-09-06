// No type import needed for Vercel API routes
import { storage } from "./storage";
import { comparePasswords } from "./auth";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { email, password } = req.body;
  const user = await storage.getUserByEmail(email);
  if (!user || !(await comparePasswords(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // TODO: Set a session or JWT here for authentication
  res.status(200).json(user);
}
