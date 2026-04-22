// Create HLD Page Logic

class CreateHLDApp {
  constructor() {
    this.currentStep = 1;
    this.selectedMethod = null;
    this.selectedParent = null;
    this.generatedParentId = null;
    this.formData = {};
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupWorkloadTypeHandler();
    this.setupParentSearch();
    this.setupMethodSelection();
    this.setupAISuggestions();
  }

  // ── Form Validation ──────────────────────────────────────
  setupFormValidation() {
    const fields = [
      "hld-title",
      "hld-type",
      "landscape-type",
      "business-division",
      "workload-type",
    ];
    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => this.validateForm());
    });
    const title = document.getElementById("hld-title");
    if (title) title.addEventListener("input", () => this.validateForm());
  }

  validateForm() {
    const title = document.getElementById("hld-title")?.value;
    const type = document.getElementById("hld-type")?.value;
    const landscape = document.getElementById("landscape-type")?.value;
    const division = document.getElementById("business-division")?.value;
    const workload = document.getElementById("workload-type")?.value;

    let valid =
      title && type && landscape && division && workload && this.selectedMethod;

    // FR-07: Enhancement/Rollout require parent selection
    if (workload === "Enhancement" || workload === "Rollout") {
      valid = valid && !!this.selectedParent;
    }

    const btn = document.getElementById("btn-continue");
    if (btn) btn.disabled = !valid;
    return !!valid;
  }

  // ── Workload Type Handler (FR-05, FR-06) ─────────────────
  setupWorkloadTypeHandler() {
    const sel = document.getElementById("workload-type");
    if (sel)
      sel.addEventListener("change", (e) =>
        this.onWorkloadChange(e.target.value),
      );
  }

  onWorkloadChange(workload) {
    const newDevSection = document.getElementById("new-dev-section");
    const parentSection = document.getElementById("parent-hld-section");

    // Reset
    this.selectedParent = null;
    const selDisplay = document.getElementById("selected-parent-display");
    if (selDisplay) selDisplay.style.display = "none";
    const relPreview = document.getElementById("relationship-preview");
    if (relPreview) {
      relPreview.style.display = "none";
      relPreview.innerHTML = "";
    }
    const searchInput = document.getElementById("parent-search");
    if (searchInput) searchInput.value = "";
    const searchResults = document.getElementById("search-results");
    if (searchResults) {
      searchResults.innerHTML = "";
      searchResults.style.display = "none";
    }

    if (workload === "New Development") {
      // FR-05: Generate parent ID
      newDevSection.style.display = "block";
      parentSection.style.display = "none";
      this.generatedParentId = generateParentId();
      document.getElementById("generated-parent-id").textContent =
        this.generatedParentId;
      this.updateAISuggestion(
        "New Development creates a <strong>parent HLD</strong>. Future Enhancement and Rollout requests can reference this parent for version control and architectural lineage.",
      );
    } else if (workload === "Enhancement" || workload === "Rollout") {
      // FR-06: Show parent search
      newDevSection.style.display = "none";
      parentSection.style.display = "block";
      this.updateAISuggestion(
        `${workload} requests <strong>must</strong> be linked to an approved parent HLD. Search and select the parent below to establish the relationship.`,
      );
    } else {
      newDevSection.style.display = "none";
      parentSection.style.display = "none";
      this.updateAISuggestion(
        'Consider using "PETRONAS-" prefix for enterprise applications',
      );
    }

    this.validateForm();
  }

  // ── Parent HLD Search (FR-06) ────────────────────────────
  setupParentSearch() {
    const input = document.getElementById("parent-search");
    if (!input) return;

    input.addEventListener(
      "input",
      this.debounce((e) => {
        this.doParentSearch(e.target.value);
      }, 300),
    );

    // Close dropdown on outside click
    document.addEventListener("click", (e) => {
      const dropdown = document.getElementById("search-results");
      if (dropdown && !e.target.closest(".parent-search-wrap")) {
        dropdown.style.display = "none";
      }
    });
  }

  doParentSearch(query) {
    const dropdown = document.getElementById("search-results");
    if (!query || query.length < 2) {
      dropdown.innerHTML = "";
      dropdown.style.display = "none";
      return;
    }

    const results = searchParentHLDs(query);

    if (results.length === 0) {
      dropdown.innerHTML =
        '<div class="search-no-results">No matching approved parent HLDs found</div>';
      dropdown.style.display = "block";
      return;
    }

    dropdown.innerHTML = `
      <div class="search-count">${results.length} result${results.length > 1 ? "s" : ""} found</div>
      ${results
        .map(
          (hld) => `
        <div class="search-result-row" onclick="createApp.selectParent('${hld.parentId}')">
          <div class="sr-top">
            <span class="sr-title">${hld.title}</span>
            <span class="sr-id">${hld.parentId}</span>
          </div>
          <div class="sr-meta">${hld.type} · ${hld.division} · v${hld.version} · ${hld.childCount} child HLD(s)</div>
          <div class="sr-desc">${hld.description}</div>
        </div>
      `,
        )
        .join("")}
    `;
    dropdown.style.display = "block";
  }

  // ── Parent Selection (FR-07) ─────────────────────────────
  selectParent(parentId) {
    const hld = approvedParentHLDs.find((h) => h.parentId === parentId);
    if (!hld) return;

    this.selectedParent = hld;

    // Hide search dropdown
    document.getElementById("search-results").style.display = "none";
    document.getElementById("parent-search").value = hld.title;

    // Show selected parent card
    const display = document.getElementById("selected-parent-display");
    const card = document.getElementById("selected-parent-card");
    card.innerHTML = `
      <div class="sp-card">
        <div class="sp-top">
          <strong>${hld.title}</strong>
          <span class="sp-id">${hld.parentId}</span>
        </div>
        <div class="sp-grid">
          <div><span class="sp-label">Type:</span> ${hld.type}</div>
          <div><span class="sp-label">Division:</span> ${hld.division}</div>
          <div><span class="sp-label">Version:</span> ${hld.version}</div>
          <div><span class="sp-label">Approved:</span> ${hld.approvedDate}</div>
          <div><span class="sp-label">Author:</span> ${hld.author}</div>
          <div><span class="sp-label">Children:</span> ${hld.childCount} existing</div>
        </div>
        <div class="sp-desc">${hld.description}</div>
      </div>
    `;
    display.style.display = "block";

    // Show relationship preview
    this.showRelationshipPreview(hld);

    // Update AI suggestion
    const workload = document.getElementById("workload-type").value;
    this.updateAISuggestion(
      `✅ Parent HLD linked. Your <strong>${workload}</strong> will extend "${hld.title}" (v${hld.version}). This maintains architectural consistency and version tracking.`,
    );

    this.validateForm();
  }

  showRelationshipPreview(parentHLD) {
    const title =
      document.getElementById("hld-title").value || "Your New HLD Request";
    const workload = document.getElementById("workload-type").value;
    const nextVersion = (parseFloat(parentHLD.version) + 0.1).toFixed(1);

    const preview = document.getElementById("relationship-preview");
    preview.innerHTML = `
      <div class="rel-preview">
        <h4>🔗 Relationship Preview</h4>
        <div class="rel-chain">
          <div class="rel-node rel-parent">
            <span class="rel-icon">📋</span>
            <div>
              <strong>${parentHLD.title}</strong>
              <span class="rel-meta">Parent · v${parentHLD.version} · ${parentHLD.childCount} children</span>
            </div>
          </div>
          <div class="rel-arrow">↓</div>
          <div class="rel-node rel-child">
            <span class="rel-icon">${workload === "Enhancement" ? "🔄" : "🚀"}</span>
            <div>
              <strong>${title}</strong>
              <span class="rel-meta">New ${workload} · v${nextVersion}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    preview.style.display = "block";
  }

  clearParentSelection() {
    this.selectedParent = null;
    document.getElementById("selected-parent-display").style.display = "none";
    document.getElementById("selected-parent-card").innerHTML = "";
    document.getElementById("relationship-preview").style.display = "none";
    document.getElementById("relationship-preview").innerHTML = "";
    document.getElementById("parent-search").value = "";
    document.getElementById("search-results").style.display = "none";

    const workload = document.getElementById("workload-type").value;
    this.updateAISuggestion(
      `${workload} requests <strong>must</strong> be linked to an approved parent HLD. Search and select the parent below.`,
    );
    this.validateForm();
  }

  // ── TOE Method Selection ─────────────────────────────────
  setupMethodSelection() {
    document.querySelectorAll(".method-card").forEach((card) => {
      card.addEventListener("click", () => {
        document
          .querySelectorAll(".method-card")
          .forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        this.selectedMethod = card.dataset.method;
        this.validateForm();
      });
    });
  }

  // ── AI Suggestions ───────────────────────────────────────
  setupAISuggestions() {
    const titleInput = document.getElementById("hld-title");
    const typeSelect = document.getElementById("hld-type");
    const landscapeSelect = document.getElementById("landscape-type");

    if (titleInput)
      titleInput.addEventListener(
        "input",
        this.debounce(() => this.showContextSuggestion(), 500),
      );
    if (typeSelect)
      typeSelect.addEventListener("change", () => this.showContextSuggestion());
    if (landscapeSelect)
      landscapeSelect.addEventListener("change", () =>
        this.showContextSuggestion(),
      );
  }

  showContextSuggestion() {
    // Don't override workload-specific suggestions
    const workload = document.getElementById("workload-type").value;
    if (
      workload === "Enhancement" ||
      workload === "Rollout" ||
      workload === "New Development"
    )
      return;

    const title = (
      document.getElementById("hld-title")?.value || ""
    ).toLowerCase();
    const type = document.getElementById("hld-type")?.value || "";
    const landscape = document.getElementById("landscape-type")?.value || "";

    let msg = "Consider using 'PETRONAS-' prefix for enterprise applications";

    if (title.includes("customer") || title.includes("portal")) {
      msg =
        "Customer-facing apps should follow PETRONAS Digital Experience guidelines with proper authentication flows";
    } else if (title.includes("mobile") || title.includes("app")) {
      msg =
        "Mobile apps require offline capability assessment per PETRONAS Mobile Strategy";
    } else if (title.includes("analytics") || title.includes("data")) {
      msg =
        "Analytics platforms must comply with PETRONAS Data Governance Framework";
    } else if (title.includes("api") || title.includes("integration")) {
      msg =
        "API integrations require OAuth 2.0 and must be registered in the PETRONAS API Gateway";
    } else if (type === "ERP") {
      msg =
        "ERP enhancements should leverage existing SAP modules and follow PETRONAS ERP Architecture patterns";
    } else if (type === "Infrastructure") {
      msg =
        "Infrastructure projects should prioritize Enterprise Cloud and follow Infrastructure as Code standards";
    } else if (landscape === "SaaS") {
      msg =
        "SaaS solutions require vendor security assessment and data residency compliance";
    } else if (landscape === "Enterprise Cloud") {
      msg =
        "Enterprise Cloud deployments should use PETRONAS-approved container platforms";
    }

    this.updateAISuggestion(msg);
  }

  updateAISuggestion(html) {
    const el = document.querySelector("#ai-suggestions .suggestion-text");
    if (el) el.innerHTML = `<strong>AI Suggestion:</strong> ${html}`;
  }

  // ── Form Submission / Next Step ──────────────────────────
  collectFormData() {
    return {
      title: document.getElementById("hld-title")?.value,
      description: document.getElementById("hld-description")?.value,
      type: document.getElementById("hld-type")?.value,
      landscape: document.getElementById("landscape-type")?.value,
      division: document.getElementById("business-division")?.value,
      workload: document.getElementById("workload-type")?.value,
      method: this.selectedMethod,
      parentId: this.selectedParent
        ? this.selectedParent.parentId
        : this.generatedParentId,
      parentTitle: this.selectedParent ? this.selectedParent.title : null,
      timestamp: new Date().toISOString(),
    };
  }

  nextStep() {
    if (!this.validateForm()) {
      this.showNotification("Please complete all required fields", "error");
      return;
    }

    this.formData = this.collectFormData();
    localStorage.setItem("hld-draft", JSON.stringify(this.formData));

    const methodLabel =
      this.selectedMethod === "diagram"
        ? "diagram upload"
        : "template authoring";
    this.showNotification(
      `HLD "${this.formData.title}" saved. Proceeding to ${methodLabel}...`,
      "success",
    );

    setTimeout(() => {
      this.showDemoOverlay(this.selectedMethod);
    }, 1500);
  }

  showDemoOverlay(method) {
    const isDiagram = method === "diagram";
    const overlay = document.createElement("div");
    overlay.className = "demo-overlay";
    overlay.innerHTML = `
      <div class="demo-content">
        <h3>${isDiagram ? "📊" : "📝"} Demo: ${isDiagram ? "Diagram-Based" : "Template-Based"} TOE Authoring</h3>
        <p>In the full system, you would:</p>
        <ul>
          ${
            isDiagram
              ? `
            <li>Upload architecture diagrams (draw.io format)</li>
            <li>AI extracts components and relationships</li>
            <li>Components classified against TOE catalogue</li>
            <li>Integration points automatically mapped</li>
            <li>Risk flags generated from component analysis</li>
          `
              : `
            <li>Follow guided step-by-step component selection</li>
            <li>Choose from PETRONAS TOE catalogue</li>
            <li>Define integration patterns and data flows</li>
            <li>Auto-generate architecture diagrams</li>
            <li>Complete security and data management declarations</li>
          `
          }
        </ul>
        <button onclick="this.parentElement.parentElement.remove()">Close Demo</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // ── Utilities ────────────────────────────────────────────
  showNotification(message, type) {
    const el = document.createElement("div");
    el.className = `notification ${type}`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }
}

// ── Bootstrap ──────────────────────────────────────────────
const createApp = new CreateHLDApp();

function nextStep() {
  createApp.nextStep();
}
function clearParentSelection() {
  createApp.clearParentSelection();
}
