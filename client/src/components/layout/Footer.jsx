import React from "react";
import { Link } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080D18] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#15965B] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                CivicSphere <span className="text-[#15965B]">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An evidence-grounded civic intelligence platform empowering citizens, legal researchers, and communities with clear, cited access to Indian laws, welfare schemes, and civil rights.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#15965B]" />
                Ground Truth: India Code & Official Gazettes
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/chat" className="hover:text-white transition">
                  Civic Assistant
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-white transition">
                  Government Schemes
                </Link>
              </li>
              <li>
                <Link to="/legal-guidance" className="hover:text-white transition">
                  Legal Guidance
                </Link>
              </li>
              <li>
                <Link to="/civic-knowledge" className="hover:text-white transition">
                  Knowledge Graph
                </Link>
              </li>
              <li>
                <Link to="/documents/upload" className="hover:text-white transition">
                  Document Analyzer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Legal Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://www.indiacode.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  India Code <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://myscheme.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  MyScheme.gov.in <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://rtionline.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  RTI Online <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://nalsa.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  NALSA Legal Aid <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Platform Ethics
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/feedback" className="hover:text-white transition">
                  Submit Feedback
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition">
                  Citation Methodology
                </a>
              </li>
              <li>
                <span className="text-slate-500">Privacy & DPDP Act 2023</span>
              </li>
              <li>
                <span className="text-slate-500">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center md:text-left leading-relaxed">
            <span className="font-semibold text-slate-400">Disclaimer:</span> CivicSphere AI generates responses based on public statutes, notifications, and gazettes for educational awareness. It does not constitute formal legal counsel.
          </p>
          <p className="shrink-0">
            © {new Date().getFullYear()} CivicSphere AI. Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
