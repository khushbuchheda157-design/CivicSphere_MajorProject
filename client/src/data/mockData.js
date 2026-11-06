// CivicSphere AI - Core Knowledge Store & Dynamic State Defaults

export const initialUser = null;

export const initialRecentChats = [];

export const initialChatConversations = {};

export const initialDocuments = [];

export const initialFeedbackList = [];

export const getDashboardStats = (chats = [], docs = [], schemes = []) => [
  {
    id: "chats",
    label: "Total Chats",
    value: chats.length,
    change: chats.length > 0 ? `${chats.length} session${chats.length > 1 ? "s" : ""}` : "No sessions yet",
    accent: "emerald",
    icon: "MessageSquare",
  },
  {
    id: "docs",
    label: "Documents",
    value: docs.length,
    change: docs.length > 0 ? `${docs.length} uploaded` : "No uploads yet",
    accent: "blue",
    icon: "FileText",
  },
  {
    id: "schemes",
    label: "Schemes Saved",
    value: schemes.filter((s) => s.isSaved).length,
    change: `${schemes.filter((s) => s.isSaved).length} saved`,
    accent: "purple",
    icon: "Landmark",
  },
  {
    id: "legal",
    label: "Legal Queries",
    value: chats.filter((c) => c.category && c.category.toLowerCase().includes("legal")).length,
    change: "Statutory verified",
    accent: "amber",
    icon: "Scale",
  },
];

// Reference catalog of Indian welfare schemes
export const initialSchemes = [
  {
    id: "scheme-1",
    name: "PM Kisan Samman Nidhi",
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    state: "All India",
    description: "Financial assistance to farmers for agricultural needs.",
    detailedDescription: "Central Sector scheme with 100% funding from Government of India. It provides income support of ₹6,000/- per year in three equal installments to all landholding farmer families.",
    benefits: "₹6,000 per year directly credited into Aadhaar-linked bank accounts in three 4-monthly instalments.",
    eligibilitySummary: "All landholder farmer families having cultivable landholding in their names.",
    eligibilityCriteria: [
      "Small and marginal farmers owning cultivable agricultural land.",
      "Valid Aadhaar card linked with active bank account.",
      "Name must be enrolled on State Land Records Portal.",
      "Excluded: Institutional landholders, serving/retired government employees, and income tax payers."
    ],
    documentsRequired: [
      "Land Ownership Document (Khatauni / RoR)",
      "Aadhaar Card",
      "Bank Account Passbook with IFSC",
      "Active Mobile Number"
    ],
    officialUrl: "https://pmkisan.gov.in",
    isSaved: false,
    tagColor: "emerald"
  },
  {
    id: "scheme-2",
    name: "Ayushman Bharat PM-JAY",
    department: "Ministry of Health and Family Welfare",
    category: "Health",
    state: "All India",
    description: "Health insurance coverage for eligible families up to ₹5 Lakh/year.",
    detailedDescription: "The world's largest government-funded healthcare assurance scheme offering secondary and tertiary hospitalization cover of ₹5 Lakh per eligible family per year across empaneled hospitals.",
    benefits: "Cashless and paperless access to quality healthcare at all public and empaneled private hospitals.",
    eligibilitySummary: "Families identified based on deprivation and occupational criteria of SECC 2011.",
    eligibilityCriteria: [
      "Rural families living in one-room kutcha houses, female-headed households, or landless laborers.",
      "Urban families categorized under identified 11 occupational categories.",
      "Senior citizens aged 70+ (Universal coverage irrespective of income under Ayushman Vaya Vandana)."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Ration Card or SECC Household ID",
      "Proof of Family Identity"
    ],
    officialUrl: "https://pmjay.gov.in",
    isSaved: false,
    tagColor: "purple"
  },
  {
    id: "scheme-3",
    name: "Beti Bachao Beti Padhao",
    department: "Ministry of Women and Child Development",
    category: "Education",
    state: "All India",
    description: "Promote education and welfare of the girl child.",
    detailedDescription: "A tri-ministerial convergence effort to address declining Child Sex Ratio (CSR), eliminate gender-biased sex selection, and ensure girl child education and empowerment across India.",
    benefits: "Scholarships, subsidized education, safety awareness, and linked Sukanya Samriddhi high-interest savings accounts.",
    eligibilitySummary: "Any Indian family with a girl child from infancy through secondary school education.",
    eligibilityCriteria: [
      "Indian citizen girl child below 10 years of age for account linkage.",
      "Enrolled in recognized government or private educational institutions.",
      "Applicable across all 700+ districts of India."
    ],
    documentsRequired: [
      "Birth Certificate of girl child",
      "Aadhaar of parents/guardian",
      "Residential certificate"
    ],
    officialUrl: "https://wcd.nic.in/bbbp-schemes",
    isSaved: false,
    tagColor: "amber"
  },
  {
    id: "scheme-4",
    name: "Pradhan Mantri Awas Yojana (PMAY-U)",
    department: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    state: "All India",
    description: "Pucca houses for all eligible urban families with interest subsidies.",
    detailedDescription: "Comprehensive mission addressing urban housing shortages among EWS, LIG and MIG categories through interest subsidy on housing loans and slum rehabilitation.",
    benefits: "Up to ₹2.67 Lakh interest subsidy on home loans under Credit Linked Subsidy Scheme (CLSS).",
    eligibilitySummary: "Beneficiary family should not own a pucca house in any part of India.",
    eligibilityCriteria: [
      "Economically Weaker Section (EWS) with annual household income up to ₹3 Lakh.",
      "Low Income Group (LIG) with income between ₹3 Lakh to ₹6 Lakh.",
      "Female ownership or co-ownership of house is mandatory in EWS/LIG categories."
    ],
    documentsRequired: [
      "Aadhaar Card of all family members",
      "Income Certificate / ITR",
      "Property Sale Deed / Construction estimate",
      "Affidavit of not owning pucca house"
    ],
    officialUrl: "https://pmaymis.gov.in",
    isSaved: false,
    tagColor: "blue"
  },
  {
    id: "scheme-5",
    name: "PM SVANidhi (Street Vendor Loan)",
    department: "Ministry of Housing & Urban Affairs",
    category: "Employment",
    state: "All India",
    description: "Affordable collateral-free working capital micro-loans for street vendors.",
    detailedDescription: "Special micro-credit facility empowering urban, peri-urban, and rural street vendors to resume livelihoods through progressive working capital loans with 7% interest subsidy.",
    benefits: "Initial tranche of ₹10,000, subsequent tranches up to ₹20,000 and ₹50,000 on timely repayment.",
    eligibilitySummary: "All street vendors vending in urban areas on or before the qualifying date.",
    eligibilityCriteria: [
      "Street vendors holding Certificate of Vending / Identity Card issued by Urban Local Bodies (ULB).",
      "Vendors identified in the survey or letter of recommendation by Town Vending Committee.",
      "Vendors in peri-urban/rural markets supplying to urban areas."
    ],
    documentsRequired: [
      "Vending Certificate or ID Card",
      "Aadhaar Card",
      "Bank Account details"
    ],
    officialUrl: "https://pmsvanidhi.mohua.gov.in",
    isSaved: false,
    tagColor: "emerald"
  },
  {
    id: "scheme-6",
    name: "PM MUDRA Yojana (PMMY)",
    department: "Ministry of Finance",
    category: "Employment",
    state: "All India",
    description: "Loans up to ₹20 Lakh to non-corporate, non-farm small/micro enterprises.",
    detailedDescription: "Refinance agency supporting formal credit to micro enterprises in manufacturing, trading, and service sectors under three stages: Shishu, Kishore, and Tarun.",
    benefits: "Shishu loans up to ₹50,000, Kishore up to ₹5 Lakh, Tarun up to ₹10 Lakh (extended to ₹20 Lakh in 2024 budget).",
    eligibilitySummary: "Any Indian citizen with a feasible non-farm business proposition.",
    eligibilityCriteria: [
      "Small business owners, shopkeepers, fruit/vegetable vendors, artisans, and food processors.",
      "No collateral or third-party guarantee required.",
      "Applicant must not be a defaulter to any financial institution."
    ],
    documentsRequired: [
      "Proof of Identity & Address (Aadhaar/PAN/Voter ID)",
      "Business address and establishment proof",
      "Bank statement of last 6 months",
      "Quotation / Business plan"
    ],
    officialUrl: "https://www.mudra.org.in",
    isSaved: false,
    tagColor: "purple"
  }
];

export const popularLegalTopics = [
  {
    id: "property",
    title: "Property Law",
    icon: "Building",
    color: "amber",
    tagline: "Tenancy, RERA, Title Deeds, Eviction & Boundary Disputes",
    description: "Rights under Transfer of Property Act 1882, Model Tenancy Act, and RERA homebuyer safeguards.",
    sampleQueries: [
      "What are tenant rights against sudden eviction?",
      "How to verify clean land title before purchasing?",
      "Rules for security deposit return in residential leases."
    ],
    relevantSections: [
      { code: "Transfer of Property Act, 1882", section: "Section 106 & 108", summary: "Duration of leases and rights/liabilities of lessor and lessee." },
      { code: "Model Tenancy Act, 2021", section: "Section 21", summary: "Protection from unilateral rent hikes and arbitrary eviction." }
    ]
  },
  {
    id: "family",
    title: "Family Law",
    icon: "Users",
    color: "blue",
    tagline: "Marriage, Succession, Maintenance, Guardianship & Wills",
    description: "Governed by Hindu Marriage Act, Special Marriage Act, and Indian Succession Act provisions.",
    sampleQueries: [
      "What are the legal rights of daughters in ancestral property?",
      "Procedure for mutual consent divorce in India?",
      "How to claim maintenance under Section 125 CrPC / Section 144 BNSS?"
    ],
    relevantSections: [
      { code: "Hindu Succession (Amendment) Act, 2005", section: "Section 6", summary: "Equal coparcenary rights for daughters from birth." },
      { code: "Bhartiya Nagarik Suraksha Sanhita (BNSS), 2023", section: "Section 144", summary: "Order for maintenance of wives, children, and parents." }
    ]
  },
  {
    id: "criminal",
    title: "Criminal Law",
    icon: "Scale",
    color: "emerald",
    tagline: "FIR, Bail, BNS 2023, Police Inquiries & Citizen Safeguards",
    description: "Procedural safeguards under Bharatiya Nyaya Sanhita (BNS) and Bharatiya Nagarik Suraksha Sanhita (BNSS).",
    sampleQueries: [
      "What is Zero FIR and can police refuse to register it?",
      "What are citizen rights during arrest or police summons?",
      "Difference between bailable and non-bailable offences."
    ],
    relevantSections: [
      { code: "Bharatiya Nagarik Suraksha Sanhita, 2023", section: "Section 173", summary: "Mandatory Zero FIR registration irrespective of jurisdiction." },
      { code: "Constitution of India", section: "Article 22(1)", summary: "Right to be informed of grounds of arrest and legal counsel." }
    ]
  },
  {
    id: "labour",
    title: "Labour Law",
    icon: "Briefcase",
    color: "rose",
    tagline: "Wages, Gratuity, Notice Period, POSH & Maternity Benefits",
    description: "Protection under Code on Wages, Maternity Benefit Act, and POSH Act at the workplace.",
    sampleQueries: [
      "Can an employer withhold salary during notice period?",
      "What are statutory maternity leave rights under Indian law?",
      "Procedure for filing complaint before Internal Committee under POSH."
    ],
    relevantSections: [
      { code: "Payment of Gratuity Act, 1972", section: "Section 4", summary: "Gratuity payable after 5 years continuous service." },
      { code: "Maternity Benefit (Amendment) Act, 2017", section: "Section 5", summary: "26 weeks paid maternity leave for female employees." }
    ]
  },
  {
    id: "consumer",
    title: "Consumer Rights",
    icon: "ShieldAlert",
    color: "purple",
    tagline: "Defective Goods, Deficiency in Service, e-Daakhil & Refunds",
    description: "Enforcing consumer protections under Consumer Protection Act 2019 and CCPA guidelines.",
    sampleQueries: [
      "How to file online consumer complaint on e-Daakhil?",
      "Remedies against e-commerce sellers refusing refund for defective items?",
      "What compensation can be claimed for misleading advertisements?"
    ],
    relevantSections: [
      { code: "Consumer Protection Act, 2019", section: "Section 35", summary: "Direct filing before District Consumer Disputes Redressal Commission." },
      { code: "Consumer Protection (E-Commerce) Rules, 2020", section: "Rule 6", summary: "Strict liability against counterfeit goods and unfair trade practices." }
    ]
  },
  {
    id: "cyber",
    title: "Cyber Law",
    icon: "ShieldCheck",
    color: "cyan",
    tagline: "Online Fraud, Identity Theft, 1930 Portal & DPDP Act 2023",
    description: "Cybercrime redressal under Information Technology Act 2000 and Digital Personal Data Protection Act 2023.",
    sampleQueries: [
      "What to do immediately after unauthorized UPI transaction fraud?",
      "How to report financial cybercrime on national portal 1930?",
      "Legal penalties for identity theft and spoofing under IT Act."
    ],
    relevantSections: [
      { code: "Information Technology Act, 2000", section: "Section 66C & 66D", summary: "Punishment for identity theft and cheating by personation using computer resources." },
      { code: "Digital Personal Data Protection Act, 2023", section: "Section 6", summary: "Citizen consent requirements and penalty for data fiduciary breach." }
    ]
  }
];

export const civicKnowledgeGraph = {
  nodes: [
    { id: "n1", label: "Constitution of India", type: "Supreme Law", color: "#15965B" },
    { id: "n2", label: "Fundamental Rights (Part III)", type: "Doctrine", color: "#087443" },
    { id: "n3", label: "Article 21 (Life & Liberty)", type: "Article", color: "#10B981" },
    { id: "n4", label: "Right to Information Act, 2005", type: "Legislation", color: "#3B82F6" },
    { id: "n5", label: "Central Information Commission", type: "Regulatory Body", color: "#6366F1" },
    { id: "n6", label: "PM Kisan Samman Nidhi", type: "Scheme", color: "#8B5CF6" },
    { id: "n7", label: "Ministry of Agriculture", type: "Authority", color: "#EC4899" },
    { id: "n8", label: "Model Tenancy Act, 2021", type: "Legislation", color: "#F59E0B" },
    { id: "n9", label: "Consumer Protection Act, 2019", type: "Legislation", color: "#14B8A6" },
    { id: "n10", label: "National Consumer Commission (NCDRC)", type: "Judicial Forum", color: "#06B6D4" },
  ],
  links: [
    { source: "n1", target: "n2", relationship: "establishes" },
    { source: "n2", target: "n3", relationship: "guarantees" },
    { source: "n3", target: "n4", relationship: "derived from" },
    { source: "n4", target: "n5", relationship: "adjudicated by" },
    { source: "n7", target: "n6", relationship: "administers" },
    { source: "n8", target: "n3", relationship: "safeguards housing rights under" },
    { source: "n9", target: "n10", relationship: "establishes appeal before" },
  ]
};
