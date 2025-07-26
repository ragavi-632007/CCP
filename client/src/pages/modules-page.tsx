import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Play, Download, Clock, Languages, FileText, Loader2, ExternalLink } from "lucide-react";
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
    { id: "all", label: t('modules.allModules') },
    { id: "government", label: t('modules.government') },
    { id: "banking", label: t('modules.banking') },
    { id: "agriculture", label: t('modules.agriculture') },
    { id: "health", label: t('modules.health') },
  ];

  const filteredModules = modules?.filter(module => 
    selectedCategory === "all" || module.category === selectedCategory
  ) || [];

  const getProgressForModule = (moduleId: string) => {
    return userProgress?.find((p: any) => p.moduleId === moduleId);
  };

  const handleDownload = async (module: Module) => {
    try {
      if (module.downloadUrl) {
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = module.downloadUrl;
        link.download = `${language === 'ta' && module.titleTamil ? module.titleTamil : module.title}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Started",
          description: `${language === 'ta' && module.titleTamil ? module.titleTamil : module.title}`,
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
            {t('modules.title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('modules.subtitle')}
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
              <CardTitle>{t('modules.progress.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
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
                        stroke="hsl(160, 84%, 39%)" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="226" 
                        strokeDashoffset="68" 
                        strokeLinecap="round"
                        className="progress-circle"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">70%</span>
                    </div>
                  </div>
                  <p className="text-slate-600">{t('modules.progress.completed')}</p>
                </div>
                <div className="text-center">
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
                        stroke="hsl(174, 100%, 29%)" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="226" 
                        strokeDashoffset="113" 
                        strokeLinecap="round"
                        className="progress-circle"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-secondary">50%</span>
                    </div>
                  </div>
                  <p className="text-slate-600">{t('modules.progress.certificates')}</p>
                </div>
                <div className="text-center">
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
                        stroke="hsl(43, 96%, 56%)" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="226" 
                        strokeDashoffset="45" 
                        strokeLinecap="round"
                        className="progress-circle"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-accent">80%</span>
                    </div>
                  </div>
                  <p className="text-slate-600">{t('modules.progress.retention')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modules Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredModules.map((module) => {
            const progress = getProgressForModule(module.id);
            const title = language === 'ta' && module.titleTamil ? module.titleTamil : module.title;
            const description = language === 'ta' && module.descriptionTamil ? module.descriptionTamil : module.description;

            return (
              <Card key={module.id} className="card-hover">
                <div className="relative">
                  <img 
                    src={`https://images.unsplash.com/photo-145416580${module.category === 'government' ? '6-c3d57bc86b40' : module.category === 'banking' ? '3-544ae1b704d3' : '4-320219-553eb213f72d'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200`}
                    alt={title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-lg">
                    <Button size="lg" className="w-16 h-16 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100">
                      <Play className="h-6 w-6 text-primary ml-1" />
                    </Button>
                  </div>
                  <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formatDuration(module.duration || 0)}
                  </div>
                  {progress?.completed && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Completed
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{module.category}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
                  <p className="text-slate-600 mb-4">{description}</p>
                  
                  {progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.completed ? '100%' : '0%'}</span>
                      </div>
                      <Progress value={progress.completed ? 100 : 0} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <Languages className="h-4 w-4 mr-1" />
                        <span>தமிழ் / EN</span>
                      </div>
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
                          onClick={() => module.videoUrl && window.open(module.videoUrl, '_blank')}
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
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No modules found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
