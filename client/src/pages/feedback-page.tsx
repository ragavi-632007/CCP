import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";
import { useLanguage } from "@/components/language-provider";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, MessageCircle, Loader2, CheckCircle } from "lucide-react";

type FeedbackForm = z.infer<typeof insertFeedbackSchema>;

export default function FeedbackPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      rating: 0,
      message: "",
    },
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackForm) => {
      const res = await apiRequest("POST", "/api/feedback", data);
      return res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      setSelectedRating(0);
      toast({
        title: "Feedback submitted",
        description: "Thank you for your valuable feedback!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: FeedbackForm) => {
    if (selectedRating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    submitFeedbackMutation.mutate({
      ...data,
      rating: selectedRating,
    });
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 sm:py-16 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 sm:p-8 text-center">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>
            <p className="text-slate-600 mb-6 text-sm sm:text-base">
              Your feedback has been submitted successfully. We appreciate your input and will use it to improve Rural Minds.
            </p>
            <Button onClick={() => setIsSubmitted(false)} className="btn-primary w-full sm:w-auto">
              Submit Another Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            {t('feedback.title')}
          </h1>
          <p className="text-xl text-slate-600">
            {t('feedback.subtitle')}
          </p>
        </div>

        {/* Feedback Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <MessageCircle className="h-6 w-6 mr-2" />
              Share Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 sm:space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="name">{t('feedback.name')}</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">{t('feedback.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Feedback Category */}
              <div>
                <Label htmlFor="category">{t('feedback.category')}</Label>
                <Select onValueChange={(value) => form.setValue("category", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">Content Quality</SelectItem>
                    <SelectItem value="technical">Technical Issues</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="language">Language Support</SelectItem>
                    <SelectItem value="general">General Feedback</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.category.message}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <Label>{t('feedback.rating')}</Label>
                <div className="flex items-center space-x-2 sm:space-x-3 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="transition-transform duration-200 sm:hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 sm:h-8 sm:w-8 ${
                          star <= selectedRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-slate-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 sm:ml-3 text-slate-600 text-sm sm:text-base">
                    {selectedRating === 0 && "Click to rate"}
                    {selectedRating === 1 && "Poor"}
                    {selectedRating === 2 && "Fair"}
                    {selectedRating === 3 && "Good"}
                    {selectedRating === 4 && "Very Good"}
                    {selectedRating === 5 && "Excellent"}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">{t('feedback.message')}</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Share your thoughts, suggestions, or issues..."
                  {...form.register("message")}
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>

              {/* Privacy Agreement */}
              <div className="flex items-start space-x-2">
                <Checkbox id="privacy" required />
                <Label htmlFor="privacy" className="text-sm text-slate-600 leading-relaxed">
                  I agree to   policy and terms  service. My feedback may  used to improve the Rural Minds platform.
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-primary text-base sm:text-lg py-3"
                disabled={submitFeedbackMutation.isPending}
              >
                {submitFeedbackMutation.isPending ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                {t('feedback.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-10 sm:mt-12 grid md:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-5 sm:p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2 text-base sm:text-lg">Quick Response</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We typically respond to feedback within 24-48 hours during business days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 sm:p-6 text-center">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2 text-base sm:text-lg">Your Voice Matters</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every piece of feedback helps us create a better learning experience for rural communities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 sm:p-6 text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-slate-800" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2 text-base sm:text-lg">Continuous Improvement</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We regularly update our platform based on user feedback and suggestions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8 bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
            <p className="text-emerald-100 mb-6 text-sm sm:text-base leading-relaxed">
              If you have urgent issues or need immediate help, you can reach out to our support team directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <div className="flex items-center justify-center">
                <span className="text-emerald-100 text-sm sm:text-base">📧 support@ruralminds.gov.in</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-emerald-100 text-sm sm:text-base">📞 +91 1800-123-4567</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
