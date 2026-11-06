import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useToast } from "../context/ToastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      showToast("Reset link sent! Please check your inbox.", "success");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F8F7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-2xl border border-[#E5EAE8] py-8 px-6 sm:px-8 shadow-sm">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#087443] to-[#15965B] flex items-center justify-center shadow-md shadow-[#15965B]/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#17212B]">
                CivicSphere <span className="text-[#15965B]">AI</span>
              </span>
            </Link>
            <h2 className="text-xl font-extrabold text-[#17212B]">
              Reset Password
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Enter your email and we'll send you recovery instructions
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#15965B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#17212B]">
                Recovery Email Dispatched
              </p>
              <p className="text-xs text-[#64748B] leading-relaxed">
                We've sent a password reset link to <strong className="text-[#17212B]">{email}</strong>.
              </p>
              <Link to="/login" className="inline-block pt-2">
                <Button variant="outline" size="sm" leftIcon={ArrowLeft}>
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                error={error}
                leftIcon={Mail}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold shadow-sm"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#17212B] transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

