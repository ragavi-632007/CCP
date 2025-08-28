import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Download,
  Clock,
  Languages,
  FileText,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useToast } from "@/hooks/use-toast";
import { Module } from "@shared/schema";

export default function ModulesPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: modules, isLoading } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  const { data: userProgress } = useQuery<any[]>({
    queryKey: ["/api/progress"],
  });

  const categories = [
    { id: "all", label: t("modules.allModules") },
    { id: "government", label: t("modules.government") },
    { id: "banking", label: t("modules.banking") },
    { id: "agriculture", label: t("modules.agriculture") },
    { id: "education", label: "Education" },
  ];

  const filteredModules =
    modules?.filter(
      (module) =>
        selectedCategory === "all" || module.category === selectedCategory
    ) || [];

  const getProgressForModule = (moduleId: string) => {
    return userProgress?.find((p: any) => p.moduleId === moduleId);
  };

  const handleDownload = async (module: Module) => {
    try {
      if (module.downloadUrl) {
        // Create a temporary link element to trigger download
        const link = document.createElement("a");
        link.href = module.downloadUrl;
        link.download = `${
          language === "ta" && module.titleTamil
            ? module.titleTamil
            : module.title
        }.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Download Started",
          description: `${
            language === "ta" && module.titleTamil
              ? module.titleTamil
              : module.title
          }`,
        });
      } else {
        toast({
          title: "Download not available",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Download failed",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
            Modules
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t("modules.subtitle")}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "btn-primary" : ""}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Progress Overview */}
        {userProgress && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t("modules.progress.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Dynamic Modules Completed */}
                {(() => {
                  const totalModules = modules?.length || 1;
                  const completedModules =
                    userProgress?.filter((p) => p.completed).length || 0;
                  const percent = Math.round(
                    (completedModules / totalModules) * 100
                  );
                  const dashOffset = 226 - Math.round((percent / 100) * 226);
                  return (
                    <div className="text-center" key="progress-completed">
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#2563eb"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="226"
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            className="progress-circle"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-[#2563eb]">
                            {percent}%
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600">
                        {t("modules.progress.completed")}
                      </p>
                    </div>
                  );
                })()}
                {/* Dynamic Certificates Earned (placeholder logic) */}
                {(() => {
                  // Placeholder: certificates earned = completed modules / 2
                  const totalModules = modules?.length || 1;
                  const completedModules =
                    userProgress?.filter((p) => p.completed).length || 0;
                  const certificates = Math.floor(completedModules / 2);
                  const percent = Math.round(
                    (certificates / totalModules) * 100
                  );
                  const dashOffset = 226 - Math.round((percent / 100) * 226);
                  return (
                    <div className="text-center" key="progress-certificates">
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#2563eb"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="226"
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            className="progress-circle"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-[#2563eb]">
                            {percent}%
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600">
                        {t("modules.progress.certificates")}
                      </p>
                    </div>
                  );
                })()}
                {/* Dynamic Knowledge Retention (placeholder logic) */}
                {(() => {
                  // Placeholder: retention = completed modules / total modules * 90
                  const totalModules = modules?.length || 1;
                  const completedModules =
                    userProgress?.filter((p) => p.completed).length || 0;
                  const percent = Math.round(
                    (completedModules / totalModules) * 90
                  );
                  const dashOffset = 226 - Math.round((percent / 100) * 226);
                  return (
                    <div className="text-center" key="progress-retention">
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#2563eb"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="226"
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            className="progress-circle"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-[#2563eb]">
                            {percent}%
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600">
                        {t("modules.progress.retention")}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Viewed Section (Placeholder) */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Data You've Viewed
          </h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-600">
                Recent data interactions will appear here (e.g., market prices,
                weather, education schemes).
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modules List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModules.map((module) => {
            const progress = getProgressForModule(module.id);
            return (
              <Card key={module.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{module.category}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {language === "ta" && module.titleTamil
                      ? module.titleTamil
                      : module.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {language === "ta" && module.descriptionTamil
                      ? module.descriptionTamil
                      : module.description}
                  </p>
                  {progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.completed ? "100%" : "0%"}</span>
                      </div>
                      <Progress
                        value={progress.completed ? 100 : 0}
                        className="h-2"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>Video</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {module.videoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            module.videoUrl &&
                            window.open(module.videoUrl, "_blank")
                          }
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Button>
                      )}
                      {module.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(module)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {/* Hardcoded Education module */}
          {(selectedCategory === "education" || selectedCategory === "all") && (
            <Card className="card-hover">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
                  alt="Digital Literacy Basics"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-lg">
                  <Button
                    size="lg"
                    className="w-16 h-16 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100"
                  >
                    <Play className="h-6 w-6 text-primary ml-1" />
                  </Button>
                </div>
                <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {formatDuration(600)}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">education</Badge>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Digital Literacy Basics
                </h3>
                <p className="text-slate-600 mb-4">
                  Learn the fundamentals of using computers and the internet
                  safely.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-slate-500">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Video</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open("https://yourvideolink.com", "_blank")
                      }
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open("https://yourdownloadlink.com", "_blank")
                      }
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">
              No modules found for the selected category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
