import React, { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import { feedbackService } from "../services/schemeService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Feedback() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("AI Response Accuracy");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const ratingLabels = {
    1: "Needs Improvement",
    2: "Fair",
    3: "Good",
    4: "Great!",
    5: "Excellent!",
  };

  const categories = [
    "AI Response Accuracy",
    "Government Schemes Coverage",
    "Legal Guidance & Citations",
    "Document Analyzer Speed",
    "User Interface & Usability",
    "Other Suggestions",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      showToast("Please select a star rating", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        rating,
        category,
        comment,
        user,
      });
      setSubmitted(true);
      showToast("Thank you! Your feedback helps ground civic intelligence.", "success");
    } catch (err) {
      showToast(err.message || "Failed to submit feedback", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setComment("");
    setSubmitted(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Feedback"
        subtitle="We value your feedback to improve our service"
        badge={
          <Badge variant="emerald" size="sm">
            Citizen Input
          </Badge>
        }
      />

      <Card className="p-6 sm:p-8">
        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#15965B] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-[#17212B]">
              Thank You for Your Feedback!
            </h3>

            <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
              Your evaluation directly guides our civic citations tuning and legal model accuracy benchmarks.
            </p>

            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Submit Another Feedback
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating Section matching Reference Image 12 */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-2">
                How was your experience?
              </label>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-[#E5EAE8] fill-[#F5F8F7]"
                        } transition-colors`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-xs font-semibold text-[#15965B] mt-2">
                {ratingLabels[hoverRating || rating] || "Select rating"}
              </p>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-[#E5EAE8] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17212B] focus:border-[#15965B] outline-none shadow-xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Feedback Textarea matching Reference Image 12 */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Additional Feedback (Optional)
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more about your experience, statutory accuracy, or suggestions..."
                className="w-full bg-white border border-[#E5EAE8] rounded-xl p-3.5 text-xs sm:text-sm text-[#17212B] placeholder-[#94A3B8] focus:border-[#15965B] outline-none shadow-xs transition"
              />
            </div>

            {/* Submit Button matching Reference Image 12 */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-bold shadow-sm"
              isLoading={isSubmitting}
              leftIcon={Send}
            >
              Submit Feedback
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
