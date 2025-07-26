import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wheat, 
  HeartHandshake, 
  Home, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Cloud,
  CloudRain,
  Sun,
  Eye,
  Wind,
  Droplets,
  Gauge,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { GovernmentScheme } from "@shared/schema";

export default function LiveDataPage() {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState("tamil-nadu");
  const [activeCategory, setActiveCategory] = useState("schemes");

  const { data: schemes, isLoading: schemesLoading } = useQuery<GovernmentScheme[]>({
    queryKey: ["/api/schemes"],
  });

  const { data: marketPrices, isLoading: pricesLoading } = useQuery<any[]>({
    queryKey: ["/api/market-prices"],
  });

  const { data: weather, isLoading: weatherLoading } = useQuery<any>({
    queryKey: ["/api/weather"],
  });

  const categories = [
    { id: "schemes", label: t('liveData.schemes'), icon: HeartHandshake },
    { id: "agriculture", label: t('liveData.agriculture'), icon: Wheat },
    { id: "weather", label: t('liveData.weather'), icon: Cloud },
    { id: "banking", label: t('liveData.banking'), icon: Eye },
  ];

  const getSchemeIcon = (category: string) => {
    switch (category) {
      case "agriculture": return Wheat;
      case "health": return HeartHandshake;
      case "housing": return Home;
      default: return HeartHandshake;
    }
  };

  const getSchemeColor = (category: string) => {
    switch (category) {
      case "agriculture": return "bg-primary";
      case "health": return "bg-secondary";
      case "housing": return "bg-accent";
      default: return "bg-primary";
    }
  };

  const getCommodityIcon = (commodity: string) => {
    switch (commodity.toLowerCase()) {
      case "rice": return "🌾";
      case "tomato": return "🍅";
      case "maize": return "🌽";
      default: return "🌱";
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "cloud-rain": return CloudRain;
      case "sun": return Sun;
      case "cloud": return Cloud;
      default: return Cloud;
    }
  };

  if (schemesLoading || pricesLoading || weatherLoading) {
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
            {t('liveData.title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('liveData.subtitle')}
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Government Schemes */}
          <TabsContent value="schemes" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {schemes?.map((scheme) => {
                const Icon = getSchemeIcon(scheme.category);
                const colorClass = getSchemeColor(scheme.category);
                
                return (
                  <Card key={scheme.id} className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center`}>
                          <Icon className="text-white h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-slate-800">{scheme.name}</h3>
                          <p className="text-sm text-slate-500 capitalize">{scheme.category}</p>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-4">{scheme.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Eligibility:</span>
                          <span className="text-slate-800">{scheme.eligibility}</span>
                        </div>
                        {scheme.amount && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Amount:</span>
                            <span className="text-green-600 font-medium">{scheme.amount}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500">Status:</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {scheme.status}
                          </Badge>
                        </div>
                      </div>
                      <Button className="w-full mt-4 btn-primary" asChild>
                        <a href={scheme.applicationUrl || "#"} target="_blank" rel="noopener noreferrer">
                          {t('liveData.applyNow')}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {(!schemes || schemes.length === 0) && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No government schemes available at the moment.</p>
              </div>
            )}
          </TabsContent>

          {/* Agriculture Data */}
          <TabsContent value="agriculture" className="space-y-6">
            {/* Market Prices */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Agricultural Market Prices</CardTitle>
                  <div className="flex items-center space-x-4">
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Commodity</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Market</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Price (₹/quintal)</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Change</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketPrices?.map((price: any, index: number) => (
                        <tr key={index} className="border-b border-slate-100">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{getCommodityIcon(price.commodity)}</span>
                              <span className="font-medium">{price.commodity}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{price.market}</td>
                          <td className="py-3 px-4 font-medium">₹{price.price.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {price.change > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                              ) : price.change < 0 ? (
                                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                              ) : (
                                <Minus className="h-4 w-4 text-slate-600 mr-1" />
                              )}
                              <span className={`${
                                price.change > 0 ? 'text-green-600' : 
                                price.change < 0 ? 'text-red-600' : 'text-slate-600'
                              }`}>
                                {price.change > 0 ? '+' : ''}₹{price.change}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-sm">{price.lastUpdated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(!marketPrices || marketPrices.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-slate-600">No market price data available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Data */}
          <TabsContent value="weather" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Weather */}
              <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle>Current Weather</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold">{weather?.current?.temperature}°C</p>
                      <p className="text-blue-100">{weather?.current?.condition}</p>
                    </div>
                    <Cloud className="h-12 w-12 text-blue-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 mr-2" />
                      <div>
                        <p className="text-blue-200">Humidity</p>
                        <p className="font-medium">{weather?.current?.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 mr-2" />
                      <div>
                        <p className="text-blue-200">Wind Speed</p>
                        <p className="font-medium">{weather?.current?.windSpeed} km/h</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Gauge className="h-4 w-4 mr-2" />
                      <div>
                        <p className="text-blue-200">Pressure</p>
                        <p className="font-medium">{weather?.current?.pressure} hPa</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      <div>
                        <p className="text-blue-200">Visibility</p>
                        <p className="font-medium">{weather?.current?.visibility} km</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rainfall Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle>7-Day Rainfall Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weather?.forecast?.map((day: any, index: number) => {
                      const WeatherIcon = getWeatherIcon(day.icon);
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <WeatherIcon className={`h-5 w-5 mr-3 ${
                              day.icon === 'cloud-rain' ? 'text-blue-500' :
                              day.icon === 'sun' ? 'text-yellow-500' : 'text-slate-400'
                            }`} />
                            <span className="font-medium">{day.day}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-slate-800">{day.rainfall}mm</p>
                            <p className="text-sm text-slate-500">{day.chance}% chance</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {(!weather?.forecast || weather.forecast.length === 0) && (
                    <div className="text-center py-8">
                      <p className="text-slate-600">No weather forecast data available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Banking Information */}
          <TabsContent value="banking">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Banking Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Digital Banking</h4>
                    <p className="text-green-700 text-sm">Access your bank account online, transfer money, and pay bills digitally.</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">UPI Payments</h4>
                    <p className="text-blue-700 text-sm">Send and receive money instantly using UPI apps like GPay, PhonePe, and Paytm.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Financial Literacy</h4>
                    <p className="text-purple-700 text-sm">Learn about savings, investments, and financial planning for your future.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Banking Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://sbi.co.in" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      State Bank of India
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://www.pnbindia.in" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Punjab National Bank
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://www.unionbankofindia.co.in" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Union Bank of India
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Reserve Bank of India
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
