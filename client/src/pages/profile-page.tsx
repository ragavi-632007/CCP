import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/language-provider";
import { Play, Download, Clock } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Fetch user progress and watched modules
  const { data: userProgress, isLoading: progressLoading } = useQuery<any[]>({
    queryKey: ["/api/progress"],
  });
  const { data: modules, isLoading: modulesLoading } = useQuery<any[]>({
    queryKey: ["/api/modules"],
  });

  // Filter modules watched by user
  const watchedModules =
    modules?.filter((mod) =>
      userProgress?.some((p) => p.moduleId === mod.id)
    ) || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
            Profile
          </h1>
          <p className="text-lg text-slate-600">
            Welcome,{" "}
            <span className="font-semibold text-primary">
              {user?.firstName} {user?.lastName}
            </span>
          </p>
        </div>

        {/* Progress Overview - Dynamic */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Learning Progress</CardTitle>
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
                    <p className="text-slate-600">Modules Completed</p>
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
                const percent = Math.round((certificates / totalModules) * 100);
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
                    <p className="text-slate-600">Certificates Earned</p>
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
                    <p className="text-slate-600">Knowledge Retention</p>
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Watched Modules */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Modules You've Watched
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {watchedModules.length > 0 ? (
              watchedModules.map((module) => (
                <Card key={module.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{module.category}</Badge>
                      <span className="text-xs text-slate-500">
                        <Clock className="h-3 w-3 inline mr-1" />{" "}
                        {module.duration
                          ? `${Math.floor(module.duration / 60)} min`
                          : ""}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{module.description}</p>
                    <div className="flex gap-2">
                      {module.videoUrl && (
                        <a
                          href={module.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary px-4 py-2 rounded"
                        >
                          <Play className="h-4 w-4 mr-1 inline" /> Watch Again
                        </a>
                      )}
                      {module.downloadUrl && (
                        <a
                          href={module.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary px-4 py-2 rounded"
                        >
                          <Download className="h-4 w-4 mr-1 inline" /> Download
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-slate-600">
                You haven't watched any modules yet.
              </div>
            )}
          </div>
        </div>

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
      </div>
    </div>
  );
}
