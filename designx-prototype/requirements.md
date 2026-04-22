# DesignX Prototype - Requirements

## Project Overview

DesignX is an AI-powered PETRONAS internal portal for High-Level Design (HLD) request management, Target Operating Environment (TOE) authoring, and architecture governance.

## Target Users

- **Solution Architects**: Create HLD requests, author TOE specifications
- **Technical Reviewers (EA/ED/CS)**: Review submissions, assess risks, approve/reject

## Core User Journeys

### 1. Solution Architect Workflow

- Create new HLD request with project details
- Choose TOE authoring method (diagram-based or template-based)
- AI-assisted diagram extraction and component mapping
- Complete mandatory Data Management & Cybersecurity declarations
- Submit for review with auto-generated risk flags

### 2. Technical Reviewer Workflow

- View dashboard of pending HLD requests
- Review AI-generated risk flags and rationale
- Assess TOE gaps and alignment
- Acknowledge risks and make approval decisions
- Human-in-the-loop governance with AI assistance

### 3. AI Assistant Features

- Extract architectural components from diagrams
- Auto-generate risk flags with explainable rationale
- Provide knowledge support and FAQ responses
- Suggest naming and formatting standards

## Key Differentiators

- **AI-Powered Diagram Analysis**: Automatically extract and classify TOE components
- **Intelligent Risk Flagging**: Auto-generate security, data, availability, and governance risks
- **Human-Centric Governance**: AI assists but humans retain decision authority
- **PETRONAS Standards Alignment**: Built-in compliance with enterprise architecture guidelines

## Visual Priorities

- Clean, professional PETRONAS-branded interface
- Interactive multi-step workflow demonstration
- Clear risk visualization and status dashboards
- Technical user-focused UX with data-rich displays

## Technical Approach

- Vanilla JavaScript prototype (no frameworks)
- Mock data representing realistic HLD scenarios
- Client-side only with simulated AI responses
- Responsive design for technical users

## Success Metrics

- Clear demonstration of AI-human collaboration
- Intuitive workflow for both architects and reviewers
- Professional presentation suitable for stakeholder demos
- Effective communication of governance value proposition

## Implemented Features

### Dashboard View

- Status overview cards showing HLD request counts by status
- Risk highlight card for high-priority items
- Recent HLD requests list with risk badges
- Interactive navigation between views

### Create HLD View

- Multi-step progress indicator
- Project information form with PETRONAS standard fields
- AI-powered suggestions based on input (real-time)
- Form validation and user guidance

### Review Queue View

- Filterable list of pending HLD requests
- AI-generated risk analysis display
- Risk categorization (High, Medium, Low)
- Approve/Reject workflow with notifications
- Detailed risk explanations and rationale

### AI Assistant View

- Interactive chat interface
- Knowledge base responses for PETRONAS standards
- Context-aware suggestions for architecture guidelines
- Real-time response simulation

### HLD Detail Modal

- Comprehensive project information display
- TOE component classification and status
- Risk analysis with detailed explanations
- Professional modal interface with PETRONAS branding

### Interactive Features

- Single-page application with view switching
- Real-time AI suggestions and responses
- Modal dialogs for detailed information
- Notification system for user actions
- Responsive design for technical users

### PETRONAS Branding

- Official color palette (Emerald Green primary)
- PETRONAS logo integration (SVG)
- Professional typography and spacing
- Consistent visual hierarchy
- Enterprise-grade interface design

## Technical Implementation

- Vanilla JavaScript (ES6+) with class-based architecture
- CSS Grid and Flexbox for responsive layouts
- Mock data simulation for realistic content
- Event-driven user interactions
- Modular code structure for maintainability

## Recent Updates

### Multi-Page Structure

- **Separated Dashboard and Create HLD**: Split into `index.html` (dashboard) and `create-hld.html` (HLD creation) for better user experience
- **Improved Navigation**: Updated navigation links to work across separate pages
- **Enhanced Margins**: Added proper left/right margins (3rem) to prevent content from touching screen edges

### Enhanced Create HLD Experience

- **Comprehensive Form**: Added description field and all required PETRONAS business divisions
- **TOE Method Selection**: Visual cards for choosing between diagram-based and template-based authoring
- **Advanced AI Suggestions**: Context-aware suggestions based on project type, landscape, and title keywords
- **Form Validation**: Real-time validation with disabled submit button until all fields are complete
- **Demo Workflows**: Interactive demonstrations of both authoring methods when user proceeds

### Improved User Interface

- **Better Spacing**: Enhanced content margins and padding for professional appearance
- **Method Selection Cards**: Interactive visual selection for TOE authoring approaches
- **Progress Indicators**: Clear multi-step progress bar showing current position in workflow
- **Responsive Design**: Mobile-friendly layouts for all form components
- **Professional Styling**: Consistent PETRONAS branding across all pages

### Technical Enhancements

- **Modular JavaScript**: Separate JS files for different page functionalities
- **Local Storage**: Form data persistence for draft saving demonstration
- **Enhanced Notifications**: Better user feedback for actions and validations
- **Demo Overlays**: Educational popups showing what full system capabilities would include

The prototype now provides a more realistic multi-page experience that better demonstrates the actual user journey from dashboard overview to detailed HLD creation.

## FR-05/06/07 Implementation Complete

### Files Modified

- `create-hld.html` — Rebuilt with proper parent-child HLD sections
- `create-hld.js` — Complete rewrite with all methods inside the class
- `data.js` — Added 6 approved parent HLDs, generateParentId(), searchParentHLDs()
- `style.css` — Added styles for all new components

### Working Features

- Selecting "New Development" shows auto-generated parent ID with lineage diagram
- Selecting "Enhancement" or "Rollout" shows searchable parent HLD field
- Real-time search across title, ID, division, type, and description
- Selected parent displays full details with relationship preview
- Form validation blocks submission without parent selection for Enhancement/Rollout
- AI suggestions update contextually based on workload type
- All existing functionality (TOE method selection, form validation, demo overlays) preserved
