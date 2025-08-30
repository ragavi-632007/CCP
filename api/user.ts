// No type import needed for Vercel API routes
import { storage } from "./storage";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  // You may want to check authentication here
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }
  const user = await storage.getUser(id as string);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // TODO: Add authentication check here
  res.status(200).json(user);
}
