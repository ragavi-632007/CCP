import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useLanguage } from "@/components/language-provider";
import { ArrowRight, Users, GraduationCap, BarChart3, Globe } from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                {t('hero.title').split(' ').map((word, index) => (
                  <span key={index} className={word === 'Rural' ? 'text-accent' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-emerald-100">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-accent text-slate-800 hover:bg-accent/90" asChild>
                  <Link href="/modules">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    {t('hero.getStarted')}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/modules">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    {t('hero.watchDemo')}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:text-right">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Rural community using digital technology" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">12,450+</div>
              <p className="text-slate-600">{t('stats.activeUsers')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-secondary mb-2">89,240+</div>
              <p className="text-slate-600">{t('stats.modulesCompleted')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">1,200+</div>
              <p className="text-slate-600">{t('stats.villages')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-500 mb-2">95%</div>
              <p className="text-slate-600">{t('stats.satisfaction')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools and resources designed for rural community empowerment
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {t('modules.title')}
                </h3>
                <p className="text-slate-600 mb-4">
                  Interactive video lessons on government schemes, banking, agriculture, and health with bilingual support.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/modules">
                    Explore Modules <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {t('forum.title')}
                </h3>
                <p className="text-slate-600 mb-4">
                  Connect with other learners, ask questions, and participate in live mentoring sessions.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/forum">
                    Join Community <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-slate-800" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {t('liveData.title')}
                </h3>
                <p className="text-slate-600 mb-4">
                  Real-time access to government schemes, market prices, weather data, and agricultural information.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/live-data">
                    View Data <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <Globe className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join thousands of rural learners accessing government schemes and digital literacy education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-slate-800 hover:bg-accent/90" asChild>
                <Link href="/modules">Start Learning Today</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link href="/forum">Join the Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
