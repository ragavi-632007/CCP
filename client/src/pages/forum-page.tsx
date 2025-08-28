import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  ThumbsUp,
  MessageCircle,
  Share,
  Video,
  Users,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertForumPostSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

type NewPostForm = z.infer<typeof insertForumPostSchema>;

export default function ForumPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // Google Meet links for each category
  const meetLinks: Record<string, string> = {
    government: "https://meet.google.com/gov-link",
    banking: "https://meet.google.com/bank-link",
    education: "https://meet.google.com/edu-link",
    health: "https://meet.google.com/health-link",
  };

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/forum/posts", selectedCategory],
    queryFn: () =>
      fetch(
        `/api/forum/posts${
          selectedCategory ? `?category=${selectedCategory}` : ""
        }`
      ).then((res) => res.json()),
  });

  const newPostForm = useForm<NewPostForm>({
    resolver: zodResolver(insertForumPostSchema.omit({ userId: true })),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: Omit<NewPostForm, "userId">) => {
      const res = await apiRequest("POST", "/api/forum/posts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      newPostForm.reset();
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      await apiRequest("POST", `/api/forum/posts/${postId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
  });

  const handleCreatePost = (data: Omit<NewPostForm, "userId">) => {
    createPostMutation.mutate(data);
  };

  const handleLikePost = (postId: string) => {
    likePostMutation.mutate(postId);
  };

  const openGoogleMeet = (category: string) => {
    const link = meetLinks[category] || "https://meet.google.com/new";
    window.open(link, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            {t("forum.title")}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t("forum.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Forum Posts */}
          <div className="lg:col-span-2">
            {/* New Post Button */}
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("forum.newPost")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("forum.newPost")}</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={newPostForm.handleSubmit(handleCreatePost)}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="What's your question?"
                        {...newPostForm.register("title")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        onValueChange={(value) =>
                          newPostForm.setValue("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="government">
                            Government Schemes
                          </SelectItem>
                          <SelectItem value="banking">Banking</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Describe your question in detail..."
                        rows={4}
                        {...newPostForm.register("content")}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createPostMutation.isPending}
                    >
                      {createPostMutation.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Post Question
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
              >
                All
              </Button>
              <Button
                variant={
                  selectedCategory === "government" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory("government")}
              >
                Government
              </Button>
              <Button
                variant={selectedCategory === "banking" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("banking")}
              >
                Banking
              </Button>
              <Button
                variant={
                  selectedCategory === "education" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory("education")}
              >
                Education
              </Button>
              <Button
                variant={selectedCategory === "health" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("health")}
              >
                Health
              </Button>
            </div>

            {/* Forum Posts List */}
            <div className="space-y-4">
              {posts?.map((post: any) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                        {post.author.firstName?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-slate-800">
                            {post.author.firstName} {post.author.lastName}
                          </h4>
                          <span className="text-sm text-slate-500">
                            {formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 mb-4">{post.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className="p-0 h-auto"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes} likes
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                          >
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {posts?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">
                  No posts found. Be the first to ask a question!
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Google Meet Integration for each category */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Government Mentor Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-4">
                  Join government mentors for live Q&A sessions.
                </p>
                <Button
                  onClick={() => openGoogleMeet("government")}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Meet
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Banking Mentor Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-4">
                  Join banking mentors for live Q&A sessions.
                </p>
                <Button
                  onClick={() => openGoogleMeet("banking")}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Meet
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Education Mentor Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-4">
                  Join education mentors for live Q&A sessions.
                </p>
                <Button
                  onClick={() => openGoogleMeet("education")}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Meet
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Health Mentor Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-4">
                  Join health mentors for live Q&A sessions.
                </p>
                <Button
                  onClick={() => openGoogleMeet("health")}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Meet
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle>{t("forum.popularTopics")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-slate-600 hover:text-primary transition-colors cursor-pointer">
                    <span>Government Schemes</span>
                    <Badge variant="secondary">142</Badge>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 hover:text-primary transition-colors cursor-pointer">
                    <span>Banking & UPI</span>
                    <Badge variant="secondary">89</Badge>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 hover:text-primary transition-colors cursor-pointer">
                    <span>Crop Prices</span>
                    <Badge variant="secondary">76</Badge>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 hover:text-primary transition-colors cursor-pointer">
                    <span>Health Insurance</span>
                    <Badge variant="secondary">54</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>{t("forum.guidelines")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Be respectful and helpful</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Use clear, simple language</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Share reliable information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Avoid spam or promotional content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
