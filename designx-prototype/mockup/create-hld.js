// Create HLD Page Logic

class CreateHLDApp {
  constructor() {
    this.currentStep = 1;
    this.selectedMethod = null;
    this.formData = {};
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupMethodSelection();
    this.setupAISuggestions();
  }

  setupFormValidation() {
    const requiredFields = [
      "hld-title",
      "hld-type",
      "landscape-type",
      "business-division",
      "workload-type",
    ];

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener("change", () => {
          this.validateForm();
        });
      }
    });
  }

  setupMethodSelection() {
    const methodCards = document.querySelectorAll(".method-card");

    methodCards.forEach((card) => {
      card.addEventListener("click", () => {
        // Remove selected class from all cards
        methodCards.forEach((c) => c.classList.remove("selected"));

        // Add selected class to clicked card
        card.classList.add("selected");

        // Store selected method
        this.selectedMethod = card.dataset.method;

        // Update continue button state
        this.validateForm();
      });
    });
  }

  setupAISuggestions() {
    const titleInput = document.getElementById("hld-title");
    const typeSelect = document.getElementById("hld-type");
    const landscapeSelect = document.getElementById("landscape-type");

    if (titleInput) {
      titleInput.addEventListener(
        "input",
        this.debounce(() => {
          this.showAISuggestions();
        }, 500),
      );
    }

    if (typeSelect) {
      typeSelect.addEventListener("change", () => {
        this.showAISuggestions();
      });
    }

    if (landscapeSelect) {
      landscapeSelect.addEventListener("change", () => {
        this.showAISuggestions();
      });
    }
  }

  showAISuggestions() {
    const title = document.getElementById("hld-title")?.value || "";
    const type = document.getElementById("hld-type")?.value || "";
    const landscape = document.getElementById("landscape-type")?.value || "";

    const suggestionsDiv = document.querySelector(
      ".ai-suggestions .suggestion-text",
    );
    if (!suggestionsDiv) return;

    let suggestion =
      "Consider using 'PETRONAS-' prefix for enterprise applications";

    // Context-aware suggestions
    if (
      title.toLowerCase().includes("customer") ||
      title.toLowerCase().includes("portal")
    ) {
      suggestion =
        "Customer-facing applications should follow PETRONAS Digital Experience guidelines and include proper authentication flows";
    } else if (
      title.toLowerCase().includes("mobile") ||
      title.toLowerCase().includes("app")
    ) {
      suggestion =
        "Mobile applications require offline capability assessment and device management compliance per PETRONAS Mobile Strategy";
    } else if (
      title.toLowerCase().includes("analytics") ||
      title.toLowerCase().includes("data") ||
      title.toLowerCase().includes("bi")
    ) {
      suggestion =
        "Analytics platforms must comply with PETRONAS Data Governance Framework and include proper data lineage tracking";
    } else if (
      title.toLowerCase().includes("api") ||
      title.toLowerCase().includes("integration")
    ) {
      suggestion =
        "API integrations require OAuth 2.0 authentication and must be registered in the PETRONAS API Gateway";
    } else if (type === "ERP") {
      suggestion =
        "ERP enhancements should leverage existing SAP modules where possible and follow PETRONAS ERP Architecture patterns";
    } else if (type === "Infrastructure") {
      suggestion =
        "Infrastructure projects should prioritize Enterprise Cloud deployment and follow PETRONAS Infrastructure as Code standards";
    } else if (landscape === "SaaS") {
      suggestion =
        "SaaS solutions require vendor security assessment and data residency compliance with PETRONAS policies";
    } else if (landscape === "Enterprise Cloud") {
      suggestion =
        "Enterprise Cloud deployments should use PETRONAS-approved container platforms and follow cloud-native architecture principles";
    }

    // Add naming suggestions
    if (title && !title.startsWith("PETRONAS-") && type !== "SaaS") {
      suggestion +=
        ". Consider prefixing with 'PETRONAS-' for internal applications";
    }

    suggestionsDiv.innerHTML = `<strong>AI Suggestion:</strong> ${suggestion}`;
  }

  validateForm() {
    const title = document.getElementById("hld-title")?.value;
    const type = document.getElementById("hld-type")?.value;
    const landscape = document.getElementById("landscape-type")?.value;
    const division = document.getElementById("business-division")?.value;
    const workload = document.getElementById("workload-type")?.value;

    const isFormValid =
      title && type && landscape && division && workload && this.selectedMethod;

    const continueBtn = document.querySelector(".btn-primary");
    if (continueBtn) {
      continueBtn.disabled = !isFormValid;
    }

    return isFormValid;
  }

  collectFormData() {
    return {
      title: document.getElementById("hld-title")?.value,
      description: document.getElementById("hld-description")?.value,
      type: document.getElementById("hld-type")?.value,
      landscape: document.getElementById("landscape-type")?.value,
      division: document.getElementById("business-division")?.value,
      workload: document.getElementById("workload-type")?.value,
      method: this.selectedMethod,
      timestamp: new Date().toISOString(),
    };
  }

  nextStep() {
    if (!this.validateForm()) {
      this.showNotification(
        "Please complete all required fields and select a TOE authoring method",
        "error",
      );
      return;
    }

    this.formData = this.collectFormData();

    // Store form data in localStorage for demo purposes
    localStorage.setItem("hld-draft", JSON.stringify(this.formData));

    // Show success message
    this.showNotification(
      `HLD "${this.formData.title}" saved as draft. Proceeding to ${this.selectedMethod === "diagram" ? "diagram upload" : "template authoring"}...`,
      "success",
    );

    // Simulate navigation to next step
    setTimeout(() => {
      if (this.selectedMethod === "diagram") {
        this.showDiagramUpload();
      } else {
        this.showTemplateAuthoring();
      }
    }, 2000);
  }

  showDiagramUpload() {
    // Simulate diagram upload interface
    const notification = document.createElement("div");
    notification.className = "demo-overlay";
    notification.innerHTML = `
            <div class="demo-content">
                <h3>🚀 Demo: Diagram-Based TOE Authoring</h3>
                <p>In the full system, you would:</p>
                <ul>
                    <li>Upload architecture diagrams (draw.io, Visio, etc.)</li>
                    <li>AI extracts components and relationships</li>
                    <li>Components are classified against TOE catalogue</li>
                    <li>Integration points are automatically mapped</li>
                    <li>Risk flags are generated based on component analysis</li>
                </ul>
                <button onclick="this.parentElement.parentElement.remove()">Close Demo</button>
            </div>
        `;
    document.body.appendChild(notification);
  }

  showTemplateAuthoring() {
    // Simulate template authoring interface
    const notification = document.createElement("div");
    notification.className = "demo-overlay";
    notification.innerHTML = `
            <div class="demo-content">
                <h3>📝 Demo: Template-Based TOE Authoring</h3>
                <p>In the full system, you would:</p>
                <ul>
                    <li>Follow guided step-by-step component selection</li>
                    <li>Choose from PETRONAS TOE catalogue</li>
                    <li>Define integration patterns and data flows</li>
                    <li>Auto-generate architecture diagrams</li>
                    <li>Complete security and data management declarations</li>
                </ul>
                <button onclick="this.parentElement.parentElement.remove()">Close Demo</button>
            </div>
        `;
    document.body.appendChild(notification);
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize the create HLD application
const createApp = new CreateHLDApp();

// Global function for the continue button
function nextStep() {
  createApp.nextStep();
}
