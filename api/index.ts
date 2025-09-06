import express from "express";
import serverless from "serverless-http";
import { setupRoutes } from "./routes";

const app = express();
app.use(express.json());

// Setup all routes including authentication
try {
  setupRoutes(app);
  console.log("Routes setup successfully");
} catch (error) {
  console.error("Failed to setup routes:", error);
  throw error;
}

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Global error handler:", err);
  console.error("Error stack:", err.stack);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ 
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export default serverless(app);
