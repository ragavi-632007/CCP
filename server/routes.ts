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
      let modules = await storage.getModules();
      
      // Add default modules if none exist
      if (modules.length === 0) {
        const defaultModules = [
          {
            title: "Digital Banking Basics",
            titleTamil: "டிஜிட்டல் வங்கி அடிப்படைகள்",
            description: "Learn about online banking, UPI payments, and digital financial services",
            descriptionTamil: "ஆன்லைன் வங்கி, UPI பணம் செலுத்துதல் மற்றும் டிஜிட்டல் நிதி சேவைகளைப் பற்றி அறியுங்கள்",
            category: "banking",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            downloadUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: 300,
            level: "beginner"
          },
          {
            title: "Government Schemes Overview",
            titleTamil: "அரசு திட்டங்கள் கண்ணோட்டம்",
            description: "Understanding PM-KISAN, Ayushman Bharat, and other welfare schemes",
            descriptionTamil: "PM-KISAN, ஆயுஷ்மான் பாரத் மற்றும் பிற நலன் திட்டங்களைப் புரிந்துகொள்ளுதல்",
            category: "government",
            videoUrl: "https://sample-videos.com/zip/10/mp4/mp4-1920x1080.mp4",
            downloadUrl: "https://sample-videos.com/zip/10/mp4/mp4-1920x1080.mp4",
            duration: 450,
            level: "beginner"
          },
          {
            title: "Modern Farming Techniques",
            titleTamil: "நவீன விவசாய நுட்பங்கள்",
            description: "Learn about organic farming, crop rotation, and sustainable agriculture",
            descriptionTamil: "இயற்கை விவசாயம், பயிர் சுழற்சி மற்றும் நிலையான விவசாயம் பற்றி அறியுங்கள்",
            category: "agriculture",
            videoUrl: "https://sample-videos.com/zip/10/mp4/mp4-1920x1080.mp4",
            downloadUrl: "https://sample-videos.com/zip/10/mp4/mp4-1920x1080.mp4",
            duration: 600,
            level: "intermediate"
          },
          {
            title: "Healthcare Access and Rights",
            titleTamil: "சுகாதார அணுகல் மற்றும் உரிமைகள்",
            description: "Understanding healthcare schemes, hospital access, and health insurance",
            descriptionTamil: "சுகாதார திட்டங்கள், மருத்துவமனை அணுகல் மற்றும் சுகாதார காப்பீடு பற்றி புரிந்துகொள்ளுதல்",
            category: "health",
            videoUrl: "https://sample-videos.com/zip/10/mp4/mp4-1920x1080.mp4",
            downloadUrl: "https://sample-videos.com/zip/10/mp4/mp4-1920x1080.mp4",
            duration: 420,
            level: "beginner"
          }
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
      let schemes = await storage.getGovernmentSchemes();
      
      // Add default government schemes if none exist
      if (schemes.length === 0) {
        const defaultSchemes = [
          {
            name: "PM-KISAN Samman Nidhi",
            nameTamil: "PM-KISAN सम्मान निधि",
            description: "Financial support of ₹6000 per year to farmer families",
            descriptionTamil: "விவசாயி குடும்பங்களுக்கு ஆண்டுக்கு ₹6000 நிதி உதவி",
            category: "agriculture",
            eligibility: "Small and marginal farmers",
            benefits: "₹2000 every 4 months",
            applicationProcess: "Online through PM-KISAN portal",
            website: "https://pmkisan.gov.in",
            contactNumber: "155261",
            lastUpdated: new Date()
          },
          {
            name: "Ayushman Bharat",
            nameTamil: "ஆயுஷ்மான் பாரத்",
            description: "Health insurance scheme providing coverage up to ₹5 lakh",
            descriptionTamil: "₹5 லட்சம் வரை காப்பீடு வழங்கும் சுகாதார காப்பீட்டு திட்டம்",
            category: "health",
            eligibility: "Poor and vulnerable families",
            benefits: "Free medical treatment up to ₹5 lakh",
            applicationProcess: "Through Common Service Centers",
            website: "https://pmjay.gov.in",
            contactNumber: "14555",
            lastUpdated: new Date()
          },
          {
            name: "Pradhan Mantri Awas Yojana",
            nameTamil: "பிரதான மந்திரி ஆவாஸ் யோஜனா",
            description: "Housing scheme for affordable housing",
            descriptionTamil: "மலிவு விலை வீட்டுத் திட்டம்",
            category: "housing",
            eligibility: "Economically weaker sections",
            benefits: "Subsidy for home construction/purchase",
            applicationProcess: "Online application through official portal",
            website: "https://pmaymis.gov.in",
            contactNumber: "1800-11-6446",
            lastUpdated: new Date()
          },
          {
            name: "Jan Dhan Yojana",
            nameTamil: "ஜன் தன் யோஜனா",
            description: "Financial inclusion program for banking services",
            descriptionTamil: "வங்கி சேவைகளுக்கான நிதி சேர்க்கை திட்டம்",
            category: "banking",
            eligibility: "All Indian citizens",
            benefits: "Zero balance account, RuPay card, insurance",
            applicationProcess: "Visit nearest bank branch",
            website: "https://pmjdy.gov.in",
            contactNumber: "1800-11-0001",
            lastUpdated: new Date()
          },
          {
            name: "Digital India Initiative",
            nameTamil: "டிஜிட்டல் இந்தியா முன்முயற்சி",
            description: "Program to transform India digitally",
            descriptionTamil: "இந்தியாவை டிஜிட்டல் முறையில் மாற்றும் திட்டம்",
            category: "technology",
            eligibility: "All citizens",
            benefits: "Digital services, internet connectivity",
            applicationProcess: "Various online portals",
            website: "https://digitalindia.gov.in",
            contactNumber: "1800-233-1555",
            lastUpdated: new Date()
          }
        ];

        for (const schemeData of defaultSchemes) {
          await storage.createGovernmentScheme(schemeData);
        }
        
        schemes = await storage.getGovernmentSchemes();
      }
      
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch government schemes" });
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
