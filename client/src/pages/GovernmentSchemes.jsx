import React, { useState } from "react";
import {
  Landmark,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Info,
  HeartPulse,
  GraduationCap,
  Home,
  Briefcase,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import EmptyState from "../components/common/EmptyState";
import { schemeService } from "../services/schemeService";
import { useToast } from "../context/ToastContext";

export default function GovernmentSchemes() {
  const { showToast } = useToast();
  const [schemes, setSchemes] = useState(() => schemeService.getSchemes());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedState, setSelectedState] = useState("All States");
  const [activeSchemeModal, setActiveSchemeModal] = useState(null);
  const [eligibilityCheckScheme, setEligibilityCheckScheme] = useState(null);
  const [eligibilityAnswer, setEligibilityAnswer] = useState({
    citizen: "yes",
    income: "under_3l",
    landholder: "yes",
  });
  const [eligibilityVerdict, setEligibilityVerdict] = useState(null);

  const categories = [
    "All Categories",
    "Agriculture",
    "Health",
    "Education",
    "Housing",
    "Employment",
  ];

  const states = [
    "All States",
    "All India",
    "Maharashtra",
    "Uttar Pradesh",
    "Karnataka",
    "Delhi (NCT)",
    "Tamil Nadu",
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" || s.category === selectedCategory;
    const matchesState =
      selectedState === "All States" || s.state === selectedState || s.state === "All India";
    return matchesSearch && matchesCategory && matchesState;
  });

  const handleToggleSave = async (id, e) => {
    e.stopPropagation();
    try {
      const updated = await schemeService.toggleSaveScheme(id);
      setSchemes(schemeService.getSchemes());
      showToast(
        updated.isSaved ? "Scheme bookmarked to your saved list." : "Scheme removed from saved.",
        "info"
      );
    } catch {
      showToast("Error updating scheme", "error");
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Agriculture":
        return Landmark;
      case "Health":
        return HeartPulse;
      case "Education":
        return GraduationCap;
      case "Housing":
        return Home;
      case "Employment":
        return Briefcase;
      default:
        return Landmark;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Agriculture":
        return { bg: "bg-emerald-50", text: "text-[#15965B]", border: "border-emerald-200" };
      case "Health":
        return { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" };
      case "Education":
        return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" };
      case "Housing":
        return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" };
      case "Employment":
        return { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" };
      default:
        return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" };
    }
  };

  const runEligibilityTest = (_scheme) => {
    setEligibilityVerdict("Eligible based on preliminary criteria! Next step: Submit Khatauni and Aadhaar OTP.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Government Schemes"
        subtitle="Explore schemes and check your eligibility"
        badge={
          <Badge variant="emerald" size="sm">
            Central & State Portals
          </Badge>
        }
      />

      {/* Demonstration Disclaimer Alert as requested in Prompt */}
      <div className="bg-[#15965B]/10 border border-[#15965B]/30 rounded-xl p-3.5 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#15965B] shrink-0 mt-0.5" />
        <div className="text-xs text-[#087443] leading-relaxed">
          <strong className="font-semibold">Demonstration content:</strong> All scheme criteria and eligibility summaries are modeled after authentic guidelines from{" "}
          <a
            href="https://myscheme.gov.in"
            target="_blank"
            rel="noreferrer"
            className="underline font-bold hover:text-black"
          >
            MyScheme.gov.in
          </a>
          . Please verify authoritative requirements with respective ministry nodal offices.
        </div>
      </div>

      {/* Search and Filters matching Reference Image 8 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes, ministries, or benefits..."
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-[#E5EAE8] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17212B] focus:border-[#15965B] outline-none shadow-xs"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full bg-white border border-[#E5EAE8] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17212B] focus:border-[#15965B] outline-none shadow-xs"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scheme Cards matching Reference Image 8 */}
      {filteredSchemes.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="No schemes found"
          description="Try broadening your category filter or clearing the search terms."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("All Categories");
            setSelectedState("All States");
          }}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredSchemes.map((scheme) => {
            const Icon = getCategoryIcon(scheme.category);
            const color = getCategoryColor(scheme.category);

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-[#E5EAE8] p-5 shadow-xs hover:border-[#15965B]/40 hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Category Themed Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0 border ${color.border} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Scheme Info */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#17212B] group-hover:text-[#15965B] transition-colors">
                        {scheme.name}
                      </h3>
                      <Badge variant={scheme.tagColor || "emerald"} size="xs">
                        {scheme.category}
                      </Badge>
                      <span className="text-[11px] text-[#64748B]">
                        • {scheme.state}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {scheme.description}
                    </p>

                    <p className="text-[11px] text-slate-500 font-medium">
                      Department: {scheme.department}
                    </p>
                  </div>
                </div>

                {/* Right Side Buttons matching Reference Image 8 */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={(e) => handleToggleSave(scheme.id, e)}
                    className="p-2 text-slate-400 hover:text-[#15965B] rounded-lg transition"
                    title={scheme.isSaved ? "Saved" : "Save scheme"}
                  >
                    {scheme.isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-[#15965B]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveSchemeModal(scheme)}
                  >
                    View Details
                  </Button>

                  <button
                    onClick={() => {
                      setEligibilityCheckScheme(scheme);
                      setEligibilityVerdict(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#15965B] hover:text-[#087443] transition ml-1"
                  >
                    <span>Check Eligibility</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scheme Detailed View Modal */}
      {activeSchemeModal && (
        <Modal
          isOpen={!!activeSchemeModal}
          onClose={() => setActiveSchemeModal(null)}
          title={activeSchemeModal.name}
          subtitle={activeSchemeModal.department}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Overview & Benefits
              </h4>
              <p className="text-xs text-[#17212B] leading-relaxed">
                {activeSchemeModal.detailedDescription}
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-[#15965B]/20">
              <h4 className="text-xs font-bold text-[#087443] mb-1">
                Direct Financial / Service Entitlement:
              </h4>
              <p className="text-xs font-semibold text-[#17212B]">
                {activeSchemeModal.benefits}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Statutory Eligibility Checklist
              </h4>
              <ul className="space-y-1.5 text-xs text-[#17212B]">
                {activeSchemeModal.eligibilityCriteria.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15965B] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Required Citizen Documents
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeSchemeModal.documentsRequired.map((doc, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-[#F5F8F7] border border-[#E5EAE8] text-[#17212B] px-2.5 py-1 rounded-lg"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5EAE8] flex items-center justify-between">
              <a
                href={activeSchemeModal.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15965B] hover:text-[#087443]"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setEligibilityCheckScheme(activeSchemeModal);
                  setActiveSchemeModal(null);
                  setEligibilityVerdict(null);
                }}
              >
                Check My Eligibility
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Interactive Eligibility Checker Modal */}
      {eligibilityCheckScheme && (
        <Modal
          isOpen={!!eligibilityCheckScheme}
          onClose={() => setEligibilityCheckScheme(null)}
          title={`Eligibility Check: ${eligibilityCheckScheme.name}`}
          subtitle="Fast simulated statutory criteria audit"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">
                  1. Are you an Indian citizen residing in {eligibilityCheckScheme.state}?
                </label>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="citizen"
                      value="yes"
                      checked={eligibilityAnswer.citizen === "yes"}
                      onChange={() =>
                        setEligibilityAnswer({ ...eligibilityAnswer, citizen: "yes" })
                      }
                      className="text-[#15965B]"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="citizen"
                      value="no"
                      checked={eligibilityAnswer.citizen === "no"}
                      onChange={() =>
                        setEligibilityAnswer({ ...eligibilityAnswer, citizen: "no" })
                      }
                      className="text-[#15965B]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">
                  2. Household Annual Income Category
                </label>
                <select
                  value={eligibilityAnswer.income}
                  onChange={(e) =>
                    setEligibilityAnswer({ ...eligibilityAnswer, income: e.target.value })
                  }
                  className="w-full bg-[#F5F8F7] border border-[#E5EAE8] rounded-lg p-2 text-xs"
                >
                  <option value="under_3l">Below ₹3,00,000 / year (EWS/BPL)</option>
                  <option value="3l_to_6l">₹3,00,000 to ₹6,00,000 / year (LIG)</option>
                  <option value="above_6l">Above ₹6,00,000 / year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">
                  3. Do you have an active Aadhaar-linked bank account?
                </label>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="landholder"
                      value="yes"
                      checked={eligibilityAnswer.landholder === "yes"}
                      onChange={() =>
                        setEligibilityAnswer({ ...eligibilityAnswer, landholder: "yes" })
                      }
                      className="text-[#15965B]"
                    />
                    <span>Yes, verified DBT account</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="landholder"
                      value="no"
                      checked={eligibilityAnswer.landholder === "no"}
                      onChange={() =>
                        setEligibilityAnswer({ ...eligibilityAnswer, landholder: "no" })
                      }
                      className="text-[#15965B]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>

            {eligibilityVerdict ? (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-[#15965B]/30 animate-in fade-in">
                <div className="flex items-center gap-2 text-[#087443] font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#15965B]" />
                  <span>Preliminary Assessment: Highly Eligible</span>
                </div>
                <p className="text-xs text-[#17212B] leading-relaxed">
                  {eligibilityVerdict}
                </p>
              </div>
            ) : null}

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAE8]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEligibilityCheckScheme(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => runEligibilityTest(eligibilityCheckScheme)}
              >
                Run Assessment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
