import React from "react";
import { Link } from "react-router-dom";
import {
  Landmark,
  Scale,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  FileCheck2,
  Sparkles,
  Search,
  CheckCircle2,
  Users,
  Compass,
  FileText,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  const featureCards = [
    {
      title: "Government Schemes",
      desc: "Find and understand schemes that you are eligible for.",
      icon: Landmark,
      color: "emerald",
      bg: "bg-emerald-50",
      iconColor: "text-[#15965B]",
      borderColor: "border-[#15965B]/20",
    },
    {
      title: "Legal Guidance",
      desc: "Get insights on laws, rights and legal procedures.",
      icon: Scale,
      color: "blue",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "AI Chat Assistant",
      desc: "Ask questions in natural language and get instant answers.",
      icon: MessageSquare,
      color: "emerald",
      bg: "bg-emerald-50",
      iconColor: "text-[#15965B]",
      borderColor: "border-[#15965B]/20",
    },
    {
      title: "Secure & Reliable",
      desc: "Your data is secure and information is from trusted sources.",
      icon: ShieldCheck,
      color: "amber",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Ask or Upload",
      desc: "Type your query about civic rights, tenancy laws, or upload official documents for instant evidence analysis.",
      icon: MessageSquare,
    },
    {
      number: "02",
      title: "Statutory Grounding",
      desc: "CivicSphere cross-references authentic India Code statutes, Central Gazettes, and MyScheme portals.",
      icon: FileCheck2,
    },
    {
      number: "03",
      title: "Act with Confidence",
      desc: "Receive clear, step-by-step guidance, statutory section citations, and direct links to official grievance redressal portals.",
      icon: CheckCircle2,
    },
  ];

  const benefits = [
    {
      title: "For Indian Citizens",
      desc: "Demystify complex legal jargon. Easily determine welfare eligibility and understand citizen rights without legal intimidation.",
      icon: Users,
    },
    {
      title: "For Legal Researchers & Students",
      desc: "Quickly locate relevant sections across BNS, BNSS, Transfer of Property Act, and Consumer Protection Act with source anchors.",
      icon: BookOpen,
    },
    {
      title: "For Farmers & MSME Owners",
      desc: "Discover targeted subsidies like PM Kisan, PM SVANidhi, and Mudra loans with transparent eligibility checklists.",
      icon: Landmark,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section matching Reference Image 1 */}
      <section id="hero" className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white to-[#F5F8F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#15965B]/10 border border-[#15965B]/20 text-xs font-semibold text-[#087443]">
                <Sparkles className="w-3.5 h-3.5 text-[#15965B]" />
                <span>Next-Gen Civic Tech for India</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17212B] tracking-tight leading-[1.15]">
                Your AI Assistant for{" "}
                <span className="text-[#15965B] block sm:inline">
                  Civic & Legal Guidance
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl">
                CivicSphere AI helps you explore government schemes, understand legal rights, and get reliable information — all in one place.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={ArrowRight}
                    className="font-semibold shadow-md shadow-[#15965B]/20 px-7"
                  >
                    {isAuthenticated ? "Open Dashboard" : "Get Started"}
                  </Button>
                </Link>

                <a href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-semibold px-7"
                  >
                    Learn More
                  </Button>
                </a>
              </div>

              {/* Trust Badge Bar */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15965B]" />
                  <span>Statutory Citations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15965B]" />
                  <span>Verified Schemes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15965B]" />
                  <span>Privacy First</span>
                </div>
              </div>
            </div>

            {/* Right Column: AI Assistant Visual matching Reference Image 1 */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                {/* Background decorative aura rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#15965B]/10 to-emerald-200/30 blur-2xl transform scale-90" />
                
                {/* Center AI Bot Card Container */}
                <div className="relative z-10 w-72 sm:w-80 h-72 sm:h-80 bg-white/90 backdrop-blur-md rounded-3xl border border-[#E5EAE8] shadow-2xl flex flex-col items-center justify-center p-6 text-center">
                  
                  {/* Floating badge top-left: Scale */}
                  <div className="absolute -top-4 -left-4 p-3 rounded-2xl bg-white border border-[#E5EAE8] shadow-lg flex items-center justify-center text-[#15965B] animate-bounce duration-1000">
                    <Scale className="w-6 h-6" />
                  </div>

                  {/* Floating badge top-right: Document */}
                  <div className="absolute -top-3 -right-3 p-3 rounded-2xl bg-white border border-[#E5EAE8] shadow-lg flex items-center justify-center text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>

                  {/* Floating badge bottom-left: Chat Bubble */}
                  <div className="absolute -bottom-3 -left-3 p-3 rounded-2xl bg-white border border-[#E5EAE8] shadow-lg flex items-center justify-center text-[#15965B]">
                    <MessageSquare className="w-6 h-6" />
                  </div>

                  {/* Robot Head Graphic */}
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-b from-slate-100 to-slate-200 border-2 border-slate-300 p-2 shadow-inner flex flex-col items-center justify-center relative mb-4">
                    {/* Bot Visor */}
                    <div className="w-24 h-16 rounded-2xl bg-[#080D18] flex items-center justify-center gap-4 relative overflow-hidden">
                      {/* Animated Bot Eyes */}
                      <div className="w-4 h-4 rounded-full bg-[#15965B] shadow-md shadow-[#15965B] animate-pulse" />
                      <div className="w-4 h-4 rounded-full bg-[#15965B] shadow-md shadow-[#15965B] animate-pulse" />
                      {/* Scanline light */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
                    </div>
                    {/* Bot Smile */}
                    <div className="w-8 h-1.5 rounded-full bg-[#15965B]/60 mt-3" />
                    {/* Antenna */}
                    <div className="absolute -top-3 w-2 h-3 bg-slate-400 rounded-t-full flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-[#15965B] -top-2 absolute" />
                    </div>
                  </div>

                  {/* Bot Label */}
                  <h3 className="text-sm font-bold text-[#17212B]">
                    CivicSphere Assistant
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Ready to answer your civic queries
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15965B]/10 text-[11px] font-semibold text-[#087443]">
                    <span className="w-2 h-2 rounded-full bg-[#15965B] animate-ping" />
                    Active & Grounded
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Feature Cards matching Reference Image 1 exactly */}
          <div id="features" className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white rounded-2xl border border-[#E5EAE8] p-5 shadow-xs hover:border-[#15965B]/40 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${feat.bg} ${feat.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#17212B] mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-[#E5EAE8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="emerald" size="sm" className="mb-3">
              Process Workflow
            </Badge>
            <h2 className="text-3xl font-extrabold text-[#17212B] tracking-tight">
              How CivicSphere AI Works
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              From confusing legal paperwork to clear, verifiable action in three seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative bg-[#F5F8F7] rounded-2xl p-6 border border-[#E5EAE8] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E5EAE8] flex items-center justify-center text-[#15965B] shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-300">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#17212B] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="py-20 bg-[#F5F8F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="blue" size="sm" className="mb-3">
              Empowering India
            </Badge>
            <h2 className="text-3xl font-extrabold text-[#17212B] tracking-tight">
              Designed for Everyday Citizens
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Bridge the civic knowledge gap with trustworthy technology grounded in official statutory records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <Card key={b.title} className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-[#15965B]/10 text-[#15965B] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#17212B] mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {b.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to action banner */}
      <section className="py-16 bg-[#080D18] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for evidence-backed civic guidance?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Start Exploring Your Rights and Entitlements Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join thousands of citizens using CivicSphere AI to navigate Indian government schemes, resolve civil questions, and verify legal citations.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={ArrowRight}
                className="font-bold px-8 shadow-lg shadow-[#15965B]/30"
              >
                {isAuthenticated ? "Enter Dashboard" : "Create Free Account"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
