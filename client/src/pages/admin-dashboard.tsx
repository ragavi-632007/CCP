import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Activity, 
  GraduationCap, 
  MessageSquare, 
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: adminStats, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.isAdmin,
  });

  const { data: feedback, isLoading: feedbackLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/feedback"],
    enabled: !!user?.isAdmin,
  });

  // Redirect if not admin
  if (!authLoading && (!user || !user.isAdmin)) {
    return <Redirect to="/" />;
  }

  if (authLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Mock data for demonstration (in real app, this would come from API)
  const recentUsers = [
    { id: "1", name: "John caesar", timeAgo: "2 hours ago", initials: "JD" },
    { id: "2", name: "Sita chandra", timeAgo: "4 hours ago", initials: "SA" },
    { id: "3", name: "Raj Kumar", timeAgo: "6 hours ago", initials: "RK" },
    { id: "4", name: "Priya Devika", timeAgo: "8 hours ago", initials: "PD" },
  ];

  const topModules = [
    { id: "1", name: "Government Schemes", completions: 8450, rate: 94, icon: "🏛️" },
    { id: "2", name: "Banking Basics", completions: 7230, rate: 89, icon: "🏦" },
    { id: "3", name: "Smart Agriculture", completions: 6890, rate: 85, icon: "🌱" },
    { id: "4", name: "Health Insurance", completions: 5640, rate: 78, icon: "🏥" },
  ];

  const systemStatus = [
    { service: "Server Status", status: "online", color: "text-green-600" },
    { service: "Database", status: "connected", color: "text-green-600" },
    { service: "API Services", status: "active", color: "text-green-600" },
    { service: "Storage", status: "78% used", color: "text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-slate-600">Monitor user progress, content performance, and platform analytics</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Admin Stats Grid */}
            <div className="grid lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-primary to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm">Total Users</p>
                      <p className="text-3xl font-bold">{adminStats?.totalUsers?.toLocaleString() || "0"}</p>
                      <p className="text-emerald-100 text-sm">+245 this week</p>
                    </div>
                    <Users className="h-8 w-8 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-secondary to-teal-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-100 text-sm">Active Sessions</p>
                      <p className="text-3xl font-bold">1,247</p>
                      <p className="text-teal-100 text-sm">Currently online</p>
                    </div>
                    <Activity className="h-8 w-8 text-teal-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-accent to-orange-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Module Completions</p>
                      <p className="text-3xl font-bold">{adminStats?.completedModules?.toLocaleString() || "0"}</p>
                      <p className="text-orange-100 text-sm">+1,250 today</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Forum Posts</p>
                      <p className="text-3xl font-bold">{adminStats?.totalPosts?.toLocaleString() || "0"}</p>
                      <p className="text-purple-100 text-sm">+89 today</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    User Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Module Completion Rate</span>
                      <span className="font-medium">73%</span>
                    </div>
                    <Progress value={73} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Forum Engagement</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Resource Downloads</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Return Users</span>
                      <span className="font-medium">91%</span>
                    </div>
                    <Progress value={91} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Most Popular Modules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topModules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white text-xl">{module.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{module.name}</p>
                          <p className="text-sm text-slate-500">{module.completions.toLocaleString()} completions</p>
                        </div>
                      </div>
                      <span className="text-primary font-medium">{module.rate}%</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Registrations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Registrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.initials}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.timeAgo}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        New
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Daily Active Users</span>
                      <span className="font-bold text-2xl text-primary">3,456</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Weekly Active Users</span>
                      <span className="font-bold text-2xl text-secondary">8,901</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Monthly Active Users</span>
                      <span className="font-bold text-2xl text-accent">12,450</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {systemStatus.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-600">{item.service}</span>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          item.color.includes('green') ? 'bg-green-500' : 
                          item.color.includes('amber') ? 'bg-amber-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`capitalize ${item.color}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-green-800">Government Schemes Module</h4>
                        <p className="text-sm text-green-600">Highest engagement rate</p>
                      </div>
                      <Badge className="bg-green-600">94% completion</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-blue-800">Banking Module</h4>
                        <p className="text-sm text-blue-600">Most downloaded resources</p>
                      </div>
                      <Badge className="bg-blue-600">89% completion</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-amber-800">Agriculture Module</h4>
                        <p className="text-sm text-amber-600">Needs improvement</p>
                      </div>
                      <Badge className="bg-amber-600">67% completion</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Language Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-600">English Users</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-600">Tamil Users</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <Progress value={35} className="h-3" />
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-slate-600">
                        <strong>Insight:</strong> Consider adding more Tamil content to better serve the growing Tamil user base.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedback?.slice(0, 10).map((item: any) => (
                      <div key={item.id} className="border-l-4 border-primary pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <h4 className="font-medium text-slate-800">{item.name}</h4>
                              <Badge variant="outline" className="ml-2 text-xs">{item.category}</Badge>
                              <div className="flex items-center ml-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-1">{item.message}</p>
                            <p className="text-xs text-slate-500">
                              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="flex items-center ml-4">
                            {item.isReviewed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!feedback || feedback.length === 0) && !feedbackLoading && (
                      <div className="text-center py-8">
                        <p className="text-slate-600">No feedback available.</p>
                      </div>
                    )}

                    {feedbackLoading && (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
