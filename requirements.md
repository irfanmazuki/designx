1. Scope & Context
   The system in scope is myHLD, an internal PETRONAS web-based portal that supports:

High-Level Design (HLD) request registration
Target Operating Environment (TOE) authoring
Architecture governance and approval
Data management and cybersecurity declaration
Risk flagging and auditability
AI-assisted knowledge and FAQ support
The system shall support Solution Architects, EA/ED/CS reviewers, and approvers while preserving enterprise governance and accountability.

2. Actors

Solution Architect (Author): Creates and submits HLD and TOE information
Reviewer (EA / ED / CS): Reviews, flags risks, acknowledges gaps, and approves/rejects
Approver: Final approval authority
AI Assistant (Read-only): Provides advisory knowledge support only

3. Functional Requirements
   3.1 Portal Foundation & Visibility

The system shall be a web-based internal PETRONAS portal.
The system shall display HLD request status on the front page with values: Submitted
In-Review
Approved

3.2 HLD Request Registration

The system shall allow creation of an HLD request with the following attributes:HLD Title
Description
HLD Type (ERP / Infrastructure / Non-ERP)
Landscape Type (Enterprise Cloud / On-Premise / SaaS)
Business Division
Workload Type (New Development / Enhancement)
The system shall provide non-blocking naming and formatting suggestions to promote standardisation.

3.3 Workload-Based Versioning & Lineage

New Development requests shall create a parent HLD with a unique ID.
Enhancement or Rollout requests shall:Require selection of an existing approved parent HLD
Enforce parent–child relationship tagging
The system shall show application lineage (parent–child HLDs) to reviewers.

3.4 Submission Flow Control

After initial HLD registration, users shall be guided into a multi-step TOE authoring flow.
The flow shall support continuation without loss of previously entered data.

3.5 TOE Authoring Methods

The system shall support multiple TOE authoring paths:Diagram-based (AI-assisted extraction)
Template-based (guided manual entry)
Template-based authoring shall require declaration of deployment model:SaaS
PaaS
IaaS

3.6 Diagram-Based TOE Extraction

The system shall accept architecture diagrams in:
draw.io
The system shall:Interpret architectural components and integrations
Map extracted elements into structured TOE components
Classify components against the enterprise TOE catalogue: TOE Default
Available Not Preferred
Step-Out
Unknown / Not Available

3.7 Template-Based Diagram Generation

When template-based TOE authoring is used, the system shall: Auto-generate a high-level architecture diagram
Represent application, data, and security components and interactions
Store the generated diagram as part of the HLD artefact
Allow author edits prior to submission

3.8 Data Management & Cybersecurity Declaration

Completion of Data Management and Cybersecurity sections shall be mandatory prior to submission.
3.8.1 Business Impact Assessment (BIA)

The system shall require BIA ratings for:Confidentiality
Integrity
Availability
Overall impact
For Availability rating Major or above, HA/DR declaration shall be required.

3.8.2 Security Architecture Declaration
The system shall allow declaration of:

Connectivity protocols
Identity & Access Management:Authentication approach
Access control model
SSO method
Key/password management
MFA and federation
Endpoint security
Application security
Data protection:Data-in-motion encryption
Data-at-rest encryption
Data retention & privacy
Data loss prevention
Security testing approach
Network security controls
Privileged access management

3.9 Automated Risk Flagging

Based on submitted security and data inputs, the system shall auto-generate risk flags:Security Risk
Data Risk
Availability / Resilience Risk
Governance Risk
Each risk flag shall include an explainable rationale.
High or Critical risks shall require explicit reviewer acknowledgement.

3.10 Governance & Approval Controls

The system shall perform automated TOE gap and alignment assessment prior to approval.
Reviewers shall be required to acknowledge:Gaps
Deviations
Risk flags
The system shall not auto-block approval; final decisions remain human-led.

3.11 AI-Assisted Knowledge Support

The system shall provide an embedded AI assistant to:Answer FAQs
Retrieve information from approved HLDs
The AI assistant shall:Be read-only
Respect access controls
Provide grounded, source-based responses

4. Non-Functional Requirements
   4.1 Performance

The system shall support concurrent users without degradation.
Diagram processing and TOE analysis shall complete within acceptable enterprise response times.

4.2 Security

Role-based access control shall be enforced.
All artefacts shall be protected according to enterprise security policies.

4.3 Audit & Traceability

Full audit trails shall be maintained for: TOE authoring
Risk flagging
Reviewer acknowledgement
Approval and rejection

4.4 Usability

Statuses, risks, and gaps shall be clearly presented for reviewers.
Absence of a manually uploaded diagram shall not block template-based submission.

4.5 Governance & Resilience

Failure of AI-assisted components shall not block manual submission.
Human accountability for architecture decisions shall be preserved.

5. Steering Principles (for Kiro)

Governance advisory, not enforcement-by-automation
Explainability over black-box decisions
Progressive disclosure of complexity
AI as assistive, never authoritative
Alignment with PETRONAS security, data, and EA governance standards
