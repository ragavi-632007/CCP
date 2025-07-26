import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertForumPostSchema, insertForumCommentSchema, insertFeedbackSchema } from "@shared/schema";

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

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Modules routes
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.get("/api/modules/:id", async (req, res) => {
    try {
      const module = await storage.getModule(req.params.id);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch module" });
    }
  });

  // Forum routes
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const category = req.query.category as string;
      const posts = await storage.getForumPosts(category);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum posts" });
    }
  });

  app.post("/api/forum/posts", requireAuth, async (req, res) => {
    try {
      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid forum post data" });
    }
  });

  app.get("/api/forum/posts/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getForumComments(req.params.id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/forum/posts/:id/comments", requireAuth, async (req, res) => {
    try {
      const validatedData = insertForumCommentSchema.parse({
        ...req.body,
        postId: req.params.id,
        userId: req.user!.id,
      });
      const comment = await storage.createForumComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  app.post("/api/forum/posts/:id/like", requireAuth, async (req, res) => {
    try {
      await storage.likePost(req.params.id);
      res.json({ message: "Post liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  // Progress routes
  app.get("/api/progress", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.user!.id);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", requireAuth, async (req, res) => {
    try {
      const progress = await storage.updateProgress({
        ...req.body,
        userId: req.user!.id,
      });
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Feedback routes
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(400).json({ message: "Invalid feedback data" });
    }
  });

  // Government schemes
  app.get("/api/schemes", async (req, res) => {
    try {
      const schemes = await storage.getGovernmentSchemes();
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/feedback", requireAdmin, async (req, res) => {
    try {
      const feedback = await storage.getFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // External API proxies (for government data)
  app.get("/api/market-prices", async (req, res) => {
    try {
      // Mock data for now - in real implementation, fetch from data.gov.in APIs
      const marketPrices = [
        {
          commodity: "Rice",
          market: "Chennai",
          price: 2850,
          change: 50,
          lastUpdated: new Date().toISOString(),
        },
        {
          commodity: "Tomato",
          market: "Coimbatore",
          price: 3200,
          change: -150,
          lastUpdated: new Date().toISOString(),
        },
        {
          commodity: "Maize",
          market: "Salem",
          price: 1950,
          change: 0,
          lastUpdated: new Date().toISOString(),
        },
      ];
      res.json(marketPrices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market prices" });
    }
  });

  app.get("/api/weather", async (req, res) => {
    try {
      // Mock weather data - in real implementation, fetch from weather APIs
      const weather = {
        current: {
          temperature: 28,
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 12,
          pressure: 1013,
          visibility: 10,
        },
        forecast: [
          { day: "Today", rainfall: 15, chance: 70, icon: "cloud-rain" },
          { day: "Tomorrow", rainfall: 2, chance: 20, icon: "sun" },
          { day: "Wednesday", rainfall: 8, chance: 45, icon: "cloud" },
        ],
      };
      res.json(weather);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
