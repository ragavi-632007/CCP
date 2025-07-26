import { 
  users, 
  modules, 
  forumPosts, 
  forumComments, 
  feedback, 
  userProgress, 
  governmentSchemes,
  type User, 
  type InsertUser,
  type Module,
  type InsertModule,
  type ForumPost,
  type InsertForumPost,
  type ForumComment,
  type InsertForumComment,
  type Feedback,
  type InsertFeedback,
  type UserProgress,
  type InsertUserProgress,
  type GovernmentScheme,
  type InsertGovernmentScheme
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Module methods
  getModules(): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  
  // Forum methods
  getForumPosts(category?: string): Promise<Array<ForumPost & { author: User }>>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumComments(postId: string): Promise<Array<ForumComment & { author: User }>>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  likePost(postId: string): Promise<void>;
  
  // Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Feedback methods
  getFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  
  // Government schemes
  getGovernmentSchemes(): Promise<GovernmentScheme[]>;
  createGovernmentScheme(scheme: InsertGovernmentScheme): Promise<GovernmentScheme>;
  
  // Admin methods
  getAdminStats(): Promise<any>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: "session"
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getModules(): Promise<Module[]> {
    return await db
      .select()
      .from(modules)
      .where(eq(modules.isActive, true))
      .orderBy(modules.createdAt);
  }

  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module || undefined;
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db
      .insert(modules)
      .values(insertModule)
      .returning();
    return module;
  }

  async getForumPosts(category?: string): Promise<Array<ForumPost & { author: User }>> {
    const query = db
      .select({
        id: forumPosts.id,
        userId: forumPosts.userId,
        title: forumPosts.title,
        content: forumPosts.content,
        category: forumPosts.category,
        likes: forumPosts.likes,
        createdAt: forumPosts.createdAt,
        author: users,
      })
      .from(forumPosts)
      .innerJoin(users, eq(forumPosts.userId, users.id))
      .orderBy(desc(forumPosts.createdAt));

    if (category) {
      return await query.where(eq(forumPosts.category, category));
    }

    return await query;
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post || undefined;
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const [post] = await db
      .insert(forumPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async getForumComments(postId: string): Promise<Array<ForumComment & { author: User }>> {
    return await db
      .select({
        id: forumComments.id,
        postId: forumComments.postId,
        userId: forumComments.userId,
        content: forumComments.content,
        createdAt: forumComments.createdAt,
        author: users,
      })
      .from(forumComments)
      .innerJoin(users, eq(forumComments.userId, users.id))
      .where(eq(forumComments.postId, postId))
      .orderBy(forumComments.createdAt);
  }

  async createForumComment(insertComment: InsertForumComment): Promise<ForumComment> {
    const [comment] = await db
      .insert(forumComments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async likePost(postId: string): Promise<void> {
    await db
      .update(forumPosts)
      .set({ likes: sql`${forumPosts.likes} + 1` })
      .where(eq(forumPosts.id, postId));
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async updateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, insertProgress.userId!),
          eq(userProgress.moduleId, insertProgress.moduleId!)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProgress)
        .set(insertProgress)
        .where(eq(userProgress.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userProgress)
        .values(insertProgress)
        .returning();
      return created;
    }
  }

  async getFeedback(): Promise<Feedback[]> {
    return await db
      .select()
      .from(feedback)
      .orderBy(desc(feedback.createdAt));
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedbackItem] = await db
      .insert(feedback)
      .values(insertFeedback)
      .returning();
    return feedbackItem;
  }

  async getGovernmentSchemes(): Promise<GovernmentScheme[]> {
    return await db
      .select()
      .from(governmentSchemes)
      .where(eq(governmentSchemes.status, "active"))
      .orderBy(desc(governmentSchemes.lastUpdated));
  }

  async createGovernmentScheme(insertScheme: InsertGovernmentScheme): Promise<GovernmentScheme> {
    const [scheme] = await db
      .insert(governmentSchemes)
      .values(insertScheme)
      .returning();
    return scheme;
  }

  async getAdminStats(): Promise<any> {
    const [totalUsers] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    const [totalModules] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(modules);

    const [totalPosts] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(forumPosts);

    const [totalFeedback] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(feedback);

    const [completedModules] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userProgress)
      .where(eq(userProgress.completed, true));

    return {
      totalUsers: totalUsers.count,
      totalModules: totalModules.count,
      totalPosts: totalPosts.count,
      totalFeedback: totalFeedback.count,
      completedModules: completedModules.count,
    };
  }
}

export const storage = new DatabaseStorage();
