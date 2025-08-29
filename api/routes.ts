import type { Express } from "express";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import {
  insertForumPostSchema,
  insertForumCommentSchema,
  insertFeedbackSchema,
} from "@shared/schema";

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export function setupRoutes(app: Express) {
  setupAuth(app);

  // Modules routes
  app.get("/modules", async (req, res) => {
    try {
      let modules = await storage.getModules();

      // Add default modules if none exist
      if (modules.length === 0) {
        const defaultModules = [
          {
            title: "Digital Banking Basics",
            titleTamil: "டிஜிட்டல் வங்கி அடிப்படைகள்",
            description:
              "Learn about online banking, UPI payments, and digital financial services",
            descriptionTamil:
              "ஆன்லைன் வங்கி, UPI பணம் செலுத்துதல் மற்றும் டிஜிட்டல் நிதி சேவைகள் பற்றி அறியுங்கள்",
            category: "banking",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            downloadUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: 300,
            level: "beginner",
          },
          // ...other default modules...
        ];

        for (const moduleData of defaultModules) {
          await storage.createModule(moduleData);
        }

        modules = await storage.getModules();
      }

      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  // TODO: Add other routes here (forum posts, comments, feedback, etc.)

  // No need for createServer() in serverless
}
