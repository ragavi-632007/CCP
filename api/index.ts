import express from "express";
import serverless from "serverless-http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import {
  insertForumPostSchema,
  insertForumCommentSchema,
  insertFeedbackSchema,
} from "@shared/schema";

const app = express();
app.use(express.json());

// Setup authentication (register, login, logout, user)
setupAuth(app);

// Example route: modules
app.get("/modules", async (req, res) => {
  try {
    let modules = await storage.getModules();

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
      ];

      for (const moduleData of defaultModules) {
        await storage.createModule(moduleData);
      }

      modules = await storage.getModules();
    }

    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch modules" });
  }
});

// TODO: Add forum, feedback, storage, cite routes here

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default serverless(app);
