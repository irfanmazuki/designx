// DesignX Application Logic

class DesignXApp {
  constructor() {
    this.currentView = "dashboard";
    this.currentHLD = null;
    this.init();
  }

  init() {
    this.setupNavigation();
    this.renderDashboard();
    this.setupEventListeners();
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const view = link.getAttribute("href").substring(1);
        this.switchView(view);
      });
    });
  }

  switchView(viewName) {
    // Hide all views
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.remove("active");
    });

    // Show selected view
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
      targetView.classList.add("active");
    }

    // Update navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });
    document.querySelector(`[href="#${viewName}"]`).classList.add("active");

    this.currentView = viewName;

    // Render view-specific content
    switch (viewName) {
      case "dashboard":
        this.renderDashboard();
        break;
      case "create":
        this.renderCreateForm();
        break;
      case "review":
        this.renderReviewQueue();
        break;
      case "ai-assistant":
        this.renderAIAssistant();
        break;
    }
  }

  renderDashboard() {
    const hldList = document.querySelector(".hld-list");
    if (!hldList) return;

    hldList.innerHTML = "";

    mockHLDs.forEach((hld) => {
      const hldItem = this.createHLDItem(hld);
      hldList.appendChild(hldItem);
    });
  }

  createHLDItem(hld) {
    const item = document.createElement("div");
    item.className = "hld-item";
    item.dataset.id = hld.id;

    const riskBadges = hld.risks
      .map(
        (risk) => `<span class="risk-badge ${risk.level}">${risk.type}</span>`,
      )
      .join("");

    item.innerHTML = `
            <div class="hld-info">
                <h3>${hld.title}</h3>
                <p>${hld.type} ${hld.workloadType} • ${hld.landscape} • ${hld.division}</p>
                <div class="risk-badges">${riskBadges}</div>
            </div>
            <div class="hld-status">
                <span class="status-badge ${hld.status.toLowerCase().replace(" ", "-")}">${hld.status}</span>
                <button class="btn-secondary" onclick="app.viewHLD(${hld.id})">View Details</button>
            </div>
        `;

    return item;
  }
  renderCreateForm() {
    // Add AI suggestions based on form input
    const titleInput = document.getElementById("hld-title");
    if (titleInput) {
      titleInput.addEventListener(
        "input",
        this.debounce(() => {
          this.showAISuggestions(titleInput.value);
        }, 500),
      );
    }
  }

  showAISuggestions(title) {
    const suggestionsDiv = document.querySelector(
      ".ai-suggestions .suggestion-text",
    );
    if (!suggestionsDiv) return;

    let suggestion =
      "Consider using 'PETRONAS-' prefix for enterprise applications";

    if (title.toLowerCase().includes("customer")) {
      suggestion =
        "Customer-facing applications should follow PETRONAS Digital Experience guidelines";
    } else if (title.toLowerCase().includes("mobile")) {
      suggestion =
        "Mobile applications require offline capability assessment per PETRONAS Mobile Strategy";
    } else if (
      title.toLowerCase().includes("analytics") ||
      title.toLowerCase().includes("data")
    ) {
      suggestion =
        "Analytics platforms must comply with PETRONAS Data Governance Framework";
    }

    suggestionsDiv.innerHTML = `<strong>AI Suggestion:</strong> ${suggestion}`;
  }

  renderReviewQueue() {
    const reviewView = document.getElementById("review-view");
    if (!reviewView) return;

    const pendingHLDs = mockHLDs.filter(
      (hld) => hld.status === "In Review" || hld.status === "Submitted",
    );

    let reviewContent = `
            <div class="review-header">
                <h1>Review Queue</h1>
                <div class="filter-bar">
                    <select class="filter-select" onchange="app.filterReviews(this.value)">
                        <option value="all">All Risk Levels</option>
                        <option value="high">High Risk Only</option>
                        <option value="medium">Medium Risk</option>
                        <option value="low">Low Risk</option>
                    </select>
                </div>
            </div>
            <div class="review-list">
        `;

    pendingHLDs.forEach((hld) => {
      const highestRisk =
        hld.risks.length > 0
          ? hld.risks.reduce((prev, curr) =>
              prev.level === "high" ? prev : curr,
            )
          : { level: "low", type: "No risks identified" };

      reviewContent += `
                <div class="review-item" data-risk="${highestRisk.level}">
                    <div class="review-card">
                        <div class="review-header-info">
                            <h3>${hld.title}</h3>
                            <span class="review-status ${hld.status.toLowerCase().replace(" ", "-")}">${hld.status}</span>
                        </div>
                        <div class="review-details">
                            <p><strong>Author:</strong> ${hld.author} | <strong>Submitted:</strong> ${hld.submittedDate}</p>
                            <p><strong>Type:</strong> ${hld.type} ${hld.workloadType} | <strong>Division:</strong> ${hld.division}</p>
                        </div>
                        <div class="risk-analysis">
                            <h4>AI Risk Analysis</h4>
                            ${
                              hld.risks.length > 0
                                ? hld.risks
                                    .map(
                                      (risk) => `
                                <div class="risk-item ${risk.level}">
                                    <span class="risk-type">${risk.type}</span>
                                    <span class="risk-reason">${risk.reason}</span>
                                </div>
                            `,
                                    )
                                    .join("")
                                : '<p class="no-risks">No significant risks identified</p>'
                            }
                        </div>
                        <div class="review-actions">
                            <button class="btn-approve" onclick="app.approveHLD(${hld.id})">Approve</button>
                            <button class="btn-reject" onclick="app.rejectHLD(${hld.id})">Request Changes</button>
                            <button class="btn-secondary" onclick="app.viewHLD(${hld.id})">View Full Details</button>
                        </div>
                    </div>
                </div>
            `;
    });

    reviewContent += "</div>";
    reviewView.innerHTML = reviewContent;
  }

  renderAIAssistant() {
    // AI Assistant is already rendered in HTML, just ensure chat functionality
    const chatInput = document.getElementById("chat-input");
    if (chatInput) {
      chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.sendMessage();
        }
      });
    }
  }

  sendMessage() {
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    if (!chatInput.value.trim()) return;

    const userMessage = chatInput.value.trim();

    // Add user message
    this.addChatMessage(userMessage, "user");

    // Clear input
    chatInput.value = "";

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = this.getAIResponse(userMessage);
      this.addChatMessage(aiResponse, "ai");
    }, aiProcessingTime);
  }
  addChatMessage(message, sender) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    const avatar = sender === "ai" ? "🤖" : mockUsers.current.avatar;

    messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${message}</div>
        `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  getAIResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Check for keyword matches
    for (const [keyword, response] of Object.entries(aiResponses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    // Default responses based on context
    if (message.includes("hld") || message.includes("design")) {
      return "For HLD submissions, ensure you complete all mandatory sections: Project Information, TOE Components, Security Declaration, and Data Management. The AI will automatically flag potential risks for reviewer attention.";
    }

    if (message.includes("risk") || message.includes("flag")) {
      return "Risk flags are automatically generated based on your security and data declarations. High and Critical risks require explicit reviewer acknowledgment. Common risk categories include Security, Data, Availability, and Governance risks.";
    }

    if (message.includes("approval") || message.includes("review")) {
      return "The approval process involves automated TOE gap analysis, risk flagging, and human reviewer assessment. Reviewers must acknowledge all gaps, deviations, and risk flags before making approval decisions.";
    }

    return "I can help you with PETRONAS architecture standards, TOE guidelines, security requirements, data classification, and information from approved HLDs. What specific topic would you like to know about?";
  }

  viewHLD(id) {
    const hld = mockHLDs.find((h) => h.id === id);
    if (!hld) return;

    this.currentHLD = hld;
    this.showHLDModal(hld);
  }

  showHLDModal(hld) {
    // Create modal overlay
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${hld.title}</h2>
                    <button class="modal-close" onclick="app.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="hld-details">
                        <div class="detail-section">
                            <h3>Project Information</h3>
                            <div class="detail-grid">
                                <div><strong>Type:</strong> ${hld.type}</div>
                                <div><strong>Landscape:</strong> ${hld.landscape}</div>
                                <div><strong>Division:</strong> ${hld.division}</div>
                                <div><strong>Workload:</strong> ${hld.workloadType}</div>
                                <div><strong>Author:</strong> ${hld.author}</div>
                                <div><strong>Status:</strong> ${hld.status}</div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>TOE Components</h3>
                            <div class="toe-components">
                                ${hld.toeComponents
                                  .map(
                                    (comp) => `
                                    <div class="toe-component ${comp.status}">
                                        <span class="component-name">${comp.name}</span>
                                        <span class="component-classification">${comp.classification}</span>
                                        <span class="component-status">${comp.status}</span>
                                    </div>
                                `,
                                  )
                                  .join("")}
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Risk Analysis</h3>
                            <div class="risk-details">
                                ${
                                  hld.risks.length > 0
                                    ? hld.risks
                                        .map(
                                          (risk) => `
                                    <div class="risk-detail ${risk.level}">
                                        <div class="risk-header">
                                            <span class="risk-type">${risk.type}</span>
                                            <span class="risk-level">${risk.level.toUpperCase()}</span>
                                        </div>
                                        <p class="risk-reason">${risk.reason}</p>
                                    </div>
                                `,
                                        )
                                        .join("")
                                    : "<p>No risks identified</p>"
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
  }

  closeModal() {
    const modal = document.querySelector(".modal-overlay");
    if (modal) {
      modal.remove();
    }
  }

  approveHLD(id) {
    const hld = mockHLDs.find((h) => h.id === id);
    if (hld) {
      hld.status = "Approved";
      hld.approvedDate = new Date().toISOString().split("T")[0];
      this.renderReviewQueue();
      this.showNotification(`${hld.title} has been approved`, "success");
    }
  }

  rejectHLD(id) {
    const hld = mockHLDs.find((h) => h.id === id);
    if (hld) {
      hld.status = "Changes Requested";
      this.renderReviewQueue();
      this.showNotification(`Changes requested for ${hld.title}`, "warning");
    }
  }

  filterReviews(riskLevel) {
    const reviewItems = document.querySelectorAll(".review-item");
    reviewItems.forEach((item) => {
      if (riskLevel === "all" || item.dataset.risk === riskLevel) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  setupEventListeners() {
    // Global event listeners
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        this.closeModal();
      }
    });
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

// Initialize the application
const app = new DesignXApp();

// Global functions for onclick handlers
function viewHLD(id) {
  app.viewHLD(id);
}

function sendMessage() {
  app.sendMessage();
}
