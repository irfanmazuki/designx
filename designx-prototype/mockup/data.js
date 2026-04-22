// Mock data for DesignX prototype

const mockHLDs = [
  {
    id: 1,
    title: "Customer Portal Enhancement",
    type: "ERP",
    landscape: "Enterprise Cloud",
    division: "Retail Division",
    workloadType: "Enhancement",
    status: "In Review",
    author: "Sarah Chen",
    submittedDate: "2024-04-20",
    risks: [
      {
        type: "Security Risk",
        level: "high",
        reason: "External API integration without proper authentication",
      },
      {
        type: "Data Risk",
        level: "medium",
        reason: "Customer PII processing requires additional controls",
      },
    ],
    toeComponents: [
      {
        name: "Web Application",
        classification: "TOE Default",
        status: "approved",
      },
      {
        name: "API Gateway",
        classification: "Available Not Preferred",
        status: "flagged",
      },
      {
        name: "Customer Database",
        classification: "TOE Default",
        status: "approved",
      },
    ],
  },
  {
    id: 2,
    title: "Supply Chain Analytics Platform",
    type: "Non-ERP",
    landscape: "Enterprise Cloud",
    division: "Upstream Division",
    workloadType: "New Development",
    status: "Submitted",
    author: "Ahmad Rahman",
    submittedDate: "2024-04-21",
    risks: [
      {
        type: "Availability Risk",
        level: "medium",
        reason: "No HA/DR strategy defined for critical analytics",
      },
    ],
    toeComponents: [
      {
        name: "Analytics Engine",
        classification: "Step-Out",
        status: "requires-approval",
      },
      { name: "Data Lake", classification: "TOE Default", status: "approved" },
    ],
  },
  {
    id: 3,
    title: "Mobile Field Operations App",
    type: "Infrastructure",
    landscape: "SaaS",
    division: "Downstream Division",
    workloadType: "New Development",
    status: "Approved",
    author: "Lisa Wong",
    submittedDate: "2024-04-18",
    approvedDate: "2024-04-22",
    risks: [],
    toeComponents: [
      {
        name: "Mobile App Platform",
        classification: "TOE Default",
        status: "approved",
      },
      {
        name: "Offline Sync Service",
        classification: "TOE Default",
        status: "approved",
      },
    ],
  },
];

const aiResponses = {
  "security requirements":
    "PETRONAS security requirements include: 1) All external integrations must use OAuth 2.0 or SAML 2.0, 2) Data encryption in transit (TLS 1.3+) and at rest (AES-256), 3) Multi-factor authentication for privileged access, 4) Regular security assessments for High/Critical BIA ratings.",

  "toe guidelines":
    "Target Operating Environment (TOE) guidelines classify components as: TOE Default (preferred, pre-approved), Available Not Preferred (requires justification), Step-Out (requires EA approval), Unknown/Not Available (requires assessment). Always prioritize TOE Default components for faster approval.",

  "data classification":
    "PETRONAS data classification levels: Public (no restrictions), Internal (PETRONAS personnel only), Confidential (authorized personnel), Restricted (highest protection). Each level has specific handling, storage, and transmission requirements per the Data Management Policy.",

  "architecture standards":
    "PETRONAS architecture follows cloud-first strategy with preference for: Enterprise Cloud (primary), SaaS solutions (when suitable), On-premise (legacy only). All new developments should target microservices architecture with API-first design principles.",
};

const mockUsers = {
  current: {
    name: "John Architect",
    role: "Solution Architect",
    division: "Enterprise Architecture",
    avatar: "JA",
  },
};

// Simulated AI processing delays
const aiProcessingTime = 1500; // 1.5 seconds

// ── Approved Parent HLDs for Enhancement/Rollout selection (FR-06) ──

const approvedParentHLDs = [
  {
    id: "HLD-2023-001",
    parentId: "PARENT-2023-001",
    title: "PETRONAS Customer Portal Platform",
    type: "ERP",
    landscape: "Enterprise Cloud",
    division: "Retail Division",
    status: "Approved",
    approvedDate: "2023-08-15",
    author: "Sarah Chen",
    description:
      "Core customer portal providing authentication, profile management, and service access",
    version: "1.0",
    childCount: 2,
  },
  {
    id: "HLD-2023-015",
    parentId: "PARENT-2023-015",
    title: "Supply Chain Management System",
    type: "ERP",
    landscape: "Enterprise Cloud",
    division: "Upstream Division",
    status: "Approved",
    approvedDate: "2023-09-22",
    author: "Ahmad Rahman",
    description:
      "Integrated supply chain management with vendor portal and procurement workflows",
    version: "2.1",
    childCount: 5,
  },
  {
    id: "HLD-2023-028",
    parentId: "PARENT-2023-028",
    title: "PETRONAS Mobile Field Operations",
    type: "Infrastructure",
    landscape: "SaaS",
    division: "Downstream Division",
    status: "Approved",
    approvedDate: "2023-10-10",
    author: "Lisa Wong",
    description:
      "Mobile platform for field operations, maintenance scheduling, and asset tracking",
    version: "1.5",
    childCount: 1,
  },
  {
    id: "HLD-2023-042",
    parentId: "PARENT-2023-042",
    title: "Enterprise Analytics Platform",
    type: "Non-ERP",
    landscape: "Enterprise Cloud",
    division: "Corporate Functions",
    status: "Approved",
    approvedDate: "2023-11-05",
    author: "David Kumar",
    description:
      "Centralized analytics platform with data lake, reporting, and business intelligence",
    version: "1.0",
    childCount: 0,
  },
  {
    id: "HLD-2024-003",
    parentId: "PARENT-2024-003",
    title: "PETRONAS Digital Workspace",
    type: "Infrastructure",
    landscape: "Enterprise Cloud",
    division: "Corporate Functions",
    status: "Approved",
    approvedDate: "2024-01-18",
    author: "Maria Santos",
    description:
      "Unified digital workspace with collaboration tools, document management, and communication",
    version: "1.2",
    childCount: 3,
  },
  {
    id: "HLD-2024-012",
    parentId: "PARENT-2024-012",
    title: "Retail Station Management System",
    type: "ERP",
    landscape: "On-Premise",
    division: "Retail Division",
    status: "Approved",
    approvedDate: "2024-02-28",
    author: "James Lee",
    description:
      "Comprehensive retail station management including POS, inventory, and loyalty programs",
    version: "3.0",
    childCount: 1,
  },
];

// Generate unique parent ID (FR-05)
function generateParentId() {
  const year = new Date().getFullYear();
  const seq = Date.now().toString().slice(-6);
  return "PARENT-" + year + "-" + seq;
}

// Search approved parent HLDs (FR-06)
function searchParentHLDs(query) {
  if (!query || query.length < 2) return [];
  const term = query.toLowerCase();
  return approvedParentHLDs
    .filter(
      (hld) =>
        hld.title.toLowerCase().includes(term) ||
        hld.id.toLowerCase().includes(term) ||
        hld.parentId.toLowerCase().includes(term) ||
        hld.division.toLowerCase().includes(term) ||
        hld.type.toLowerCase().includes(term) ||
        hld.description.toLowerCase().includes(term),
    )
    .slice(0, 5);
}
