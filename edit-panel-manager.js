/**
 * EditPanelManager - Manages the edit panel for modifying form elements
 */
class EditPanelManager {
    /**
     * Initialize the Edit Panel Manager
     */
    constructor() {
        this.editContainer = document.querySelector(".edit-container");
        this.formElementsManager = new FormElementsManager();

        // Add global event listener for cancel button
        document.addEventListener("click", (e) => {
            if (e.target && e.target.id === "cancel-edit") {
                this.clearEditPanel();
            }
        });
    }

    /**
     * Show the edit panel for a form element
     * @param {HTMLElement} element - The element to edit
     */
    showEditPanel(element) {
        if (!element || !this.editContainer) return;

        // Remove the idle state from the edit container
        this.editContainer.classList.remove("idle");

        const elementType = element.getAttribute("data-element-type");
        const elementId = element.getAttribute("data-element-id");
        const elementName =
            this.formElementsManager.getElementById(elementType)?.name ||
            "Element";

        // Start building the edit panel HTML
        let editPanelHtml = `
            <div class="edit-panel p-3" data-editing-id="${elementId}">
                <h6 class="mb-3">Edit ${elementName}</h6>
        `;

        // Generate the content of the edit panel based on element type
        switch (elementType) {
            case "title":
                editPanelHtml += this.getTitleEditHTML(element);
                break;
            case "desc":
                editPanelHtml += this.getDescEditHTML(element);
                break;
            case "line":
                editPanelHtml += `
                    <div class="mb-3">
                        <p class="text-muted">This element has no editable properties.</p>
                    </div>
                `;
                break;
            case "banner":
                editPanelHtml += this.getBannerEditHTML(element);
                break;
            case "section":
                editPanelHtml += this.getSectionEditHTML(element);
                break;
            default:
                editPanelHtml += this.getStandardFieldEditHTML(
                    element,
                    elementType
                );
                break;
        }

        // Add save and cancel buttons
        editPanelHtml += `
            <button class="btn btn-dark btn-save-element w-100 mt-3">Save Changes</button>
            
            <div class="text-center mt-3">
                <button class="btn btn-outline-secondary w-100 mt-3" id="cancel-edit">Cancel</button>
            </div>
        </div>
        `;

        // Set the edit panel HTML
        this.editContainer.innerHTML =
            '<h5 class="builderTitle">Edit Section</h5>' + editPanelHtml;

        // Update input values based on current element
        this.updateEditPanelValues(element);

        // Initialize form fields for the edit panel
        this.initializeEditPanelFields();

        // Set up edit panel event listeners
        this.setupEditPanelEvents(elementType);
    }

    /**
     * Generate edit panel HTML for title element
     * @param {HTMLElement} element - The title element
     * @returns {string} HTML for the edit panel
     */
    getTitleEditHTML(element) {
        const title = element.querySelector("h5")?.textContent || "Title";

        return `
            <div class="mb-3">
                <label class="form-label">Title Text</label>
                <input type="text" class="form-control contact-form" id="edit-title-text" value="${title}">
            </div>
        `;
    }

    /**
     * Generate edit panel HTML for description element
     * @param {HTMLElement} element - The description element
     * @returns {string} HTML for the edit panel
     */
    getDescEditHTML(element) {
        const desc = element.querySelector("p")?.textContent || "";

        return `
            <div class="mb-3">
                <label class="form-label">Description Text</label>
                <textarea class="form-control contact-form" id="edit-desc-text" rows="3">${desc}</textarea>
            </div>
        `;
    }

    /**
     * Generate edit panel HTML for banner element
     * @param {HTMLElement} element - The banner element
     * @returns {string} HTML for the edit panel
     */
    getBannerEditHTML(element) {
        const img = element.querySelector("img");
        const imageSrc = img?.getAttribute("src") || "/image/ppim1.png";
        const width = img?.style.width || "100%";
        const maxHeight = img?.style.maxHeight || "200px";

        return `
            <div class="mb-3">
                <label class="form-label">Image Source</label>
                <select class="form-control contact-form" id="edit-banner-image">
                    <option value="/image/ppim1.png" ${
                        imageSrc === "/image/ppim1.png" ? "selected" : ""
                    }>PPIM Logo</option>
                    <option value="/image/BANNERPPIM25-08.jpg" ${
                        imageSrc === "/image/BANNERPPIM25-08.jpg"
                            ? "selected"
                            : ""
                    }>PPIM Banner 1</option>
                    <option value="/image/ppimbanner1.jpg" ${
                        imageSrc === "/image/ppimbanner1.jpg" ? "selected" : ""
                    }>PPIM Banner 2</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Width</label>
                <input type="text" class="form-control contact-form" id="edit-banner-width" value="${width}">
            </div>
            <div class="mb-3">
                <label class="form-label">Max Height</label>
                <input type="text" class="form-control contact-form" id="edit-banner-max-height" value="${maxHeight}">
            </div>
        `;
    }

    /**
     * Generate edit panel HTML for section element
     * @param {HTMLElement} element - The section element
     * @returns {string} HTML for the edit panel
     */
    getSectionEditHTML(element) {
        const sectionTitle =
            element.querySelector("h5")?.textContent || "Section Title";
        const sectionDesc =
            element.querySelector("p")?.textContent ||
            "Section description goes here.";

        return `
            <div class="mb-3">
                <label class="form-label">Section Title</label>
                <input type="text" class="form-control contact-form" id="edit-section-title" value="${sectionTitle}">
            </div>
            <div class="mb-3">
                <label class="form-label">Section Description</label>
                <textarea class="form-control contact-form" id="edit-section-desc" rows="3">${sectionDesc}</textarea>
            </div>
        `;
    }

    /**
     * Generate edit panel HTML for standard form fields
     * @param {HTMLElement} element - The form element
     * @param {string} elementType - Element type
     * @returns {string} HTML for the edit panel
     */
    getStandardFieldEditHTML(element, elementType) {
        // Get label and required status
        const labelElement = element.querySelector(".form-label");
        const label = labelElement
            ? labelElement.textContent.replace(" *", "")
            : "Label";
        const required = labelElement
            ? labelElement.textContent.includes("*")
            : false;

        // Start with the common label field
        let html = `
            <div class="mb-3">
                <label class="form-label">Label</label>
                <input type="text" class="form-control contact-form" id="edit-label" value="${label}">
            </div>
        `;

        // Add placeholder field for input elements
        if (["text", "textarea", "number"].includes(elementType)) {
            const input = element.querySelector("input, textarea");
            const placeholder = input?.placeholder || "Placeholder";

            html += `
                <div class="mb-3">
                    <label class="form-label">Placeholder</label>
                    <input type="text" class="form-control contact-form" id="edit-placeholder" value="${placeholder}">
                </div>
            `;
        }

        // Add type-specific fields
        switch (elementType) {
            case "dropdown":
            case "checkbox":
            case "radio":
                html += this.getOptionsEditHTML(element, elementType);
                break;

            case "number":
                const numberInput = element.querySelector("input");
                const min = numberInput?.min || "";
                const max = numberInput?.max || "";

                html += `
                    <div class="row mb-3">
                        <div class="col">
                            <label class="form-label">Min Value</label>
                            <input type="number" class="form-control contact-form" id="edit-min" value="${min}">
                        </div>
                        <div class="col">
                            <label class="form-label">Max Value</label>
                            <input type="number" class="form-control contact-form" id="edit-max" value="${max}">
                        </div>
                    </div>
                `;
                break;

            case "textarea":
                const textarea = element.querySelector("textarea");
                const rows = textarea?.rows || 3;

                html += `
                    <div class="mb-3">
                        <label class="form-label">Rows</label>
                        <input type="number" class="form-control contact-form" id="edit-rows" value="${rows}">
                    </div>
                `;
                break;

            case "file":
                // Find max size from the hint text
                const hintElement = element.querySelector(".upload-hint");
                const maxSize = hintElement
                    ? (hintElement.textContent.match(/\d+/) || [5])[0]
                    : 5;

                // Get accepted file types from input
                const fileInput = element.querySelector('input[type="file"]');
                const acceptTypes = fileInput?.accept || "";
                const hasJpg =
                    acceptTypes.includes("image/jpeg") ||
                    acceptTypes.includes("image/jpg");
                const hasPng = acceptTypes.includes("image/png");
                const hasPdf = acceptTypes.includes("application/pdf");

                html += `
                    <div class="mb-3">
                        <label class="form-label">Max File Size (MB)</label>
                        <input type="number" class="form-control contact-form" id="edit-maxsize" value="${maxSize}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Accepted File Types</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="file-type-jpg" ${
                                hasJpg ? "checked" : ""
                            }>
                            <label class="form-check-label" for="file-type-jpg">JPG/JPEG</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="file-type-png" ${
                                hasPng ? "checked" : ""
                            }>
                            <label class="form-check-label" for="file-type-png">PNG</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="file-type-pdf" ${
                                hasPdf ? "checked" : ""
                            }>
                            <label class="form-check-label" for="file-type-pdf">PDF</label>
                        </div>
                    </div>
                `;
                break;
        }

        // Add required checkbox for all fields
        if (elementType !== "section") {
            html += `
                <div class="mb-3">
                    <label class="form-label">Validation</label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="edit-required" ${
                            required ? "checked" : ""
                        }>
                        <label class="form-check-label" for="edit-required">Make this field required</label>
                    </div>
                </div>
            `;
        }

        return html;
    }

    /**
     * Generate options edit HTML for dropdown, checkbox and radio elements
     * @param {HTMLElement} element - The form element
     * @param {string} elementType - Element type
     * @returns {string} HTML for options editing
     */
    getOptionsEditHTML(element, elementType) {
        let options = [];

        // Get the options based on element type
        if (elementType === "dropdown") {
            element.querySelectorAll("option").forEach((option) => {
                if (option.textContent !== "Select an option") {
                    options.push(option.textContent);
                }
            });
        } else {
            element.querySelectorAll(".form-check-label").forEach((label) => {
                options.push(label.textContent);
            });
        }

        // If no options found, add defaults
        if (options.length === 0) {
            options = ["Option 1", "Option 2"];
        }

        // Generate options container HTML
        let optionsHtml = `
            <div class="mb-3">
                <label class="form-label">Options</label>
                <div class="options-container">
        `;

        // Add each option
        options.forEach((option) => {
            optionsHtml += `
                <div class="input-group mb-2">
                    <input type="text" class="form-control contact-form" value="${option}">
                    <button class="btn btn-outline-secondary btn-remove-option">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });

        optionsHtml += `
                </div>
                <button class="btn btn-sm btn-add-option mt-2">
                    <i class="fas fa-plus"></i> Add Option
                </button>
            </div>
        `;

        return optionsHtml;
    }

    /**
     * Update the edit panel with values from the element
     * @param {HTMLElement} element - The element being edited
     */
    updateEditPanelValues(element) {
        // This is now handled directly in the field generation methods
        // Each method extracts the values and adds them to the HTML
    }

    /**
     * Initialize form fields in the edit panel
     */
    initializeEditPanelFields() {
        document
            .querySelectorAll(".edit-panel .contact-form")
            .forEach((field) => {
                const label = field.previousElementSibling;
                if (label && label.classList.contains("form-label")) {
                    label.classList.add("animated-label");

                    // Set initial state
                    if (field.value.trim()) {
                        label.classList.add("visible");
                    }

                    // Add event listener
                    field.addEventListener("input", function () {
                        if (this.value.trim()) {
                            label.classList.add("visible");
                        } else {
                            label.classList.remove("visible");
                        }
                    });

                    // Trigger input event to show/hide label
                    field.dispatchEvent(new Event("input"));

                    // Auto-expand for textarea
                    if (field.tagName === "TEXTAREA") {
                        field.addEventListener("input", function () {
                            this.style.height = "auto";
                            this.style.height = this.scrollHeight + "px";
                        });

                        // Trigger initial height adjustment
                        field.dispatchEvent(new Event("input"));
                    }
                }
            });
    }

    /**
     * Set up event listeners for the edit panel
     * @param {string} elementType - The type of element being edited
     */
    setupEditPanelEvents(elementType) {
        // Handle the save button
        const saveBtn = document.querySelector(".btn-save-element");
        if (saveBtn) {
            saveBtn.addEventListener("click", () => {
                const editPanel = document.querySelector(".edit-panel");
                const elementId = editPanel.getAttribute("data-editing-id");
                const elementToEdit = document.querySelector(
                    `[data-element-id="${elementId}"]`
                );

                if (elementToEdit) {
                    // Get the element type from the element itself
                    const actualElementType =
                        elementToEdit.getAttribute("data-element-type");

                    // Update the element based on the edit panel values
                    this.updateElement(elementToEdit, actualElementType);

                    // Clear the edit panel
                    this.clearEditPanel();
                }
            });
        }

        // Handle add option button for dropdowns, checkboxes, radio buttons
        const addOptionBtn = document.querySelector(".btn-add-option");
        if (addOptionBtn) {
            addOptionBtn.addEventListener("click", () => {
                const optionsContainer =
                    document.querySelector(".options-container");
                const newOption = document.createElement("div");
                newOption.className = "input-group mb-2";
                newOption.innerHTML = `
                    <input type="text" class="form-control contact-form" value="New Option">
                    <button class="btn btn-outline-secondary btn-remove-option">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                optionsContainer.appendChild(newOption);

                // Add event listener for the remove button
                const removeBtn = newOption.querySelector(".btn-remove-option");
                if (removeBtn) {
                    removeBtn.addEventListener("click", function () {
                        newOption.remove();
                    });
                }

                // Initialize form field behavior
                const input = newOption.querySelector("input");
                if (input) {
                    input.focus();
                }
            });
        }

        // Handle remove option buttons
        document.querySelectorAll(".btn-remove-option").forEach((btn) => {
            btn.addEventListener("click", function () {
                this.closest(".input-group").remove();
            });
        });
    }

    /**
     * Update form element based on edit panel values
     * @param {HTMLElement} element - The element to update
     * @param {string} elementType - Type of the element
     */
    updateElement(element, elementType) {
        // Handle different element types
        switch (elementType) {
            case "title":
                this.updateTitleElement(element);
                break;
            case "desc":
                this.updateDescElement(element);
                break;
            case "banner":
                this.updateBannerElement(element);
                break;
            case "section":
                this.updateSectionElement(element);
                break;
            case "line":
                // No editable properties for line separator
                break;
            default:
                this.updateFormField(element, elementType);
                break;
        }
    }

    /**
     * Update title element
     * @param {HTMLElement} element - The element to update
     */
    updateTitleElement(element) {
        const title =
            document.getElementById("edit-title-text")?.value || "Title";

        const titleElement = element.querySelector("h5");
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    /**
     * Update description element
     * @param {HTMLElement} element - The element to update
     */
    updateDescElement(element) {
        const desc = document.getElementById("edit-desc-text")?.value || "";

        const descElement = element.querySelector("p");
        if (descElement) {
            descElement.textContent = desc;
        }
    }

    /**
     * Update banner element
     * @param {HTMLElement} element - The element to update
     */
    updateBannerElement(element) {
        const imageSrc =
            document.getElementById("edit-banner-image")?.value ||
            "/image/ppim1.png";
        const width =
            document.getElementById("edit-banner-width")?.value || "100%";
        const maxHeight =
            document.getElementById("edit-banner-max-height")?.value || "200px";

        const imageElement = element.querySelector("img");
        if (imageElement) {
            imageElement.setAttribute("src", imageSrc);
            imageElement.style.width = width;
            imageElement.style.maxHeight = maxHeight;
            imageElement.style.objectFit = "contain";
        }
    }

    /**
     * Update section element
     * @param {HTMLElement} element - The element to update
     */
    updateSectionElement(element) {
        const sectionTitle =
            document.getElementById("edit-section-title")?.value ||
            "Section Title";
        const sectionDesc =
            document.getElementById("edit-section-desc")?.value || "";

        const sectionContainer = element.querySelector(".card-body > div");
        if (sectionContainer) {
            sectionContainer.innerHTML = `
                <h5>${sectionTitle}</h5>
                <hr>
                <p class="text-muted">${sectionDesc}</p>
            `;
        }
    }

    /**
     * Update form field elements (text, number, textarea, select, radio, checkbox, file)
     * @param {HTMLElement} element - The element to update
     * @param {string} elementType - Type of element
     */
    updateFormField(element, elementType) {
        // Get common field values
        const label = document.getElementById("edit-label")?.value || "Label";
        const placeholder =
            document.getElementById("edit-placeholder")?.value || "Placeholder";
        const required =
            document.getElementById("edit-required")?.checked || false;

        // Update label and add required indicator if needed
        const labelElement = element.querySelector(".form-label");
        if (labelElement) {
            labelElement.textContent = label + (required ? " *" : "");
        }

        // Update element based on type
        switch (elementType) {
            case "text":
            case "number":
            case "date":
            case "time":
                this.updateInputField(
                    element,
                    elementType,
                    placeholder,
                    required
                );
                break;

            case "textarea":
                this.updateTextareaField(element, placeholder, required);
                break;

            case "dropdown":
                this.updateDropdownField(element, required);
                break;

            case "checkbox":
            case "radio":
                this.updateChoiceField(element, elementType, label, required);
                break;

            case "file":
                this.updateFileField(element, label, required);
                break;
        }
    }

    /**
     * Update input field (text, number, date, time)
     * @param {HTMLElement} element - The element to update
     * @param {string} elementType - Type of element
     * @param {string} placeholder - Placeholder text
     * @param {boolean} required - Whether field is required
     */
    updateInputField(element, elementType, placeholder, required) {
        const input = element.querySelector("input");
        if (!input) return;

        input.placeholder = placeholder;
        input.required = required;

        // Add or remove required-field class
        if (required) {
            input.classList.add("required-field");
        } else {
            input.classList.remove("required-field");
        }

        // Handle number input min/max
        if (elementType === "number") {
            const min = document.getElementById("edit-min")?.value;
            const max = document.getElementById("edit-max")?.value;

            if (min) input.min = min;
            if (max) input.max = max;
        }
    }

    /**
     * Update textarea field
     * @param {HTMLElement} element - The element to update
     * @param {string} placeholder - Placeholder text
     * @param {boolean} required - Whether field is required
     */
    updateTextareaField(element, placeholder, required) {
        const textarea = element.querySelector("textarea");
        if (!textarea) return;

        textarea.placeholder = placeholder;
        textarea.required = required;

        // Add or remove required-field class
        if (required) {
            textarea.classList.add("required-field");
        } else {
            textarea.classList.remove("required-field");
        }

        const rows = document.getElementById("edit-rows")?.value || 3;
        textarea.rows = rows;
    }

    /**
     * Update dropdown field
     * @param {HTMLElement} element - The element to update
     * @param {boolean} required - Whether field is required
     */
    updateDropdownField(element, required) {
        const select = element.querySelector("select");
        if (!select) return;

        select.required = required;

        // Add or remove required-field class
        if (required) {
            select.classList.add("required-field");
        } else {
            select.classList.remove("required-field");
        }

        // Clear existing options
        select.innerHTML =
            "<option selected disabled>Select an option</option>";

        // Add new options from edit panel
        const options = document.querySelectorAll(".options-container input");
        options.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.textContent = option.value;
            select.appendChild(optionElement);
        });
    }

    /**
     * Update checkbox or radio field
     * @param {HTMLElement} element - The element to update
     * @param {string} elementType - Type of element (checkbox or radio)
     * @param {string} label - Field label
     * @param {boolean} required - Whether field is required
     */
    updateChoiceField(element, elementType, label, required) {
        const container = element.querySelector(".card-body > div");
        if (!container) return;

        // Keep the label, remove existing options
        const labelHtml = `<label class="form-label d-block">${
            label + (required ? " *" : "")
        }</label>`;
        let newHtml = labelHtml;

        // Add new options from edit panel
        const options = document.querySelectorAll(".options-container input");
        options.forEach((option, index) => {
            const id = `${elementType}-${Date.now()}-${index}`;
            const name =
                elementType === "radio"
                    ? `${elementType}-group-${Date.now()}`
                    : `${id}-opt`;

            newHtml += `
                <div class="form-check">
                    <input class="form-check-input ${
                        required ? "required-field" : ""
                    }" 
                           type="${elementType}" ${
                elementType === "radio" ? `name="${name}"` : ""
            } id="${id}" 
                           ${required && index === 0 ? "required" : ""}>
                    <label class="form-check-label" for="${id}">${
                option.value
            }</label>
                </div>
            `;
        });

        container.innerHTML = newHtml;
    }

    /**
     * Update file upload field
     * @param {HTMLElement} element - The element to update
     * @param {string} label - Field label
     * @param {boolean} required - Whether field is required
     */
    updateFileField(element, label, required) {
        const fileInput = element.querySelector('input[type="file"]');
        const fileContainer = element.querySelector(".card-body > div");
        if (!fileInput || !fileContainer) return;

        fileInput.required = required;

        // Add or remove required-field class
        if (required) {
            fileInput.classList.add("required-field");
        } else {
            fileInput.classList.remove("required-field");
        }

        // Update file upload label
        const fileLabel = fileContainer.querySelector(".form-label");
        if (fileLabel) {
            fileLabel.textContent = label + (required ? " *" : "");
        }

        // Update max file size hint
        const maxSize = document.getElementById("edit-maxsize")?.value || 5;
        const hintElement = fileContainer.querySelector(".upload-hint");
        if (hintElement) {
            hintElement.textContent = `Max size: ${maxSize}MB`;
        }

        // Update accepted file types
        const acceptedTypes = [];
        if (document.getElementById("file-type-jpg")?.checked) {
            acceptedTypes.push("image/jpeg");
            acceptedTypes.push("image/jpg");
        }
        if (document.getElementById("file-type-png")?.checked) {
            acceptedTypes.push("image/png");
        }
        if (document.getElementById("file-type-pdf")?.checked) {
            acceptedTypes.push("application/pdf");
        }

        fileInput.accept = acceptedTypes.join(",");

        // Re-initialize file uploader
        setTimeout(() => {
            const dropboxId = fileInput.id + "-dropbox";
            const previewContainerId = fileInput.id + "-preview-container";
            const imagePreviewId = fileInput.id + "-image-preview";
            const uploadPromptId = fileInput.id + "-upload-prompt";
            const cancelButtonId = fileInput.id + "-cancel-upload";

            new FileUploader({
                dropboxId: dropboxId,
                inputId: fileInput.id,
                previewContainerId: previewContainerId,
                imagePreviewId: imagePreviewId,
                uploadPromptId: uploadPromptId,
                cancelButtonId: cancelButtonId,
                maxSizeMB: maxSize,
                acceptedTypes: acceptedTypes,
                labelId: null,
            });
        }, 0);
    }

    /**
     * Clear the edit panel
     */
    clearEditPanel() {
        this.editContainer.classList.add("idle");
        this.editContainer.innerHTML =
            '<h5 class="builderTitle">Edit Section</h5>';
    }
}
