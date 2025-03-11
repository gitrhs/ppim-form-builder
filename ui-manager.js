/**
 * UIManager - Handles UI-related functionality like responsive design
 */
class UIManager {
    /**
     * Set up mobile navigation and burger menu
     */
    setupMobileNavigation() {
        const row = document.querySelector(".row");
        if (!row) return;

        // Create burger icon for mobile
        const burgerIcon = document.createElement("div");
        burgerIcon.className = "burger-icon";
        burgerIcon.innerHTML = `
            <i class="fas fa-bars burger-icon-data"></i>
        `;
        row.prepend(burgerIcon);

        // Add event listener to toggle menu
        burgerIcon.addEventListener("click", () => {
            const sectionList = document.querySelector(".sectionList");
            if (sectionList) {
                sectionList.classList.toggle("show");
            }
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            const sectionList = document.querySelector(".sectionList");
            const burgerIcon = document.querySelector(".burger-icon");

            if (
                sectionList &&
                burgerIcon &&
                !sectionList.contains(e.target) &&
                !burgerIcon.contains(e.target)
            ) {
                sectionList.classList.remove("show");
            }
        });
    }

    /**
     * Helper function to copy text to clipboard
     * @param {string} text - Text to copy
     */
    static copyToClipboard(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }

    /**
     * Show a modal dialog
     * @param {HTMLElement} modal - Modal element
     */
    static showModal(modal) {
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    /**
     * Create a modal with tabs for HTML/JS code
     * @param {string} htmlCode - HTML code
     * @param {string} jsCode - JavaScript code
     * @returns {HTMLElement} Modal element
     */
    static createCodeModal(jsonCode, htmlCode, jsCode) {
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = "exportModal";
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-hidden", "true");

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Generated Form Code</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="nav nav-tabs" id="codeTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="saveform-tab" data-bs-toggle="tab" data-bs-target="#saveform-content" type="button" role="tab" aria-selected="true">Save</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="html-tab" data-bs-toggle="tab" data-bs-target="#html-content" type="button" role="tab" aria-controls="html" aria-selected="true">HTML</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="js-tab" data-bs-toggle="tab" data-bs-target="#js-content" type="button" role="tab" aria-controls="js" aria-selected="false">JavaScript</button>
                            </li>
                        </ul>
                        <div class="tab-content mt-3" id="codeTabContent">
                            <div class="tab-pane fade show active" id="saveform-content" role="tabpanel" aria-labelledby="saveform-tab">
                                <form id="saveFormIntoServer">
                                    <pre class="bg-light p-3" style="max-height: 400px; overflow-y: auto;"><code>${JSON.stringify(
                                        jsonCode,
                                        null,
                                        2
                                    )}</code></pre>
                                    <div class="text-center mt-4">
                                        <button type="submit" id="submitForm" class="btn btn-dark px-4 py-2">Save Form</button>
                                    </div>
                                </form>
                            </div>
                            <div class="tab-pane fade show" id="html-content" role="tabpanel" aria-labelledby="html-tab">
                                <pre class="bg-light p-3" style="max-height: 400px; overflow-y: auto;"><code>${htmlCode
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")}</code></pre>
                                <button class="btn btn-dark btn-sm copy-html-btn mt-2">
                                    <i class="fas fa-copy me-1"></i> Copy HTML
                                </button>
                            </div>
                            <div class="tab-pane fade" id="js-content" role="tabpanel" aria-labelledby="js-tab">
                                <pre class="bg-light p-3" style="max-height: 400px; overflow-y: auto;"><code>${jsCode
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")}</code></pre>
                                <button class="btn btn-dark btn-sm copy-js-btn mt-2">
                                    <i class="fas fa-copy me-1"></i> Copy JavaScript
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p class="text-muted me-auto"><small>* Remember to include FormUtils.js in your project</small></p>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add copy functionality
        modal.addEventListener("shown.bs.modal", () => {
            modal
                .querySelector(".copy-html-btn")
                .addEventListener("click", function () {
                    UIManager.copyToClipboard(htmlCode);
                    this.innerHTML =
                        '<i class="fas fa-check me-1"></i> Copied!';
                    setTimeout(() => {
                        this.innerHTML =
                            '<i class="fas fa-copy me-1"></i> Copy HTML';
                    }, 2000);
                });

            modal
                .querySelector(".copy-js-btn")
                .addEventListener("click", function () {
                    UIManager.copyToClipboard(jsCode);
                    this.innerHTML =
                        '<i class="fas fa-check me-1"></i> Copied!';
                    setTimeout(() => {
                        this.innerHTML =
                            '<i class="fas fa-copy me-1"></i> Copy JavaScript';
                    }, 2000);
                });
        });

        // Remove modal when hidden
        modal.addEventListener("hidden.bs.modal", function () {
            document.body.removeChild(modal);
        });

        return modal;
    }
}
